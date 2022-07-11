<template>
  <div class="table-wrap">
    <v-progress-linear indeterminate height="2" color="pointblue" v-if="loading"></v-progress-linear>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Block</th>
            <th v-if="detail">Hash</th>
            <th>Age</th>
            <th>Total Tx</th>
            <th>Miner</th>
            <th v-if="detail">Nonce</th>
            <th v-if="detail">State Root Hash</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td colspan="100" style="height: 400px;background-color: white">
              <v-progress-circular color="pointblue" width="2" indeterminate></v-progress-circular>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="blocks.length == 0">
          <tr>
            <td colspan="100"  style="height: 400px;background-color: white">
              <span class="grey--text">No Blocks</span>
            </td>
          </tr>
        </tbody>
        <transition-group name="list-complete" tag="tbody" v-else>
          <tr v-for="block in blocks" :key="block.index" class="row-item">
            <td>
              <v-btn small class="rect pointlink-btn" outlined depressed :to="{name: 'block', params: {index: block.index}}">{{block.index}}</v-btn>
            </td>
            <td v-if="detail">{{shortAddress(block.hash)}}</td>
            <td class="text-no-wrap">{{moment(block.timestamp).fromNow()}}</td>
            <td>
              <router-link :to="{name: 'block', params: {index: block.index}, hash: '#tx'}">{{block.transactionCount}}</router-link>
            </td>
            <td>
              <router-link :to="{name: 'account', query: {t: 'mined'}, params: {address: block.miner}}">
                {{block.miner.substr(0, 8)}}
              </router-link>
            </td>
            <td v-if="detail">{{shortAddress(block.nonce)}}</td>
            <td v-if="detail">{{shortAddress(block.stateRootHash)}}</td>
            <td>{{block.difficulty}}</td>
          </tr>
        </transition-group>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
    name: 'BlockTable',
    components: {},
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        blocks: {
            type: Array,
            default: []
        },
        detail: {
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
  opacity: 0.6;
  background-color: #f5f5fa;
}
.list-complete-leave-active {
  transition: none;
  position: absolute;
  opacity: 0;
}
</style>
