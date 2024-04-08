<template>
  <v-container fluid class="px-0 py-0">
    <div class="page-wide-wrap detail-page px-md-12">
      <h1 class="page-title px-4 px-md-0">Shop History</h1>
      <v-row>
        <v-col class="px-0">
          <page-list-wrapper title=""
                             :items="items"
                             :before="before"
                             @loadItems="loadHistory"
                             :acceptFilter="['type', 'itemId', 'grade', 'level', 'options', 'to', 'from']"
                             :loading="loadings.items"
          >
            <template v-slot:title-after="{filter}">
              <item-type-select :value="filter.type || filter.itemId" color="grayButton" @change="changeTypeFilter" />
              <span style="margin-left: 8px;" v-if="filter.type">
                <item-grade-select v-model="filter.grade" color="grayButton" @change="changeGradeFilter" />
              </span>
              <span style="margin-left: 8px;" v-if="filter.type && filter.grade || filter.itemId">
                <item-level-select v-model="filter.level" color="grayButton" @change="changeLevelFilter" />
              </span>
              <span style="margin-left: 8px;" v-if="filter.type && filter.grade || filter.itemId">
                <item-options-select v-model="filter.options" color="grayButton" @change="changeOptionsFilter" />
              </span>
            </template>
            <template v-slot:default="{items, loading}">
              <shop-history-table :items="items" :loading="loading" @filter="filterItem"></shop-history-table>
            </template>
          </page-list-wrapper>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import api from "../api"
import {mapGetters} from "vuex"
import TransactionTable from "@/components/TransactionTable";
import PageListWrapper from "@/components/PageListWrapper";
import ActionsSelect from "@/components/form/ActionsSelect";
import ShopHistoryTable from "@/components/ShopHistoryTable.vue";
import ItemTypeSelect from "@/components/form/ItemTypeSelect.vue";
import ItemGradeSelect from "@/components/form/ItemGradeSelect.vue";
import ItemLevelSelect from "@/components/form/ItemLevelSelect.vue";
import ItemOptionsSelect from "@/components/form/ItemOptionsSelect.vue";
export default {
    name: 'ShopHistory',
    components: {
      ItemOptionsSelect,
      ItemLevelSelect,
      ItemGradeSelect, ItemTypeSelect, ShopHistoryTable, ActionsSelect, PageListWrapper, TransactionTable},
    mixins: [],
    data() {
        return {
            showLatest: true,
            loadings: {
                items: false
            },
            items: [],
            before: null,
        }
    },
    computed: {
        ...mapGetters('Block', ['size', 'loading', 'latestTransactions', 'latestTransactionsBefore'])
    },
    beforeDestroy() {
        this.$store.dispatch('Block/syncTx', false)
    },
    async created() {
    },
    methods: {
      $onLoaded() {
        this.$store.dispatch('Block/syncTx', true)
      },
      async loadHistory({page, itemId, to, from, type, grade, level, ticker, options, before}) {
        this.loadings.items = true
        try {
          let itemSubType
          if (type) {
            itemSubType = {'weapon': 6, 'armor': 7, 'belt': 8, 'necklace': 9, 'ring': 10, 'food': 0, 'costume': 1, 'hourglass': 15, 'appotion': 16 }[type]
          }
          let {items, before: nextBefore} = await api.getShopHistory({page, to, from, ticker, itemId, itemSubType, grade, level, options, before})
          this.items = items
          this.before = nextBefore
        } finally {
          this.loadings.items = false
        }
      },
      changeTypeFilter(type) {
        if (type.match(/[a-z]+/g)) {
          this.$router.push({
            query: type ? {...this.$route.query, type} : {}
          })
        } else {
          this.$router.push({
            query: type ? {...this.$route.query, itemId: type} : {}
          })
        }
      },
      changeGradeFilter(grade) {
        this.$router.push({
          query: grade ? {...this.$route.query, grade} : {...this.$route.query, grade: undefined, level: undefined, options: undefined}
        })
      },
      changeLevelFilter(level) {
        this.$router.push({
          query: level ? {...this.$route.query, level} : {...this.$route.query, level: undefined}
        })
      },
      changeOptionsFilter(options) {
        this.$router.push({
          query: options ? {...this.$route.query, options} : {...this.$route.query, options: undefined}
        })
      },
      filterItem(item) {
        this.$router.push({
          query: item
        })
      }
    }
}
</script>

<style scoped lang="scss">
</style>
