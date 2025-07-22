<template>
  <v-container fluid class="px-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Transaction Details</h1>

      <v-card class="mt-4 pt-6 border-none" outlined>
        <v-progress-linear indeterminate height="2" v-if="loading"></v-progress-linear>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Transaction Hash:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">
              {{id}}  <copy-btn :text="tx.object.id" icon x-small><v-icon small>mdi-content-copy</v-icon></copy-btn>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Status:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading && (tx.object.id || tx.object.txStatus)">
              <div v-if="statusLoading"><v-progress-circular indeterminate class="mr-2" size="12" width="2"></v-progress-circular></div>
              <div v-else>
                <v-chip label small color="success" v-if="tx.object.txStatus == 'SUCCESS'">SUCCESS</v-chip>
                <v-chip label small color="error" v-else-if="tx.object.txStatus == 'FAILED'" >FAILED</v-chip>
                <v-chip label small color="secondary" v-else-if="tx.object.txStatus == 'INVALID' || tx.object.txStatus == null" >NOT FOUND</v-chip>
                <v-chip label small color="warning" v-else >{{tx.object.txStatus}}</v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="9" class="item-value" v-else-if="!loading && !tx.object.id">
              <v-chip label small color="warning"><v-progress-circular indeterminate class="mr-2" size="12" width="2"></v-progress-circular>WAITING</v-chip>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Block:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading && tx.object.id">
              <router-link :to="{name: 'block', params:{index:tx.blockIndex}}">{{tx.blockIndex}}</router-link>
              <v-chip small label class="ml-2" color="#eee"><strong class="mr-1">{{latestBlockIndex - tx.blockIndex + 1}}</strong> Block confirmations</v-chip>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Age:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading && tx.object.id">
              <v-icon small>mdi-clock-outline</v-icon> {{moment(tx.object.timestamp).fromNow()}} <span style="color:#777">({{ moment(tx.blockTimestamp) }}</span>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Timestamp:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading && tx.object.id">
              {{ moment(tx.object.timestamp) }}
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Signer:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">
              <router-link :to="{name: 'account', params:{address: normalizeAddress(tx.object.signer)}}">{{normalizeAddress(tx.object.signer)}}</router-link>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Updated Addresses:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">
              <span v-for="addr in tx.object.updatedAddresses">
                <router-link :to="{name: 'account', params:{address:normalizeAddress(addr)}}">{{normalizeAddress(addr)}}</router-link>
                <br></span>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Signature:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">{{tx.object.signature}}</v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Public Key:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">{{tx.object.publicKey}}</v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Nonce:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">{{tx.object.nonce}}</v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <h1 class="page-sub-title mt-12">Action Data</h1>
      <v-card class="mt-4 border-none" outlined>
        <v-progress-linear indeterminate height="2" v-if="loading"></v-progress-linear>
        <v-divider></v-divider>
        <v-card-text class="py-12" v-if="!tx.object.actions || tx.object.actions.length == 0">
          No Action Data
        </v-card-text>
        <v-card-text class="pa-0" v-for="(action, idx) in tx.object.actions" :key="idx" v-if="action">
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Type:</v-col>
            <v-col cols="12" sm="9" class="item-value">{{ action.typeId }}</v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Avatar:</v-col>
            <v-col cols="12" sm="9" class="item-value">
              <router-link :to="{name: 'avatar', params:{address: normalizeAddress(tx.firstAvatarAddressInActionArguments)}}">{{ normalizeAddress(tx.firstAvatarAddressInActionArguments) }}</router-link>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0" v-if="action.values">
            <v-col cols="12" sm="3" class="item-title">Id:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="getParsedValues(action.values)['id']">
              {{getParsedValues(action.values)['id']}}
            </v-col>
          </v-row>
          <v-row class="info-item ma-0 data-row" v-for="k in Object.keys(getParsedValues(action.values))" v-if="['id'].indexOf(k) == -1">
            <v-col cols="12" sm="3" class="item-title">{{k}}:</v-col>
            <v-col cols="12" sm="9" class="item-value">
              {{getParsedValues(action.values)[k]}}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

  </v-container>
</template>

<script>
import {mapGetters} from "vuex"
import BlockTable from "@/components/BlockTable";
import TransactionTable from "@/components/TransactionTable";
import CopyBtn from "@/components/btn/CopyBtn";
import Vue from "vue"
export default {
    name: 'Transaction',
    components: {CopyBtn, TransactionTable, BlockTable},
    mixins: [],
    data() {
        return {
            loading: false,
            statusLoading: false,
            id: this.$route.params.id,
            tx: {}
        }
    },
    computed: {
      ...mapGetters('Block', ['latestBlockIndex'])
    },
    async created() {
        this.$watch('$route.params.id', async () => {
            this.id = this.$route.params.id
            this.init()
        })
        this.init()
    },
    methods: {
        async init() {
            await this.loadTx()
            if (!this.tx.object.id) {
                this.watchBlock()
            }
        },
        async loadTx() {
            if (this.loading) return
            this.loading = true
            let tx = await this.$store.dispatch('Block/loadTransaction', this.id)
            if (tx) {
              this.tx = tx
              if (!this.tx.blockTimestamp) {
                const block = await this.$store.dispatch('Block/loadBlock', this.tx.blockIndex)
                if (block) {
                  this.tx.blockTimestamp = block.object.timestamp
                }
              }
            } else {
              this.tx = {}
            }
            this.loading = false
        },

        watchBlock() {
            let cancelWatch = this.$watch('latestBlockIndex', async () => {
                await this.loadTx()
                if (this.tx.object.id) {
                    cancelWatch()
                }
            })
        },
        getParsedValues(values) {
            try {
                return JSON.parse(values)
            } catch (e) {
                return {}
            }
        }
    }
}
</script>

<style scoped lang="scss">
.data-row {
  background-color: #fafafa;
  .item-title {
    font-weight: 400;
    color: #333;
    padding-left:32px;
  }
  .item-value {
    color:#333;
  }
}
</style>
