<template>
  <v-container fluid class="px-0 py-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Transactions</h1>
      <v-row>
        <v-col class="px-0">
          <page-list-wrapper title=""
                             :items="showLatest ? latestTransactions : txs"
                             :before="showLatest ? latestTransactionsBefore : before"
                             @loadItems="loadTxs"
                             :acceptFilter="['action']"
                             :loading="showLatest ? loading : loadings.txs"
          >
            <template v-slot:title-after="{filter}">
              <actions-select v-model="filter.action" color="grayButton" @change="changeActionFilter"></actions-select>
            </template>
            <template v-slot:default="{items, loading}">
              <transaction-table :transactions="items" detail :loading="loading"></transaction-table>
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
import TransactionTable from "@/components/TransactionTable";
import PageListWrapper from "@/components/PageListWrapper";
import ActionsSelect from "@/components/form/ActionsSelect";
export default {
    name: 'TransactionList',
    components: {ActionsSelect, PageListWrapper, TransactionTable},
    mixins: [],
    data() {
        return {
            showLatest: true,
            loadings: {
                txs: false
            },
            txs: [],
            before: null,
        }
    },
    computed: {
        ...mapGetters('Block', ['size', 'loading', 'latestTransactions', 'latestTransactionsBefore'])
    },
    async created() {
    },
    methods: {
        async loadTxs({page, action, before}) {
            this.showLatest = !action && (!page || page == 1)
            if (this.showLatest) return

            this.loadings.txs = true
            try {
                const pageNum = parseInt(page) || 1
                const skip = (pageNum - 1) * this.size
                const filter = {}
                if (action) {
                    filter.actionTypeId = action
                }
                
                console.log('Loading transactions:', { skip, size: this.size, filter })
                const response = await gqlClient.getTransactions(skip, this.size, filter)
                this.txs = response.items
                this.before = response.pageInfo?.hasNextPage ? response.pageInfo.endCursor : null
            } catch (error) {
                console.error('Failed to load transactions:', error)
                this.txs = []
                this.before = null
            } finally {
                this.loadings.txs = false
            }
        },
        changeActionFilter(action) {
            this.$router.push({
                query: action ? {action} : {}
            })
        }
    }
}
</script>

<style scoped lang="scss">
</style>
