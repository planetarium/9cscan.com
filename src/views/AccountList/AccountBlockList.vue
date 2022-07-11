<template>
  <v-container fluid class="px-0 py-0">
    <page-list-wrapper title=""
                       :items="blocks"
                       :before="before"
                       flat
                       @loadItems="loadBlocks"
                       :accept-filter="['t']"
                       :loading="loading"
                       routerReplace
    >
      <template v-slot:default="{items, loading}">
        <block-table :blocks="items" detail :loading="loading"></block-table>
      </template>
    </page-list-wrapper>
  </v-container>
</template>

<script>
import api from "@/api"
import {mapGetters} from "vuex"
import BlockTable from "@/components/BlockTable";
import PageListWrapper from "@/components/PageListWrapper";
export default {
    name: 'AccountBlockList',
    components: {PageListWrapper, BlockTable},
    mixins: [],
    props: ['miner'],
    data() {
        return {
            loading: false,
            page: Number(this.$route.query.t == 'mined' && this.$route.query.page || 1),
            filter: null,
            blocks: [],
            before: this.$route.query.t == 'mined' && this.$route.query.before || null,
            prevs: []
        }
    },
    computed: {
        ...mapGetters('Block', ['size'])
    },
    async created() {
    },
    methods: {
        async loadBlocks({page, before}) {
            this.loading = true
            try {
                let {blocks, before: nextBefore} = await api.getBlocks({page, before, miner:this.miner, limit: this.size})
                this.blocks = blocks
                this.before = String(nextBefore)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
