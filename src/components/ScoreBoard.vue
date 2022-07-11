<template>
  <v-card outlined class="scoreboard">
    <v-row>
      <v-col order="1" order-lg="1" md="4" lg="3" sm="6">
        <div class="scoreboard-card price">
          <div class="price-card">
            <h5 class="scoreboard-title">WNCG Price</h5>
            <div class="content">
              <v-skeleton-loader type="heading" v-if="loading">
              </v-skeleton-loader>
              <strong v-else class="data">
                ${{ WncgPrice.toFixed(2) }}
                <span class="text-wncg">/WNCG</span>
                <span
                  :class="WncgChange24h < 0 ? 'red--text' : 'primary--text'"
                >
                  ({{ WncgChange24h.toFixed(2) }}%)
                </span>
              </strong>
            </div>
          </div>

          <div class="price-card">
            <h5 class="scoreboard-title">Market Cap</h5>
            <div class="content">
              <v-skeleton-loader type="heading" v-if="loading">
              </v-skeleton-loader>
              <strong v-else class="data">
                ${{ Number(WncgMarketCap.toFixed()).toLocaleString() }}
              </strong>
            </div>
          </div>
        </div>
      </v-col>

      <v-col order="3" order-lg="2" cols="12" lg="6">
        <div class="scoreboard-card performance">
          <h5 class="scoreboard-title">Network Performance</h5>

          <v-row class="performance-list">
            <v-col class="performance-item" cols="12" sm="4">
              <div class="performance-card">
                <div v-if="loading" style="margin-bottom: 7px">
                  <v-progress-circular indeterminate color="#ccc">
                  </v-progress-circular>
                </div>
                <div class="data" v-else>
                  <label id="avg-block-time"></label>s
                </div>
                <span>Avg Block Time</span>
              </div>
            </v-col>

            <v-col class="performance-item" cols="12" sm="4">
              <div class="performance-card">
                <div v-if="loading" style="margin-bottom: 7px">
                  <v-progress-circular indeterminate color="#ccc">
                  </v-progress-circular>
                </div>
                <div class="data" v-else>
                  <label id="avg-difficulty"></label>
                </div>
                <span>Avg difficulty</span>
              </div>
            </v-col>

            <v-col class="performance-item" cols="12" sm="4">
              <div class="performance-card">
                <div v-if="loading" style="margin-bottom: 7px">
                  <v-progress-circular indeterminate color="#ccc">
                  </v-progress-circular>
                </div>
                <div class="data" v-else>
                  <label id="avg-tx"></label>
                </div>
                <span>Avg Tx Per Block</span>
              </div>
            </v-col>
          </v-row>

          <div class="misc">Average over the last 100 blocks.</div>
        </div>
      </v-col>

      <v-col order="2" order-lg="3" md="8" lg="3" sm="6">
        <div class="scoreboard-card chart" min-width="230px">
          <h5 class="scoreboard-title">Transaction History</h5>
          <tx-history-chart></tx-history-chart>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { CountUp } from 'countup.js'
import TxHistoryChart from '@/components/ui/TxHistoryChart'

export default {
  name: 'ScoreBoard',
  components: { TxHistoryChart },
  props: {},
  mixins: [],
  data() {
    return {}
  },
  computed: {
    ...mapGetters('Block', [
      'loading',
      'latestBlockIndex',
      'avgBlockTime',
      'avgDifficulty',
      'avgTx',
    ]),
    ...mapGetters('Price', ['WncgPrice', 'WncgMarketCap', 'WncgChange24h']),
  },
  beforeDestroy() {},
  async created() {},
  methods: {
    $onLoaded() {
      this.init()
    },
    init() {
      //   this.$store.dispatch('Block/syncTx', true)
      this.$watch('latestBlockIndex', () => {
        console.log('LATEST BLOCK INDEX UPDATED')
        this.updateCount()
      })
      this.countAvgBlockTime = new CountUp('avg-block-time', 0, {
        decimalPlaces: 2,
      })
      this.countAvgDifficulty = new CountUp('avg-difficulty', 0)
      this.countAvgTx = new CountUp('avg-tx', 0, { decimalPlaces: 2 })
      this.updateCount()
    },
    updateCount() {
      this.countAvgBlockTime.update(this.avgBlockTime || 0)
      this.countAvgDifficulty.update(this.avgDifficulty || 0)
      this.countAvgTx.update(this.avgTx || 0)
    },
  },
}
</script>

<style scoped lang="scss">
.scoreboard {
  &-title {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
    text-align: left;
    text-transform: uppercase;
    color: var(--v-text-base);
  }

  &-card {
    padding: 20px;
  }

  .misc {
    margin-top: 20px;
    font-size: 12px;
    color: #aaa;
    text-align: left;
  }

  @media screen and (min-width: 599px) {
    .misc {
      text-align: right;
    }
  }

  @media screen and (min-width: 959px) {
    > .row {
      > div {
        position: relative;

        &:first-child {
          position: relative;

          &::after {
            position: absolute;
            top: 32px;
            right: 20px;
            bottom: 32px;
            width: 1px;
            content: '';
            background-color: #ddd;
          }
        }
      }
    }

    &-card {
      display: flex;
      flex-direction: column;
      height: 100%;

      &.chart {
        .scoreboard-title {
          margin-bottom: 24px;
        }
      }
    }

    .misc {
      margin-top: 0;
      margin-bottom: -4px;
    }
  }

  @media screen and (min-width: 1264px) {
    > .row {
      > div:not(:last-child) {
        &::after {
          position: absolute;
          top: 32px;
          right: 0;
          bottom: 32px;
          width: 1px;
          content: '';
          background-color: #ddd;
        }
      }
    }
  }
}

.price-card {
  &:not(:last-child) {
    padding-bottom: 20px;
  }

  .content {
    text-align: left;
  }

  .data {
    font-size: 28px;

    .text-wncg,
    .red--text,
    .primary--text {
      font-size: 0.5em;
    }

    .text-wncg {
      font-weight: 400;
    }
  }
}

.performance {
  &-card {
    text-align: left;

    .data {
      font-size: 28px;
      font-weight: 700;
    }

    span {
      font-size: 14px;
      color: var(--v-text-base);
    }
  }

  @media screen and (min-width: 959px) {
    &-list {
      flex-grow: 1;
      padding-bottom: 20px;
    }

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &-card {
      text-align: center;
    }
  }
}
</style>
