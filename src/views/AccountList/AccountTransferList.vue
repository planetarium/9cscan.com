<template>
  <div>
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
        <transfer-table
            :transactions="items"
            :embed-mode="isEmbedMode"
            :detail="!isEmbedMode"
            involved
            :loading="loading"></transfer-table>
      </template>
    </page-list-wrapper>
    <div class="mt-2" style="position: absolute; right: 10px;">
      <v-btn class="ml-2" text rounded x-small depressed @click="downloadCSV">export CSV <span v-if="csvProgress">({{csvProgress}}) <v-progress-circular v-if="csvProgress" class="ml-1" indeterminate size="13" width="2" color="#888" /></span></v-btn>
    </div>
  </div>
</template>

<script>
import api from "@/api"
import {mapGetters} from "vuex"
import TransactionTable from "@/components/TransactionTable";
import PageListWrapper from "@/components/PageListWrapper";
import ActionsSelect from "@/components/form/ActionsSelect";
import TransferTable from "@/components/TransferTable.vue";
import {download, generateCsv, mkConfig} from "export-to-csv";
export default {
    name: 'AccountTransferList',
    components: {TransferTable, ActionsSelect, PageListWrapper, TransactionTable},
    props: ['address'],
    mixins: [],
    data() {
        return {
            csvProgress: 0,
            loading: false,
            txs: [],
            before: null
        }
    },
    computed: {
        ...mapGetters('Block', ['size']),
        isEmbedMode() {return this.$route.meta['embed']}
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
        async downloadCSV() {
          let before = ''
          let page = 1
          let {action} = this.$route.query
          let txs = []
          for (let i = 0; i < 100; i++) { //max 10K
            let {transactions, before:nextBefore} = await api.getAccountTransactions(this.address, {page, action, before, limit: 100})
            txs.push(...transactions)
            before = nextBefore
            page += 1
            if (transactions.length < 100) break;
            this.csvProgress = txs.length;
          }
          txs = txs.map(item => {
            const inspection = item.actions?.[0]?.inspection
            const amount = inspection?.['amount']
            const sender = inspection?.['sender']
            const recipient = inspection?.['recipient']
            item.from = sender
            item.to = recipient
            item.inOut = item.involved?.type === 'SIGNED' ? 'OUT' : 'IN'
            item.value = amount ? ((item.inOut === 'OUT' ? '-' : '') + amount[1]) : ''
            const decimal = Number(amount?.[0]?.['decimalPlaces'] ?? 0)
            if (item.value && decimal > 0) {
              item.value /= Math.pow(10, decimal)
            }
            item.valueTicker = amount ? amount[0].ticker : ''
            item.actionType = item.actions?.[0]?.typeId ?? ''
            item.actions = JSON.stringify(item.actions)
            item.updatedAddresses = JSON.stringify(item.updatedAddresses)
            item.involved = item.involved?.type ?? ''
            return item
          })
          const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: `transfer-${action ?? 'all'}-${this.address}` });
          const csv = generateCsv(csvConfig)(txs);
          download(csvConfig)(csv)
          console.log(txs)

          this.csvProgress = undefined;
        },
        changeActionFilter(action) {
          console.log('hoho', action)
            this.$router.push({
                param: {t: 'transfer', address: this.address},
                query: action ? {action, t: 'transfer'} : {}
            })
        }

    }
}
</script>

<style scoped lang="scss">
</style>
