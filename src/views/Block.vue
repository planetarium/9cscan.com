<template>
  <v-container fluid class="px-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Block
        <span>#{{index}}</span>
      </h1>

      <v-card v-if="!loading && latestBlockIndex > 0 && latestBlockIndex < index" outlined>
        <v-progress-linear indeterminate height="2"></v-progress-linear>
        <v-card-text class="py-12">
          <div style="font-size: 28px;" class="my-12"><v-progress-circular class="mr-2" width="2" size="26" indeterminate></v-progress-circular> {{index - latestBlockIndex}} Block(s) left...</div>
        </v-card-text>
      </v-card>
      <v-card class="mt-4 pt-6 border-none" outlined v-if="loading || block.index">
        <v-progress-linear indeterminate height="2" v-if="loading"></v-progress-linear>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Block Height:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading"><strong>{{block.index}}</strong>
              <v-btn x-small depressed color="primary" style="min-width:30px;" class="ml-3 px-0" outlined @click="prevBlock"><v-icon small>mdi-chevron-left</v-icon></v-btn>
              <v-btn x-small depressed color="primary" style="min-width:30px;" class="px-0" outlined @click="nextBlock" :disabled="latestBlockIndex <= block.index"><v-icon small>mdi-chevron-right</v-icon></v-btn>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Block Hash:</v-col>
            <v-col cols="12" sm="9" class="item-value hex" v-if="!loading">{{block.hash}} <copy-btn :text="block.hash" icon x-small><v-icon small>mdi-content-copy</v-icon></copy-btn></v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Transactions:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">{{block.txCount}} Transactions</v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Timestamp:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading"><v-icon small>mdi-clock-outline</v-icon> {{moment(block.timestamp).fromNow()}} <span style="color:#777">({{ moment(block.timestamp) }}</span></v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Mined by:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">
              <router-link :to="{name: 'account', query: {t: 'mined'}, params: {address: normalizeAddress(block.miner)}}">{{normalizeAddress(block.miner)}}</router-link>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">State Root Hash:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">0x{{block.stateRootHash}}</v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <h1 class="page-sub-title mt-8">Transactions</h1>
      <v-card class="mt-2 border-none" outlined id="tx" name="tx" v-if="block.index">
        <div v-if="loading" class="py-12">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <p class="table-info d-flex align-center justify-space-between">
            <actions-select v-model="filter.action" color="grayButton" @change="changeActionFilter"></actions-select>
            <span class="mr-3">Total {{filteredTxs.length}} Transactions</span>
          </p>
          <transaction-table class="ma-4" detail :transactions="filteredTxs"></transaction-table>
        </div>

      </v-card>
    </div>
  </v-container>
</template>

<script>
import {mapGetters} from "vuex"
import BlockTable from "@/components/BlockTable";
import TransactionTable from "@/components/TransactionTable";
import CopyBtn from "@/components/btn/CopyBtn";
import ActionsSelect from "@/components/form/ActionsSelect";
export default {
    name: 'Block',
    components: {ActionsSelect, CopyBtn, TransactionTable, BlockTable},
    mixins: [],
    data() {
      return {
          loading: false,
          index: this.$route.params.index,
          block: {},
          filter: {
              action: this.$route.query.action
          }
      }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex']),
        filteredTxs() {
          console.log(this.block)
            if (this.filter.action) {
                return this.block.transactions.filter(tx => {
                    return tx.object.actions.find(action => action.typeId == this.filter.action)
                })
            }
            return this.block && this.block.transactions || []
        }
    },
    async created() {
        this.$watch('$route.params.index', () => {
            this.index = this.$route.params.index
            this.init()
        })
        this.$watch('$route.query.action', () => {
            this.filter.action = this.$route.query.action
        })
        this.init()
    },
    methods: {
        $onLoaded() {
            if (location.hash == '#tx') {
                document.getElementById("tx").scrollIntoView();
            }
        },
        watchBlock() {
            let cancelWatch = this.$watch('latestBlockIndex', () => {
                if (this.block.index) {
                    cancelWatch()
                } else if (this.latestBlockIndex >= this.index) {
                    this.init()
                    cancelWatch()
                }
                console.log(this.latestBlockIndex)
            })
        },
        async init() {
            this.loading = true
            try {
                const blockData = await this.$store.dispatch('Block/loadBlock', Number(this.index))
                this.block = blockData ? blockData.object : {}
                const transactions = await this.$store.dispatch('Block/loadBlockTransactions', Number(this.index))
                this.block.transactions = transactions
            } catch(e) {
                this.watchBlock()
            }
            this.loading = false
        },
        prevBlock() {
            this.index = Number(this.index) - 1
            this.go('block', {}, {index: this.index})
        },
        nextBlock() {
            this.index = Number(this.index) + 1
            this.go('block', {}, {index: this.index})
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
