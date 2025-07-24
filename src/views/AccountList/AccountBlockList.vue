<template>
  <v-container fluid class="px-0 py-0">
    <page-list-wrapper title=""
                       :items="blocks"
                       :hasNextPage="hasNextPage"
                       flat
                       @loadItems="loadBlocks"
                       :accept-filter="['t']"
                       :loading="loading"
                       routerReplace
    >
      <template v-slot:default="{items, loading}">
        <block-table :blocks="items" detail :loading="loading"></block-table>
      </template>
    </page-list-wrapper>
  </v-container>
</template>

<script>
import { gqlClient } from "@/mimir-gql/client"
import {mapGetters} from "vuex"
import BlockTable from "@/components/BlockTable";
import PageListWrapper from "@/components/PageListWrapper";
export default {
    name: 'AccountBlockList',
    components: {PageListWrapper, BlockTable},
    mixins: [],
    props: ['miner'],
    data() {
        return {
            loading: false,
            page: Number(this.$route.query.t == 'mined' && this.$route.query.page || 1),
            filter: null,
            blocks: [],
            hasNextPage: false
        }
    },
    computed: {
        ...mapGetters('Block', ['size'])
    },
    async created() {
    },
    methods: {
        async loadBlocks({page, limit}) {
            this.loading = true
            try {
                limit = parseInt(limit) || this.size
                const pageNum = parseInt(page) || 1
                const skip = (pageNum - 1) * limit
                const filter = { miner: this.normalizeAddress(this.miner) }
                
                console.log('Loading blocks:', { skip, size: this.size, filter })
                const response = await gqlClient.getBlocks(skip, this.size, filter)
                this.blocks = response.items
                this.hasNextPage = response.pageInfo?.hasNextPage || false
            } catch (error) {
                console.error('Failed to load blocks:', error)
                this.blocks = []
                this.hasNextPage = false
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
