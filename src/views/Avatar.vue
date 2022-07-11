<template>
  <v-container fluid class="px-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Avatar <span style="font-size:0.6em;" class="hex">{{address}} <copy-btn :text="address" icon x-small><v-icon small>mdi-content-copy</v-icon></copy-btn></span></h1>
      <v-divider class="my-2"></v-divider>


      <v-card class="mt-4" outlined v-if="!notFound">
        <v-progress-linear indeterminate height="2" v-if="loading"></v-progress-linear>
        <v-tabs>
          <v-tab>Overview</v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">Balance:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">
              <strong>{{Number(account.goldBalance).toLocaleString()}}</strong> GOLD (NCG)
            </v-col>
          </v-row>
          <v-row class="info-item ma-0">
            <v-col cols="12" sm="3" class="item-title">WNCG Value:</v-col>
            <v-col cols="12" sm="9" class="item-value" v-if="!loading">
              ${{(Number(account.goldBalance)*WncgPrice).toLocaleString()}} <span style="font-size: 11px;color:#444;">(@ ${{WncgPrice.toFixed(2)}}<span>/WNCG</span>)</span>
            </v-col>
          </v-row>
          <v-row class="info-item ma-0 pa-0" v-if="!loading">
            <v-col cols="12" class="pa-0">
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">Avatar Name:</v-col>
                <v-col cols="12" md="9" class="item-value">{{account.avatar.name}}</v-col>
              </v-row>
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">Level:</v-col>
                <v-col cols="12" md="9" class="item-value">{{account.avatar.level}}</v-col>
              </v-row>
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">Account:</v-col>
                <v-col cols="12" md="9" class="item-value"><router-link :to="{name: 'account', params: {address:account.address}}">{{account.address}}</router-link></v-col>
              </v-row>
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">CharacterId:</v-col>
                <v-col cols="12" md="9" class="item-value">{{account.avatar.characterId}}</v-col>
              </v-row>
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">Daily Reward Index:</v-col>
                <v-col cols="12" md="9" class="item-value"><router-link :to="{name: 'block', params: {index: account.avatar.dailyRewardReceivedIndex}}">{{account.avatar.dailyRewardReceivedIndex}}</router-link></v-col>
              </v-row>
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">Block:</v-col>
                <v-col cols="12" md="9" class="item-value"><router-link :to="{name: 'block', params:{index: account.avatar.blockIndex}}">{{account.avatar.blockIndex}}</router-link></v-col>
              </v-row>
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">Updated Block:</v-col>
                <v-col cols="12" md="9" class="item-value"><router-link :to="{name: 'block', params:{index: account.avatar.updatedAt}}">{{account.avatar.updatedAt}}</router-link></v-col>
              </v-row>
              <v-row class="info-item ma-0">
                <v-col cols="12" md="3" class="item-title">Data:</v-col>
                <v-col cols="12" md="9" class="item-value">
                  <v-chip small outlined color="text" v-if="account.avatar.exp != undefined" class="mr-1 mb-1">Exp {{account.avatar.exp}}</v-chip>
                  <v-chip small outlined color="text" v-if="account.avatar.actionPoint != undefined" class="mr-1 mb-1">ActionPoint {{account.avatar.actionPoint}}</v-chip>
                  <v-chip small outlined color="text" v-if="account.avatar.tail != undefined" class="mr-1 mb-1">Tail {{account.avatar.tail}}</v-chip>
                  <v-chip small outlined color="text" v-if="account.avatar.lens != undefined" class="mr-1 mb-1">Lens {{account.avatar.lens}}</v-chip>
                  <v-chip small outlined color="text" v-if="account.avatar.hair != undefined" class="mr-1 mb-1">Hair {{account.avatar.hair}}</v-chip>
                  <v-chip small outlined color="text" v-if="account.avatar.ear != undefined" class="mr-1 mb-1">Ear {{account.avatar.ear}}</v-chip>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>


      <v-card class="mt-8" outlined>
        <v-tabs>
          <v-tab>Transactions</v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <div v-if="loading" class="py-12">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <v-card-text v-else class="pa-0">
          <account-transaction-list :address="address"></account-transaction-list>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import api from "../api"
import {mapGetters} from "vuex"
import CopyBtn from "@/components/btn/CopyBtn";
import AccountTransactionList from "@/views/AccountList/AccountTransactionList";
export default {
    name: 'Avatar',
    components: {AccountTransactionList, CopyBtn},
    mixins: [],
    data() {
        return {
            account: null,
            loading: false,
            address: this.$route.params.address.toLowerCase(),
            transactions: [],
            ivTransactions: [],
            minedBlocks: [],
            actions: []
        }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex']),
        ...mapGetters('Price', ['WncgPrice', 'WncgMarketCap', 'WncgChange24h']),
        notFound() {return !this.loading && !this.account},
    },
    async created() {
        this.loadAccount()
    },
    methods: {
        async loadAccount() {
            this.loading = true
            let accounts = await api.getAccount({avatar:this.$route.params.address.toLowerCase()})
            if (accounts && accounts[0]) {
                this.account = accounts.find(ac => ac.avatar && ac.avatar.address.toLowerCase() == this.address.toLowerCase())
            }
            this.loading = false
        },
    }
}
</script>

<style scoped lang="scss">
.avatars {
  max-height: 600px;
  overflow: auto;
}
</style>
