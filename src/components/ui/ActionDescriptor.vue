<template>
  <div>
    <combination-equipment-descriptor
        v-if="type == 'combination_equipment8'"
        :recipe-id="data.r" :sub-recipe-id="data.i"></combination-equipment-descriptor>
    <combination-consumable-descriptor
        v-if="type == 'combination_consumable8'"
        :recipe-id="data.r" :sub-recipe-id="data.s"></combination-consumable-descriptor>
  </div>
</template>

<script>
import CombinationEquipmentDescriptor from "@/components/ui/CombinationEquipmentDescriptor";
import CombinationConsumableDescriptor from "@/components/ui/CombinationConsumableDescriptor";
export default {
    name: 'ActionDescriptor',
    props: {
        type: {
            type: String
        },
        data: {
            type: Object
        }
    },
    components: {CombinationConsumableDescriptor, CombinationEquipmentDescriptor},
    mixins: [],
    data() {
        return {
        }
    },
    computed: {
    },
    methods: {
    }
}
</script>

<style lang="scss">
</style>
