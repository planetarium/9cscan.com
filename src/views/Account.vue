<template>
  <v-container fluid class="px-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Address <span style="font-size:0.6em;" class="hex">{{address}} <copy-btn :text="address" icon x-small><v-icon small>mdi-content-copy</v-icon></copy-btn></span></h1>
      <v-card class="mt-4 pt-6 border-none" outlined v-if="loading || !notFound">
        <v-progress-linear indeterminate height="2" v-if="loading"></v-progress-linear>
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
              <div v-for="{avatar} in currentAvatars" :key="avatar.address">
                <router-link :to="{name:'avatar', params: {address:normalizeAddress(avatar.address)}}">{{normalizeAddress(avatar.address)}} ({{avatar.name}})</router-link>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-8 border-none" outlined>
        <v-tabs v-model="tab">
          <v-tab @click="goReplace('account', null, {address})">Transactions</v-tab>
          <v-tab @click="goReplace('account', {t:'mined'}, {address})">Mined Blocks</v-tab>
          <v-tab @click="goReplace('account', {t:'transfer', action: 'transfer_asset5'}, {address})">NCG Transfer</v-tab>
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
          <div v-if="tab == 2">
            <account-transfer-list :address="address"></account-transfer-list>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { gqlClient } from "../mimir-gql/client"
import {mapGetters} from "vuex"
import TransactionTable from "@/components/TransactionTable";
import AccountTransactionList from "@/views/AccountList/AccountTransactionList";
import AccountBlockList from "@/views/AccountList/AccountBlockList";
import CopyBtn from "@/components/btn/CopyBtn";
import AccountTransferList from "@/views/AccountList/AccountTransferList.vue";
const TABS = {'mined': 1, 'transfer': 2}
export default {
    name: 'Account',
    components: {CopyBtn, AccountBlockList, AccountTransactionList, AccountTransferList, TransactionTable},
    mixins: [],
    data() {
        return {
            tab: TABS[this.$route.query.t] || 0,
            expansion: [0],
            account: {},
            loading: false,
            reloading: false,
            address: this.$route.params.address && this.normalizeAddress(this.$route.params.address),
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
            if (this.account && this.account[0] && this.account[0].avatarAddresses) {
                return this.account[0].avatarAddresses.map(addr => ({
                    avatar: {
                        address: addr.value,
                        name: addr.name || addr.key,
                        blockIndex: 0
                    }
                }))
            }
            return []
        },
        oldAvatars() {
            return []
        }
    },
    async created() {
        this.$watch('$route.params.address', async () => {
            this.address = this.normalizeAddress(this.$route.params.address)
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
            try {
              let agent = null
                try {
                  agent = await gqlClient.getAgent(this.normalizeAddress(this.$route.params.address))
                } catch (error) {
                  console.error('Failed to load agent:', error)
                }

                const ncgBalance = await gqlClient.getNCG(this.normalizeAddress(this.$route.params.address))

                if (agent) {
                    this.account = [agent]

                    if (ncgBalance) {
                        this.account[0].goldBalance = ncgBalance
                    } 
                    
                    if (agent.avatarAddresses && agent.avatarAddresses.length > 0) {
                        const avatarAddresses = agent.avatarAddresses.slice(0, 3)
                        const avatarsInfoPromises = avatarAddresses.map(addr => 
                            gqlClient.getAvatar(addr.value).catch(() => null)
                        )
                        const avatarsInfo = await Promise.all(avatarsInfoPromises)
                        
                        this.account[0].avatarAddresses = this.account[0].avatarAddresses.map((addr, index) => {
                            const avatarInfo = avatarsInfo[index]
                            return {
                                ...addr,
                                name: avatarInfo?.avatar?.name || addr.key
                            }
                        })
                    }
                } else {
                  this.account = [{}]

                  if (ncgBalance) {
                      this.account[0].goldBalance = ncgBalance
                  } 

                    this.checkIsAvatarAddress()
                }
            } catch (error) {
                console.error('Failed to load account:', error)
                this.account = []
            }
            this.loading = false
        },
        async checkIsAvatarAddress() {
            try {
                let avatar;
                try {
                    avatar = await gqlClient.getAvatar(this.normalizeAddress(this.$route.params.address))
                } catch (error) {
                    console.error('Failed to load avatar:', error)
                }
                if (avatar) {
                    this.$router.replace({name: 'avatar', params: {address: this.$route.params.address}})
                }
            } catch (error) {
                console.error('Failed to check avatar address:', error)
            }
        },
        async refreshAccount() {
            this.reloading = true
            try {
                const ncgBalance = await gqlClient.getNCG(this.normalizeAddress(this.address))
                if (this.account && this.account[0] && ncgBalance) {
                    this.account[0].goldBalance = ncgBalance
                }
            } catch (error) {
                console.error('Failed to refresh account:', error)
            }
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
