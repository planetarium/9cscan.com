<template>
  <div>
    <div class="search-section">
      <div class="page-wide-wrap py-0 px-md-8">
        <v-row>
          <v-col cols="auto" class="hidden-sm-and-down py-2 text-right text-md-left">
            <v-chip small label color="#f8f8f8" style="font-weight:500;font-size: 11px;margin-top: 14px;" v-if="latestBlockIndex">
              <span style="margin-right:4px;color:#444;">WNCG: ${{WncgPrice.toFixed(2)}} <span :class="WncgChange24h < 0 ? 'red--text' : 'primary--text'">({{WncgChange24h.toFixed(2)}}%)</span></span>
              | <span class="ml-1">Block: {{latestBlockIndex}} <span class="ml-1" style="font-weight:400;color:#777;font-size:0.95em;" v-if="latestBlocks && latestBlocks[0]">({{moment(latestBlocks[0].timestamp).fromNow()}})</span></span>
            </v-chip>
          </v-col>
          <v-col class="py-0 d-flex justify-end">
            <div class="search-form">
              <v-text-field
                  outlined
                  placeholder="Search by Block / Account Address / Tx Hash / Action Symbol"
                  v-model="searchKey"
                  @keydown.enter="searchKeyword(searchKey)"
              >
                <template v-slot:append>
                  <v-btn depressed color="pointblue" @click="searchKeyword(searchKey)" class="rect darken-1"><v-icon color="white">mdi-magnify</v-icon></v-btn>
                </template>
              </v-text-field>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="mt-4 text-left mx-4 hidden-md-and-up">
      <v-chip small label color="#f8f8f8" style="font-weight:500;font-size: 11px;" v-if="latestBlockIndex">
        <span style="margin-right:4px;color:#444;">WNCG: ${{WncgPrice.toFixed(2)}} <span :class="WncgChange24h < 0 ? 'red--text' : 'primary--text'">({{WncgChange24h.toFixed(2)}}%)</span></span>
        | <span class="ml-1">Block: {{latestBlockIndex}} <span class="ml-1" style="font-weight:400;color:#777;font-size:0.95em;" v-if="latestBlocks && latestBlocks[0]">({{moment(latestBlocks[0].timestamp).fromNow()}})</span></span>
      </v-chip>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
import Event from '../store/event'

export default {
    name: 'GlobalSearch',
    components: {},
    mixins: [],
    data() {
        return {
            searchKey: ''
        }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex', 'latestBlocks']),
        ...mapGetters('Price', ['WncgPrice', 'WncgMarketCap', 'WncgChange24h']),
    },
    async created() {
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
.search-section {
  height: 60px;
  position: relative;
  z-index: 0;
  //background-color: var(--v-pointblue-darken2);
  //box-shadow: 0px 5px 5px #eee;
  border-bottom: 1px solid #eee;
  background-color: white;
  margin-bottom: 0px;
  &:after {
    position: absolute;
    opacity: 0.16;
    z-index:-2;
    left:0px;
    top: 0px;
    //background: url("https://nine-chronicles.com/assets/img/hero/1.jpg") center no-repeat;
    background-size: cover;
    content: "";
    width: 100%;
    height: 100%;
  }

  .search-form {
    width: 100%;
    max-width: 650px;
    h2 {
      margin-top: 0px;
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
        height: 46px;
        justify-items: center;
        align-items: center;
        margin-right: -14px !important;
        overflow: hidden;
        border-bottom-right-radius: 12px;
        border-top-right-radius: 12px;
        .v-btn {
          min-height: 46px;
          width: 40px;
        }
      }
      .v-input__slot {
        background-color: #F1F5F9 !important;
        min-height: 46px;
        max-height: 46px;
        border-radius: 12px;
        &::before {
          border: 0px !important;
        }
        &::after {
        }
        input {
          color: var(--v-text-base) !important;
          max-height: 46px !important;
          height: 46px !important;
          font-size: 16px;
          padding-left: 8px;
        }
        input::placeholder {
          color: var(--v-text-base) !important;
          font-size: 16px;
        }
      }
    }

  }
}

</style>
