<template>
  <div class="top">
    <div id="toolbar-wrap" class="d-flex justify-center">
      <v-toolbar dense height="80px" class="page-wide-wrap py-0 my-0 px-2 px-md-4" flat>
        <div class="d-flex justify-space-between flex-fill align-center">
          <v-toolbar-title class="d-flex align-center" style="min-width: 40px;overflow: visible">
            <v-btn icon @click.stop="drawer = !drawer" class="pa-0 ma-0 hidden-md-and-up">
              <v-icon color="pointblue" large>mdi-menu</v-icon>
            </v-btn>
            <v-btn class="hidden-xs-only mx-0 px-2" text :to="{name: 'index'}">
              <img src="/full_logo.png" height="36" style="opacity: 0.8" />
            </v-btn>
          </v-toolbar-title>
          <v-toolbar-items class="hidden-sm-and-down">
            <a depressed class="menu-item" @click="go('arenas')" :class="{'selected': $route.name == 'arenas'}">
              Arenas
            </a>
            <a depressed class="menu-item" @click="go('blocks')" :class="{'selected': $route.name == 'blocks' || $route.name.startsWith('block')}">
              Blocks
            </a>
            <a depressed class="menu-item" @click="go('transactions')" :class="{'selected': $route.name == 'transactions'}">
              Transactions
            </a>
            <v-menu offset-y>
              <template v-slot:activator="{on,attrs}">
                <a depressed class="menu-item" :class="{'selected': $route.name == 'shopHistory'}" v-bind="attrs" v-on="on">
                  Stats
                </a>
              </template>
              <div class="px-4 py-2" style="min-width: 150px;">

                <a depressed class="menu-item py-2" @click="go('shopHistory')" style="color: #333;font-size: 0.9em;font-weight: bold;display: flex;align-items: center">
                  <img src="/icons/Item/100000.png" style="width: 20px;margin-right: 8px;" /> <span>Shop History</span>
                </a>
              </div>
            </v-menu>
          </v-toolbar-items>
          <v-spacer class="hidden-sm-and-up"></v-spacer>
          <v-btn text class="hidden-sm-and-up mr-8" :to="{name: 'index'}"><h3 class="logo theme-font">9cscan</h3></v-btn>
          <v-spacer class="hidden-sm-and-up"></v-spacer>
        </div>
      </v-toolbar>
    </div>
    <v-navigation-drawer v-model="drawer" absolute temporary color="#121212" dark style="z-index: 1000">
      <v-list>
        <v-list-item @click="go('index')">
          <div style="margin-left:-10px;">
            <h3 class="logo theme-font">9cScan</h3>
          </div>
        </v-list-item>
        <v-list-item class="menu-item side-menu-item" @click="go('arenas')" :class="{'selected': $route.name == 'arenas'}">Arenas</v-list-item>
        <v-list-item class="menu-item side-menu-item" @click="go('blocks')" :class="{'selected': $route.name == 'blocks' || $route.name.startsWith('blocks')}">Blocks</v-list-item>
        <v-list-item class="menu-item side-menu-item" @click="go('transactions')" :class="{'selected': $route.name == 'transactions'}">Transactions</v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"
import Event from '../store/event'
import GlobalSearch from "@/components/GlobalSearch";

export default {
    name: 'Toolbar',
    components: {GlobalSearch},
    mixins: [],
    data() {
        return {
            showStats: false,
            drawer: false,
            search: ''
        }
    },
    computed: {
        ...mapGetters('Web3', ['walletDisconnected', 'walletConnected', 'walletConnecting', 'walletNetworkMismatch']),
    },
    async created() {
        if (this.$route.query.search) {
            this.search = this.$route.query.search
        }
    },
    methods: {
        connectWallet() {
            this.$refs.account.connectWallet()
        },
        ...mapActions('Web3', ['switchNetwork'])
    }
}
</script>

<style scoped lang="scss">
#toolbar-wrap {
  height: 64px;
  width: 100%;
  position: relative;

  .side-menu-item {
    font-size: 0.95em;
    font-weight: 600;
    color: #f5f5f5 !important;

    &.selected {
      color: var(--v-pointred-base) !important;
    }
  }
}
.logo {
  color: #234;
  font-size: 30px;
  text-transform: none;
}
.top {
  background-color: white;
  height: 80px;
  .menu-item {
    background-color: transparent;
    color: #333 !important;
    letter-spacing: 0px;
    font-family: Inter !important;
    font-size: 18px !important;
    font-style: normal !important;
    font-weight: 700 !important;
    margin: 0px 20px;
    transition-property: all;
    transition-duration: 0.52s;

    &:hover {
      margin-bottom: -2px;
      border-bottom: 2px solid var(--v-pointpurple-base);
      opacity: 1;
      text-decoration: none !important;
    }

    &.selected {
      color: var(--v-pointpurple-base) !important;
    }
  }
}

</style>
