<template>
  <v-container fluid class="px-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Address <span style="font-size:0.6em;" class="hex">{{address}} <copy-btn :text="address" icon x-small><v-icon small>mdi-content-copy</v-icon></copy-btn></span></h1>
      <v-divider class="my-2"></v-divider>


      <v-card class="mt-4" outlined v-if="loading || !notFound">
        <v-progress-linear indeterminate height="2" v-if="loading"></v-progress-linear>
        <v-tabs>
          <v-tab>Overview</v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Balance:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading && !notFound">
              <strong>{{Number(account[0].goldBalance).toLocaleString()}}</strong> GOLD (NCG)

              <v-btn icon small @click="refreshAccount" :loading="reloading"><v-icon small>mdi-refresh</v-icon></v-btn>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">WNCG Value:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading && !notFound">
              ${{(Number(account[0].goldBalance)*WncgPrice).toLocaleString()}} <span style="font-size: 11px;color:#444;">(@ ${{WncgPrice.toFixed(2)}}<span>/WNCG</span>)</span>
            </v-col>
          </v-row>

          <v-row class="info-item ma-0" v-if="currentAvatars.length > 0">
            <v-col cols="12" sm="3" class="item-title"><span class="text-no-wrap">Nine Chronicles</span> Avatar:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading && !notFound">
              <div v-for="{avatar} in currentAvatars">
                <router-link :to="{name:'avatar', params: {address:avatar.address}}">{{avatar.address}} ({{avatar.name}})</router-link>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-8" outlined>
        <v-tabs v-model="tab">
          <v-tab @click="goReplace('account', null, {address})">Transactions</v-tab>
          <v-tab @click="goReplace('account', {t:'mined'}, {address})">Mined Blocks</v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <div v-if="loading" class="py-12">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <v-card-text v-else class="pa-0">
          <div v-if="tab == 0">
            <account-transaction-list :address="address"></account-transaction-list>
          </div>
          <div v-if="tab == 1">
            <account-block-list :miner="address"></account-block-list>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import api from "../api"
import {mapGetters} from "vuex"
import TransactionTable from "@/components/TransactionTable";
import AccountTransactionList from "@/views/AccountList/AccountTransactionList";
import AccountBlockList from "@/views/AccountList/AccountBlockList";
import CopyBtn from "@/components/btn/CopyBtn";
const TABS = {'mined': 1}
export default {
    name: 'Account',
    components: {CopyBtn, AccountBlockList, AccountTransactionList, TransactionTable},
    mixins: [],
    data() {
        return {
            tab: TABS[this.$route.query.t] || 0,
            expansion: [0],
            account: {},
            loading: false,
            reloading: false,
            address: this.$route.params.address && this.$route.params.address.toLowerCase(),
            transactions: [],
            ivTransactions: [],
            minedBlocks: [],
            actions: []
        }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex']),
        ...mapGetters('Price', ['WncgPrice', 'WncgMarketCap', 'WncgChange24h']),
        notFound() {return !this.loading && this.account && this.account[0] == undefined},
        avatars() {
            return [...this.currentAvatars, ...this.oldAvatars]
        },
        currentAvatars() {
            if (this.account && this.account[0]) {
                let maxBlockIndex = _.max(this.account.filter(ac => ac.avatar).map(ac => ac.refreshBlockIndex))
                return _.sortBy(this.account.filter(ac => ac.refreshBlockIndex == maxBlockIndex && ac.avatar), ({avatar}) => -avatar.blockIndex)
            }
            return []
        },
        oldAvatars() {
            if (this.account && this.account[0]) {
                let maxBlockIndex = _.max(this.account.filter(ac => ac.avatar).map(ac => ac.refreshBlockIndex))
                let avatars = this.account.filter(ac => ac.refreshBlockIndex != maxBlockIndex && ac.avatar)
                avatars.forEach(ac => ac['isOld'] = true)
                return avatars
            }
            return []
        }
    },
    async created() {
        this.$watch('$route.params.address', async () => {
            this.address = this.$route.params.address
            this.loadAccount()
        })
        this.$watch('$route.query.t', async (q) => {
            this.tab = TABS[this.$route.query.t] || 0
        })
        this.loadAccount()
    },
    methods: {
        async loadAccount() {
            this.loading = true
            this.account = await api.getAccount({address:this.$route.params.address.toLowerCase()})
            if (!this.account || this.account.length == 0) {
                this.checkIsAvatarAddress()
            } else {
                let latestBlockIndex = _.max(this.account.map(a => a.refreshBlockIndex))
                this.account = this.account.filter(a => a.refreshBlockIndex == latestBlockIndex)
            }
            this.loading = false
            this.refreshAccount()
        },
        async checkIsAvatarAddress() {
            let accounts = await api.getAccount({avatar:this.$route.params.address.toLowerCase()})
            if (accounts && accounts[0]) {
                this.$router.replace({name: 'avatar', params: {address: this.$route.params.address}})
            }
        },
        async refreshAccount() {
            this.reloading = true
            await api.refreshAccount(this.address.toLowerCase())
            this.reloading = false
        }
    }
}
</script>

<style scoped lang="scss">
.avatars {
  max-height: 600px;
  overflow: auto;
}
</style>
