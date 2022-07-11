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
            <th>From</th>
            <th v-if="involved">Involved</th>
            <th>Action</th>
            <th v-if="detail">Avatar</th>
            <th v-if="detail">Updated<br />Addresses</th>
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
              <router-link :to="{name: 'transaction', params: {id: tx.id}}">
                {{shortAddress(tx.id)}}
              </router-link>
            </td>
            <td><v-btn class="rect pointlink-btn" outlined small depressed  :to="{name: 'block', params: {index: tx.blockIndex}}">{{tx.blockIndex}}</v-btn></td>
            <td class="text-no-wrap">{{moment(tx.timestamp).fromNow()}}</td>
            <td v-if="detail">
              <v-chip label small outlined text-color="#555"><strong class="mr-1">{{latestBlockIndex - tx.blockIndex + 1}}</strong> Confirms</v-chip>
            </td>

            <td>
              <router-link :to="{name: 'account', params: {address: tx.signer}}">
                {{tx.signer.substr(0, 8)}}
              </router-link>
            </td>
            <td v-if="involved">
              <v-chip label small color="success" :outlined="tx.involved['type'] == 'INVOLVED'" v-if="tx.involved">{{tx.involved['type']}}</v-chip>
            </td>
            <td>
              <v-btn label small :to="{name: 'transaction', params: {id: tx.id}}" style="text-transform: none;height:20px;font-weight:500;letter-spacing: 0" color="point" rounded outlined v-for="action in tx.actions" v-if="action.inspection" class="darken-1 px-2 mx-1">
                <v-btn icon x-small color="point" :to="{query: {action: action.inspection['typeId']}, ...(detail ? {} : {name: 'transactions'})}" style="width:12px;" class="mr-1"><v-icon x-small>mdi-filter-variant</v-icon></v-btn>
                {{action.inspection['typeId']}}
              </v-btn>
            </td>
            <td v-if="detail">
              <router-link :to="{name: 'avatar', params: {address: action.inspection['avatarAddress']}}" v-for="action in tx.actions" v-if="action.inspection" class="mx-1">
                {{action.inspection['avatarAddress'] && action.inspection['avatarAddress'].substr(0, 8)}}
              </router-link>
            </td>
            <td v-if="detail">{{tx.updatedAddresses.length}}</td>
          </tr>
        </transition-group>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: 'TransactionTable',
    components: {},
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
