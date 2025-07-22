<template>
  <div class="page-list">
    <v-card class="px-sm-4 px-1 py-2" style="border:0;" :outlined="!flat" :flat="flat">
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
        hasNextPage: {
            type: Boolean,
            default: false
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
        }
    },
    computed: {
        ...mapGetters('Block', ['size']),
        canPrev() {
            return this.page > 1
        },
        canNext() {
            return this.size == this.items.length && this.hasNextPage
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

        if (this.filter.page) {
            this.load()
        } else {
            this.goFirst()
        }
    },
    methods: {
        async resetFilter() {
            this.filter = {};
            this.page = 1;
            ['page', 'limit', ...this.acceptFilter].forEach(f => {
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
            this.page = 1
            this.filter.limit = this.size
            this.filter.page = this.page
            this.load()
        },
        next() {
            if (this.loading) return
            this.page = Number(this.page || 1) + 1
            this.filter.limit = this.size
            this.filter.page = this.page
            this.load()
        },
        prev() {
            if (this.loading) return
            this.page -= 1
            this.filter.limit = this.size
            this.filter.page = this.page
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
