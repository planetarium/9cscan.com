<template>
  <v-card v-if="sheet.item" outlined class="ma-4">
    <v-card-title>Recipe Description</v-card-title>
    <v-card-text>
      <nine-chronicles-sheet-item title="Result Item:" :item-id="recipe['result_consumable_item_id']" v-if="recipe"></nine-chronicles-sheet-item>
      <v-row class="info-item ma-0">
        <v-col cols="12" sm="3" class="item-title">Required Block Index</v-col>
        <v-col cols="12" sm="9" class="item-value">{{recipe['required_block_index']}}</v-col>
      </v-row>
      <v-row class="info-item ma-0">
        <v-col cols="12" sm="3" class="item-title">Required Gold</v-col>
        <v-col cols="12" sm="9" class="item-value">{{recipe['required_gold']}}</v-col>
      </v-row>
      <v-row class="info-item ma-0">
        <v-col cols="12" sm="3" class="item-title">Required Action Point</v-col>
        <v-col cols="12" sm="9" class="item-value">{{recipe['required_ap']}}</v-col>
      </v-row>
      <nine-chronicles-sheet-item title="Recipe Item:"
                                  v-for="(_, idx) in Array(5)"
                                  :item-id="recipe[getMaterialId(idx)]"
                                  :count="recipe[getMaterialCount(idx)]"
                                  v-if="recipe && recipe[getMaterialId(idx)]"></nine-chronicles-sheet-item>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import NineChroniclesSheetItem from "@/components/ui/NineChroniclesSheetItem";

export default {
    name: 'CombinationConsumableDescriptor',
    props: ['recipeId', 'subRecipeId'],
    components: {NineChroniclesSheetItem},
    mixins: [],
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters('Sheet', ['sheet', 'iconPath']),
        recipe() { return this.sheet.recipe && this.sheet.recipe[this.recipeId] },
        resultItem() { return this.getItem(this.recipe['result_equipment_id']) },
        itemImage() {
            return this.resultItem && this.getItemImageUrl(this.resultItem['id'])
        }
    },
    async created() {
    },
    methods: {
        getItem(itemId) {
            return this.sheet.item && this.sheet.item[itemId]
        },
        getItemImageUrl(itemId) {
            return this.iconPath + itemId + '.png'
        },
        getMaterialId(idx) {
            return `material_item_id_${idx+1}`
        },
        getMaterialCount(idx) {
            return `material_item_count_${idx+1}`
        }
    }
}
</script>

<style lang="scss">
</style>
