<template>
  <v-container fluid class="px-0 pt-0">
    <div class="search-section">
      <div class="page-wide-wrap px-4">
        <v-row>
          <v-col md="8" class="text-left">
            <div class="search-form">
              <h2 class="search-title">
                The Nine Chronicles Blockchain Explorer
              </h2>
              <div>
                <v-text-field
                  class="mt-4"
                  outlined
                  placeholder="Search by Block / Account Address / Tx Hash / Action Symbol"
                  v-model="searchKey"
                  @keydown.enter="searchKeyword(searchKey)"
                >
                  <template v-slot:append>
                    <v-btn
                      depressed
                      color="pointblue"
                      class="rect darken-1"
                      @click="searchKeyword(searchKey)"
                    >
                      <v-icon color="white">mdi-magnify</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="page-wide-wrap">
      <v-row>
        <v-col>
          <div class="block-height">
            <span>Block Height</span>

            <div v-if="loading" class="data">
              <v-progress-circular indeterminate color="#ccc" size="16">
              </v-progress-circular>
            </div>
            <strong v-else class="data"> #{{ latestBlockIndex }} </strong>
          </div>
          <score-board></score-board>
        </v-col>
      </v-row>

      <v-row>
        <v-col md="6">
          <v-card class="px-4 py-2" outlined>
            <v-card-title>
              <h4>Latest Blocks</h4>
            </v-card-title>
            <block-table :blocks="latestBlocks10" :loading="loading">
            </block-table>

            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="pointlink"
                class="rect rounded flex-fill"
                outlined
                depressed
                to="blocks"
              >
                View all blocks
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col md="6">
          <v-card class="px-4 py-2" outlined>
            <v-card-title>
              <h4>Latest Transactions</h4>
            </v-card-title>
            <transaction-table
              :transactions="latestTransactions10"
              :loading="loading"
            >
            </transaction-table>

            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="pointlink"
                class="rect rounded flex-fill"
                outlined
                depressed
                to="transactions"
              >
                View all transactions
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import BlockTable from '@/components/BlockTable'
import TransactionTable from '@/components/TransactionTable'
import TxHistoryChart from '@/components/ui/TxHistoryChart'
import ScoreBoard from '@/components/ScoreBoard.vue'

export default {
  name: 'Index',
  components: { TxHistoryChart, TransactionTable, BlockTable, ScoreBoard },
  mixins: [],
  data() {
    return {
      searchKey: '',
    }
  },
  computed: {
    ...mapGetters('Block', [
      'latestBlocks10',
      'latestBlockIndex',
      'latestTransactions10',
      'loading',
    ]),
  },
  beforeDestroy() {
    this.$store.dispatch('Block/syncTx', false)
  },
  async created() {},
  methods: {
    $onLoaded() {
      this.init()
    },
    init() {
      this.$store.dispatch('Block/syncTx', true)
    },
  },
}
</script>

<style scoped lang="scss">
.search-section {
  height: 280px;
  position: relative;
  z-index: 0;
  background: linear-gradient(296deg, #493969 14.78%, #69419F 46.29%, #5D7EAA 107.02%);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: 0px;

  &:after {
    position: absolute;
    z-index: -2;
    left: 0px;
    top: 0px;
    background: url('/grid.png') center no-repeat;
    background-size: 120%;
    content: '';
    width: 100%;
    height: 100%;
  }

  .search-title {
    color: var(--White, #FFF);
    font-family: Inter !important;
    font-size: 24px !important;
    font-style: normal;
    font-weight: 800;
    line-height: 40px; /* 125% */
  }

  .search-form {
    h2 {
      margin-top: 16px;
      margin-bottom: 20px;
      font-size: 26px;
      color: white;
      font-weight: 600;
    }

    ::v-deep .v-text-field {
      .v-input__prepend-inner {
        margin-top: 12px !important;
        margin-left: 12px;

        .v-icon {
          color: var(--v-text-base) !important;
        }
      }

      fieldset {
        display: none;
      }

      .v-input__append-inner {
        margin: 0px !important;
        display: flex;
        height: 60px;
        justify-items: center;
        align-items: center;
        margin-right: -14px !important;
        overflow: hidden;
        border-bottom-right-radius: 12px;
        border-top-right-radius: 12px;

        .v-btn {
          min-width: 64px;
          min-height: 60px;
        }
      }

      .v-input__slot {
        background-color: white !important;
        border-radius: 12px;
        max-width: 650px;

        &::before {
          border: 0px !important;
        }

        input {
          color: var(--v-text-base) !important;
          max-height: 44px;
          height: 44px;
          font-family: Inter;
          font-size: 14px;
          font-weight: 600;
          padding-left: 8px;
        }
        input::placeholder {
          font-family: Inter !important;
          color: #838B9B !important;
          font-size: 14px;
        }
      }
    }
  }
}

.block-height {
  display: flex;
  justify-content: flex-start;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--v-text-base);

  .data {
    margin-left: 8px;
    color: var(--v-pointlink-base);
  }
}

.state-card {
  height: 200px;
  @media screen and (max-width: 599px) {
    height: auto;
    min-height: 200px;
  }
}
</style>
