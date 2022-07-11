<template>
  <v-container fluid class="px-0 py-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Blocks</h1>
      <v-divider class="my-2"></v-divider>

      <v-row>
        <v-col class="px-0">
          <page-list-wrapper title=""
                             :items="showLatest ? latestBlocks : blocks"
                             :before="showLatest ? latestBlocksBefore : before"
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
import api from "../api"
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
            before: null
        }
    },
    computed: {
        ...mapGetters('Block', ['size', 'loading', 'latestBlocks', 'latestBlocksBefore'])
    },
    async created() {
    },
    methods: {
        async loadBlocks({page, before, limit}) {
            this.showLatest = (!page || page == 1)
            if (this.showLatest) return

            this.loadings.blocks = true
            try {
                let {blocks, before: nextBefore} = await api.getBlocks({page, before, limit: this.size})
                this.blocks = blocks
                this.before = String(nextBefore)
            } finally {
                this.loadings.blocks = false
            }
        },
    }
}
</script>

<style scoped lang="scss">
</style>
