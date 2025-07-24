<template>
    <div class="page-list">
      <v-card class="px-sm-4 px-1 py-2" style="border:0;" :outlined="!flat" :flat="flat">
        <v-card-title class="d-flex align-start px-2 justify-space-between align-sm-center flex-column flex-sm-row">
          <h4>{{ title }}<slot :filter="filter" name="title-after"></slot></h4>
          <pagination :skip="skip" :take="take" :has-previous-page="hasPreviousPage" :has-next-page="hasNextPage" @updateSize="changeSize" @goFirst="goFirst" @prev="prev" @next="next"></pagination>
        </v-card-title>
        <slot :items="items" :loading="loading"></slot>
        <v-card-actions class="d-flex justify-end">
          <pagination :skip="skip" :take="take" :has-previous-page="hasPreviousPage" :has-next-page="hasNextPage" @updateSize="changeSize" @goFirst="goFirst" @prev="prev" @next="next"></pagination>
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
          hasPreviousPage: {
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
              skip: 0,
              take: this.size,
              filter: {},
          }
      },
      computed: {
          ...mapGetters('Block', ['size']),
      },
      beforeDestroy() {
      },
      async created() {
          this.$watch('$route.query', async (q) => {
              this.resetFilter()
              this.$emit('loadItems', this.$route.query)
          })
  
          this.resetFilter()
  
          if (this.filter.skip) {
              this.load()
          } else {
              this.goFirst()
          }
      },
      methods: {
          async resetFilter() {
              this.filter = {};
              this.skip = 0;
              this.take = this.size;
              ['skip', 'take', ...this.acceptFilter].forEach(f => {
                  if (this.$route.query[f] != undefined) {
                      Vue.set(this.filter, f, this.$route.query[f])
                  }
              })
              if (this.filter['skip']) {
                  this.skip = Number(this.filter['skip'])
              }
              this.changeSize(Number(this.filter.take) || 20, true)
          },
  
          async load() {
              if (this.filter['skip'] == 0) {
                  delete this.filter['skip']
                  if (this.filter['take'] == 20) {
                      delete this.filter['take']
                  }
              }
  
              this.$router[this.routerReplace ? 'replace':'push']({query:this.filter}).catch(() => {
                  this.$emit('loadItems', this.$route.query)
              })
          },
          goFirst() {
              this.skip = 0
              this.take = this.size
              this.filter.take = this.size
              this.filter.skip = this.skip
              this.load()
          },
          next() {
              if (this.loading) return
              this.skip = this.skip + this.size
              this.take = this.size
              this.filter.take = this.size
              this.filter.skip = this.skip
              this.load()
          },
          prev() {
            if (this.loading) return
            if ((this.skip - this.size) < 0) {
                this.skip = 0
            } else {
                this.skip = this.skip - this.size
            }
            this.take = this.size
            this.filter.take = this.size
            this.filter.skip = this.skip
            this.load()
          },
          changeSize(size, noReset = false) {
              this.filter.take = size
              this.take = size
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