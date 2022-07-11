<template>
  <page-list-wrapper title=""
                     :items="txs"
                     :before="before"
                     @loadItems="loadTxs"
                     :acceptFilter="['t', 'action']"
                     :loading="loading"
                     routerReplace
                     flat
  >
    <template v-slot:title-after="{filter}">
      <actions-select v-model="filter.action" color="point" @change="changeActionFilter"></actions-select>
    </template>
    <template v-slot:default="{items, loading}">
      <transaction-table :transactions="items" involved detail :loading="loading"></transaction-table>
    </template>
  </page-list-wrapper>
</template>

<script>
import api from "@/api"
import {mapGetters} from "vuex"
import TransactionTable from "@/components/TransactionTable";
import PageListWrapper from "@/components/PageListWrapper";
import ActionsSelect from "@/components/form/ActionsSelect";
export default {
    name: 'AccountTransactionList',
    components: {ActionsSelect, PageListWrapper, TransactionTable},
    props: ['address'],
    mixins: [],
    data() {
        return {
            loading: false,
            txs: [],
            before: null
        }
    },
    computed: {
        ...mapGetters('Block', ['size'])
    },
    async created() {
    },
    methods: {
        async loadTxs({page, action, before}) {
            this.loading = true
            try {
                let {transactions, before:nextBefore} = await api.getAccountTransactions(this.address, {page, action, before, limit: this.size})
                this.txs = transactions
                this.before = nextBefore
            } finally {
                this.loading = false
            }
        },
        changeActionFilter(action) {
            this.$router.push({
                param: {address: this.address},
                query: action ? {action} : {}
            })
        }

    }
}
</script>

<style scoped lang="scss">
</style>
