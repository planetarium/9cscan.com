<template>
  <div class="footer">
    <div class="page-wide-wrap">
      <v-row>
        <v-col cols="12" md="6" class="d-md-flex text-left">
          <div class="px-4 px-md-12">
          </div>
          <div class="px-4 px-md-1">
            <p>9cscan is a Block Explorer and Analytics Platform for Nine Chronicles</p>
            <p class="mt-7 hidden-sm-and-down">©2021 tx0x. All Rights Reserved.</p>
          </div>
        </v-col>
        <v-col cols="12" md="5" offset-md="1">
          <v-row>
            <v-col cols="12" md="auto">
              <router-link :to="{name: 'blocks'}" class="menu mb-md-2">Blocks</router-link>
              <router-link :to="{name: 'transactions'}" class="menu mb-md-2">Transactions</router-link>
              <router-link :to="{name: 'status'}" class="menu mb-md-2">Status</router-link>
            </v-col>
            <v-col cols="12" md="auto">
              <a class="menu mb-md-2" href="https://nine-chronicles.com/" target="_blank">Nine Chronicles</a>
              <a class="menu mb-md-2" href="https://docs.nine-chronicles.com/" target="_blank">- Docs</a>
              <a class="menu mb-md-2" href="https://bit.ly/planetarium-discord" target="_blank">- Discord</a>
              <a class="menu mb-md-2" href="https://github.com/planetarium" target="_blank">- Github</a>
              <a class="menu mb-md-2" href="https://wiki.nine-chronicles.com/en/9C/FAQ" target="_blank">- FAQ</a>

              <p class="mt-12 text-center hidden-md-and-up">©2021 tx0x. All Rights Reserved.</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Footer',
    components: {},
    mixins: [],
    data() {
        return {
        }
    },
    computed: {
    },
    async created() {
    },
    methods: {
    }
}
</script>
<style scoped lang="scss">
.footer {
  width:100%;
  background-color: var(--v-pointblue-darken2);
  border-top: 1px solid #2e2e2e;

  p {
    font-size: 18px;
    color: var(--v-text-base);
    text-align: left;

    a {
      color: var(--v-pointgreen-base) !important;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        opacity: 1 !important;
      }
    }
  }

  a.menu {
    font-size: 18px;
    color: var(--v-text-base) !important;
    text-decoration: none;
    display: block;
    text-align: left;
    padding: 4px 12px;
    &:hover {
      color: var(--v-text-lighten1) !important;
      opacity: 1 !important;
    }
  }
}
</style>
