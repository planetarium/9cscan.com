<template>
  <v-row class="info-item ma-0">
    <v-col cols="12" sm="3" class="item-title">{{ title }}</v-col>
    <v-col cols="12" sm="9" class="item-value">
      <div class="d-flex align-center">
      <img :src="itemImage" /> <span v-if="count">x <strong>{{count}}</strong></span>
      </div>
      <span v-if="item && item.name">
        {{item.name.English}}
        <span class="grey--text" v-if="item.desc">({{item.desc.English}})</span>
      </span>
    </v-col>
  </v-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: 'NineChroniclesSheetItem',
    props: ['title', 'itemId', 'count'],
    components: {},
    mixins: [],
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters('Sheet', ['sheet', 'iconPath']),
        item() { return this.getItem() },
        itemImage() {
            return this.getItemImageUrl()
        }
    },
    async created() {
    },
    methods: {
        getItem() {
            return this.sheet.item && this.sheet.item[this.itemId]
        },
        getItemImageUrl() {
            return this.iconPath + this.itemId + '.png'
        }
    }
}
</script>

<style lang="scss">
</style>
