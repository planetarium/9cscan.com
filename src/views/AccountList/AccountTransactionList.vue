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
        <actions-select v-model="filter.action" color="grayButton" @change="changeActionFilter"></actions-select>
      </template>
      <template v-slot:default="{items, loading}">
        <transaction-table
            :transactions="items"
            :embed-mode="isEmbedMode"
            :detail="!isEmbedMode"
            involved
            :loading="loading"></transaction-table>
      </template>
    </page-list-wrapper>
    <div class="mt-2" style="position: absolute; right: 10px;">
      <v-btn class="ml-2" text rounded x-small depressed @click="downloadCSV">export CSV <span v-if="csvProgress">({{csvProgress}}) <v-progress-circular v-if="csvProgress" class="ml-1" indeterminate size="13" width="2" color="#888" /></span></v-btn>
    </div>
  </div>
</template>

<script>
import { gqlClient } from "@/mimir-gql/client"
import {mapGetters} from "vuex"
import TransactionTable from "@/components/TransactionTable";
import PageListWrapper from "@/components/PageListWrapper";
import ActionsSelect from "@/components/form/ActionsSelect";
import {download, generateCsv, mkConfig} from "export-to-csv";
export default {
    name: 'AccountTransactionList',
    components: {ActionsSelect, PageListWrapper, TransactionTable},
    props: ['address', 'avatar'],
    mixins: [],
    data() {
        return {
            loading: false,
            csvProgress: 0,
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
                console.log('loadTxs called with:', { page, action, before })
                
                const pageNum = parseInt(page) || 1
                const skip = (pageNum - 1) * this.size
                const filter = { signer: this.address }
                if (this.avatar) {
                    filter.avatarAddress = this.avatar
                }
                if (action) {
                    filter.actionType = action
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
                this.loading = false
            }
        },
        async downloadCSV() {
          let skip = 0
          let {action} = this.$route.query
          let txs = []
          for (let i = 0; i < 100; i++) { //max 10K
            const filter = { signer: this.address }
            if (action) {
                filter.actionType = action
            }
            
            const response = await gqlClient.getTransactions(skip, 100, filter)
            txs.push(...response.items)
            skip += 100
            if (response.items.length < 100) break;
            this.csvProgress = txs.length;
          }
          txs = txs.map(item => {
            const amount = item.firstNCGAmountInActionArguments
            item.amount = amount || ''
            item.amountTicker = amount ? 'NCG' : ''
            item.actionType = item.object?.actions?.[0]?.typeId ?? ''
            item.actions = JSON.stringify(item.object?.actions || [])
            item.updatedAddresses = JSON.stringify(item.object?.updatedAddresses || [])
            item.involved = item.involved?.type ?? ''
            return item
          })
          const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: `transactions-${action ?? 'all'}-${this.address}` });
          const csv = generateCsv(csvConfig)(txs);
          download(csvConfig)(csv)
          console.log(txs)

          this.csvProgress = undefined;
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
