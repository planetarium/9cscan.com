<template>
  <div class="page-list">
    <v-card class="px-sm-4 px-1 py-2" :outlined="!flat" :flat="flat">
      <v-card-title class="d-flex align-start px-2 justify-space-between align-sm-center flex-column flex-sm-row">
        <h4>{{ title }}<slot :filter="filter" name="title-after"></slot></h4>
        <pagination :size="size" :can-prev="canPrev" :can-next="canNext" :page="page" @updateSize="changeSize" @goFirst="goFirst" @prev="prev" @next="next"></pagination>
      </v-card-title>
      <slot :items="items" :loading="loading"></slot>
      <v-card-actions class="d-flex justify-end">
        <pagination :size="size" :can-prev="canPrev" :can-next="canNext" :page="page" @updateSize="changeSize" @goFirst="goFirst" @prev="prev" @next="next"></pagination>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Pagination from "@/components/ui/Pagination";
import Vue from "vue";

export default {
    name: 'PageListWrapper',
    components: {Pagination},
    props: {
        items: {
            type: Array
        },
        before: {
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        acceptFilter: {
            type: Array,
            default: () => ([])
        },
        routerReplace: {
            type: Boolean,
            default: false
        },
        flat: {
            type: Boolean,
            default: false
        }
    },
    mixins: [],
    data() {
        return {
            page: 1,
            filter: {},
            prevs: [],
        }
    },
    computed: {
        ...mapGetters('Block', ['size']),
        canPrev() {
            return this.prevs.length >= (this.page == 2 ? 1 : 2)
        },
        canNext() {
            return this.size == this.items.length && this.before != null
        }
    },
    beforeDestroy() {
    },
    async created() {
        this.$watch('$route.query', async (q) => {
            this.resetFilter()
            this.$emit('loadItems', this.$route.query)
        })

        this.resetFilter()

        if (this.filter.page && this.filter.before) {
            this.prevs.push(this.filter.before)
            this.load()
        } else {
            this.goFirst()
        }
    },
    methods: {
        async resetFilter() {
            this.filter = {};
            this.page = 1;
            ['page', 'before', 'limit', ...this.acceptFilter].forEach(f => {
                if (this.$route.query[f] != undefined) {
                    Vue.set(this.filter, f, this.$route.query[f])
                }
            })
            if (this.filter['page']) {
                this.page = Number(this.filter['page'])
            }
            this.changeSize(this.filter.limit || 20, true)
        },

        async load() {
            if (this.filter['page'] == 1) {
                delete this.filter['page']
                if (this.filter['limit'] == 20) {
                    delete this.filter['limit']
                }
            }


            this.$router[this.routerReplace ? 'replace':'push']({query:this.filter}).catch(() => {
                this.$emit('loadItems', this.$route.query)
            })
        },
        goFirst() {
            this.prevs = []
            this.page = 1
            this.filter.limit = this.size
            this.filter.page = this.page
            delete this.filter.before
            this.load()
        },
        next() {
            if (this.loading) return
            this.prevs.push(this.before)
            this.page = Number(this.page || 1) + 1
            this.filter.limit = this.size
            this.filter.page = this.page
            this.filter.before = this.before
            this.load()
        },
        prev() {
            if (this.loading) return
            this.prevs.pop()
            this.page -= 1
            this.filter.limit = this.size
            this.filter.before = _.last(this.prevs)
            this.filter.page -= 1
            this.load()
        },
        changeSize(size, noReset = false) {
            this.filter.limit = size
            this.$store.dispatch('Block/setSize', Number(size || 20))
            if (!noReset) {
                this.goFirst()
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
