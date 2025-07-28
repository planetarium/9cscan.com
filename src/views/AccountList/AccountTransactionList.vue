<template>
  <div>
    <page-list-wrapper title=""
                       :items="txs"
                       :hasNextPage="hasNextPage"
                       :hasPreviousPage="hasPreviousPage"
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
            :agent-address="address"
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
            hasNextPage: false,
            hasPreviousPage: false
        }
    },
    computed: {
        ...mapGetters('Block', ['size']),
        isEmbedMode() {return this.$route.meta['embed']}
    },
    async created() {
    },
    methods: {
        async loadTxs({skip, take, action}) {
            this.loading = true
            try {
                console.log('loadTxs called with:', { skip, take, action })
                const skipNum = parseInt(skip) || 0
                const takeNum = parseInt(take) || this.size
                
                const filter = { signer: this.normalizeAddress(this.address) }
                if (this.avatar) {
                    filter.avatarAddress = this.normalizeAddress(this.avatar)
                }
                if (action) {
                    filter.actionTypeId = action
                }
                
                console.log('Loading transactions:', { skip: skipNum, take: takeNum, filter })
                
                let response
                if (this.avatar) {
                    response = await gqlClient.getTransactionsIncludeInvolvedAvatarAddress(skipNum, takeNum, filter)
                } else {
                    response = await gqlClient.getTransactionsIncludeInvolvedAddress(skipNum, takeNum, filter)
                }
                
                this.txs = response.items
                this.hasNextPage = response.pageInfo?.hasNextPage || false
                this.hasPreviousPage = response.pageInfo?.hasPreviousPage || false
            } catch (error) {
                console.error('Failed to load transactions:', error)
                this.txs = []
                this.hasNextPage = false
                this.hasPreviousPage = false
            } finally {
                this.loading = false
            }
        },
        async downloadCSV() {
          let skip = 0
          let {action} = this.$route.query
          let txs = []
          for (let i = 0; i < 100; i++) { //max 10K
            const filter = { signer: this.normalizeAddress(this.address) }
            if (action) {
                filter.actionTypeId = action
            }
            
            let response
            if (this.avatar) {
                response = await gqlClient.getTransactionsIncludeInvolvedAvatarAddress(skip, 100, filter)
            } else {
                response = await gqlClient.getTransactionsIncludeInvolvedAddress(skip, 100, filter)
            }
            
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
          const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: `transactions-${action ?? 'all'}-${this.normalizeAddress(this.address)}` });
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
