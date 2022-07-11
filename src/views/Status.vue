<template>
  <v-container fluid class="px-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Delay Status</h1>
      <v-card outlined class="mt-4 mb-8" v-if="latestBlocks && latestBlocks[0]">
        <v-card-title>
          {{moment(latestBlocks[0].timestamp).fromNow()}}
        </v-card-title>
      </v-card>

      <h1 class="page-title">Sync Status</h1>
      <div v-if="status">
      <v-card outlined class="my-2">
        <v-card-title>9cscan Status</v-card-title>
        <v-card-text class="text-left">
          <v-chip label color="success" class="darken-1" v-if="status.syncGap < 3">Latest</v-chip>
          <v-chip label color="success" v-else-if="status.syncGap < 15">-{{status.syncGap}} Delayed</v-chip>
          <v-chip label color="warning" v-else-if="status.syncGap < 30">-{{status.syncGap}} Delayed</v-chip>
          <v-chip label color="error" v-else>-{{status.syncGap}} Delayed</v-chip>
        </v-card-text>
      </v-card>
      <v-card outlined>
        <v-card-title>Node Status</v-card-title>
        <v-card-text>
          <v-row>
            <v-col  v-for="(node, index) in status.nodes" cols="auto">
              <v-card outlined>
                <v-card-title>
                  <div>Block #{{node.blockIndex}}</div>
                </v-card-title>
                <v-card-text>
                  <v-chip label small color="success" class="darken-1" v-if="status.latestIndex == node.blockIndex">Latest</v-chip>
                  <v-chip label small color="success" v-else-if="status.latestIndex - 15 <= node.blockIndex">{{node.blockIndex - status.latestIndex}} Delayed</v-chip>
                  <v-chip label small color="warning" v-else-if="status.latestIndex - 30 <= node.blockIndex">{{node.blockIndex - status.latestIndex}} Delayed</v-chip>
                  <v-chip label small color="error" v-else>{{node.blockIndex - status.latestIndex}} Delayed</v-chip>
                  <div>Node{{index + 1}} ({{node.endpoint.split('//')[1].substr(0, 8)}}...)</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import api from "../api"
import {mapGetters} from "vuex"
export default {
    name: 'Status',
    components: {},
    mixins: [],
    data() {
        return {
            status: null,
            timer: 0
        }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex', 'latestBlocks'])
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    async created() {
        this.timer = setIntervalImmediately(() => {
            this.refresh()
        }, 15000)
    },
    methods: {
        async refresh() {
            this.status = await api.getStatus()
        }
    }
}
</script>

<style scoped lang="scss">
</style>
