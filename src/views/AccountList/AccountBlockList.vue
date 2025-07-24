<template>
  <v-container fluid class="px-0 py-0">
    <page-list-wrapper title=""
                       :items="blocks"
                       :hasNextPage="hasNextPage"
                       :hasPreviousPage="hasPreviousPage"
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
            hasNextPage: false,
            hasPreviousPage: false
        }
    },
    computed: {
        ...mapGetters('Block', ['size'])
    },
    async created() {
    },
    methods: {
        async loadBlocks({skip, take}) {
            this.loading = true
            try {
                const skipNum = parseInt(skip) || 0
                const takeNum = parseInt(take) || this.size
                const filter = { miner: this.normalizeAddress(this.miner) }
                
                console.log('Loading blocks:', { skip: skipNum, take: takeNum, filter })
                const response = await gqlClient.getBlocks(skipNum, takeNum, filter)
                this.blocks = response.items
                this.hasNextPage = response.pageInfo?.hasNextPage || false
                this.hasPreviousPage = response.pageInfo?.hasPreviousPage || false
            } catch (error) {
                console.error('Failed to load blocks:', error)
                this.blocks = []
                this.hasNextPage = false
                this.hasPreviousPage = false
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
