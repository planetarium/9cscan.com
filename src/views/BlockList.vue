<template>
  <v-container fluid class="px-0 py-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Blocks</h1>
      <v-row>
        <v-col class="px-0">
          <page-list-wrapper title=""
                             :items="showLatest ? latestBlocks : blocks"
                             :hasNextPage="hasNextPage"
                             :hasPreviousPage="hasPreviousPage"
                             @loadItems="loadBlocks"
                             :loading="showLatest ? loading : loadings.blocks"
          >
            <template v-slot:default="{items, loading}">
              <block-table :blocks="items" detail :loading="loading"></block-table>
            </template>
          </page-list-wrapper>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { gqlClient } from "../mimir-gql/client"
import {mapGetters} from "vuex"
import BlockTable from "@/components/BlockTable";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/ui/Pagination";
import PageListWrapper from "@/components/PageListWrapper";
export default {
    name: 'BlockList',
    components: {PageListWrapper, Pagination, TransactionTable, BlockTable},
    mixins: [],
    data() {
        return {
            showLatest: true,
            loadings: {
                blocks: false
            },
            blocks: [],
            hasNextPage: true,
            hasPreviousPage: false
        }
    },
    computed: {
        ...mapGetters('Block', ['size', 'loading', 'latestBlocks'])
    },
    async created() {
    },
    methods: {
        async loadBlocks({skip, take}) {
            this.showLatest = (!skip || skip == 0)
            if (this.showLatest) return

            this.loadings.blocks = true
            try {
                const skipNum = parseInt(skip) || 0
                const takeNum = parseInt(take) || this.size
                
                const response = await gqlClient.getBlocks(skipNum, takeNum)
                console.log(response.pageInfo.hasNextPage, response.pageInfo.hasPreviousPage, skip, take)
                this.blocks = response.items
                this.hasNextPage = response.pageInfo?.hasNextPage || false
                this.hasPreviousPage = response.pageInfo?.hasPreviousPage || false
            } catch (error) {
                console.error('Failed to load blocks:', error)
                this.blocks = []
                this.hasNextPage = false
                this.hasPreviousPage = false
            } finally {
                this.loadings.blocks = false
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
