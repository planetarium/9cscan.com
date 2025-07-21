<template>
  <div class="table-wrap">
    <v-progress-linear indeterminate height="2" color="pointblue" v-if="loading"></v-progress-linear>
    <v-simple-table>
      <template v-slot:default>
        <thead class="thead">
          <tr>
            <th>Tx Hash</th>
            <th>Block</th>
            <th>Age</th>
            <th v-if="detail">Confirm</th>
            <th v-if="!embedMode">From</th>
            <th v-if="involved">Involved</th>
            <th>Action</th>
            <th v-if="detail"></th>
            <th v-if="detail || embedMode">Avatar</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td colspan="100" style="height: 400px;background-color: white">
              <v-progress-circular color="pointblue" width="2" indeterminate></v-progress-circular>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="transactions.length == 0">
        <tr>
          <td colspan="100" style="height: 400px;background-color: white">
            <span class="grey--text">No Transactions</span>
          </td>
        </tr>
        </tbody>
        <transition-group name="list-complete" tag="tbody" v-else>
          <tr v-for="tx in transactions" :key="tx.id" class="row-item">
            <td>
              <router-link :to="{name: 'transaction', params: {id: tx.id}}" :target="embedMode ? '_blank' : ''">
                {{shortAddress(tx.id)}}
              </router-link>
            </td>
            <td><v-btn class="rect pointlink-btn" outlined small depressed  :target="embedMode ? '_blank' : ''" :to="{name: 'block', params: {index: tx.blockIndex}}">{{tx.blockIndex}}</v-btn></td>
            <td class="text-no-wrap">{{moment(tx.blockTimestamp || tx.timestamp).fromNow()}}</td>
            <td v-if="detail">
              <v-chip label small outlined text-color="#555"><strong class="mr-1">{{latestBlockIndex - tx.blockIndex + 1}}</strong> Confirms</v-chip>
            </td>

            <td v-if="!embedMode">
              <router-link :to="{name: 'account', params: {address: tx.object.signer}}" :target="embedMode ? '_blank' : ''">
                {{tx.object.signer.substr(0, 8)}}
              </router-link>
            </td>
            <td v-if="involved">
              <v-chip label small color="success" :outlined="tx.involved['type'] == 'INVOLVED'" v-if="tx.involved">{{tx.involved['type']}}</v-chip>
            </td>
            <td>
              <v-btn label small :to="{name: 'transaction', params: {id: tx.id}}" style="text-transform: none;height:26px;font-weight:500;letter-spacing: 0;color:#EBB077 !important;background-color: #FFFAF8 !important;font-weight: 600;padding:0 12px !important;" color="point" rounded outlined v-for="action in tx.actions" v-if="action.inspection" class="darken-1 px-2 mx-1" :target="embedMode ? '_blank' : ''">
                <v-btn icon x-small color="point" :to="{query: {action: action.inspection['typeId']}, ...((detail || embedMode) ? {} : {name: 'transactions'})}" style="width:12px;" class="mr-1"><v-icon x-small>mdi-filter-variant</v-icon></v-btn>
                {{action.inspection['typeId']}}
                <span style="font-size: 10px;opacity:0.8;" v-if="action.inspection['productType']">({{action.inspection['productType']}})</span>
              </v-btn>
            </td>
            <td v-if="detail">
              <span v-if="tx?.actions?.[0]?.inspection?.['amount']">
                <amount-label :asset-data="tx.actions[0].inspection['amount'][0]" :amount="tx.actions[0].inspection['amount'][1]" />
              </span>
            </td>
            <td v-if="detail || embedMode">
              <router-link :to="{name: 'avatar', params: {address: action.inspection['avatarAddress']}}" v-for="action in tx.actions" v-if="action.inspection" class="mx-1" :target="embedMode ? '_blank' : ''">
                {{action.inspection['avatarAddress'] && action.inspection['avatarAddress'].substr(0, 8)}}
              </router-link>
            </td>
          </tr>
        </transition-group>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import AmountLabel from "@/components/ui/AmountLabel.vue";

export default {
    name: 'TransactionTable',
    components: {AmountLabel},
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        transactions: {
            type: Array,
            default: []
        },
        detail: {
            type: Boolean,
            default: false
        },
        involved: {
            type: Boolean,
            default: false
        },
        embedMode: {
            type:Boolean,
            default: false
        }
    },
    mixins: [],
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex'])
    },
    beforeDestroy() {
    },
    async created() {
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
.table-wrap {
  background-color: white;
}
.row-item {
  transition: all 0.5s;
}
.list-complete-enter, .list-complete-leave-to {
  transform: translateY(-40px);
  background-color: #f5f5fa;
}
.list-complete-leave-active {
  transition: none;
  position: absolute;
  opacity: 0;
}
</style>
