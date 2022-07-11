<template>
  <v-container fluid class="px-0 py-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Transactions</h1>
      <v-divider class="my-2"></v-divider>
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
              <actions-select v-model="filter.action" color="point" @change="changeActionFilter"></actions-select>
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
import api from "../api"
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
    beforeDestroy() {
        this.$store.dispatch('Block/syncTx', false)
    },
    async created() {
    },
    methods: {
        $onLoaded() {
            this.$store.dispatch('Block/syncTx', true)
        },
        async loadTxs({page, action, before}) {
            this.showLatest = !action && (!page || page == 1)
            if (this.showLatest) return

            this.loadings.txs = true
            try {
                let {transactions, before:nextBefore} = await api.getTransactions({page, action, before, limit: this.size})
                this.txs = transactions
                this.before = nextBefore
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
