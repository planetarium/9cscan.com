<template>
  <v-menu offset-y v-model="onoff">
    <template v-slot:activator="{on,attrs}">
      <v-btn class="menu-down-btn" small outlined :color="color" rounded v-bind="attrs" v-on="on" style="text-transform: none; font-weight:700;letter-spacing: 0px;" @click="open">
        {{ value || 'All Actions'}}
        <v-icon color="point" class="ml-1" small @click.stop.prevent="clearItem" v-if="value">mdi-close</v-icon>
        <v-icon color="point" class="ml-1" small>mdi-chevron-down</v-icon></v-btn>
    </template>

    <div style="background-color: white">
      <v-list class="menu-search">
        <v-list-item>
          <v-text-field dense @click.prevent.stop @keydown.enter="enter" v-model="search" id="action-select-search"></v-text-field>
        </v-list-item>
      </v-list>
      <v-list class="menu-down-list">
        <v-list-item v-for="(item, index) in filteredItems" :key="index" @click="select(item)">
          <v-list-item-title v-html="item.label"></v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script>
export default {
    name: 'ActionsSelect',
    props: {
        value: {type: String},
        color: {type: String, default: 'text'}
    },
    components: {
    },
    mixins: [],
    data() {
        return {
            onoff: false,
            items: ["activate_account", "activate_account2", "add_activated_account", "add_activated_account2", "add_redeem_code", "battle_arena", "buy", "buy2", "buy3", "buy4", "buy5", "buy6", "buy7", "buy8", "buy9", "buy10", "buy11", "buy12", "buy_multiple", "cancel_monster_collect", "charge_action_point", "charge_action_point2", "charge_action_point3", "claim_monster_collection_reward", "claim_monster_collection_reward2", "claim_monster_collection_reward3", "claim_stake_reward", "combination_consumable", "combination_consumable2", "combination_consumable3", "combination_consumable4", "combination_consumable5", "combination_consumable6", "combination_consumable7", "combination_consumable8", "combination_equipment", "combination_equipment2", "combination_equipment3", "combination_equipment4", "combination_equipment5", "combination_equipment6", "combination_equipment7", "combination_equipment8", "combination_equipment9", "combination_equipment10", "combination_equipment11", "combination_equipment12", "create_avatar", "create_avatar2", "create_avatar3", "create_avatar4", "create_avatar5", "create_avatar6", "create_avatar7", "create_avatar8", "create_pending_activation", "create_pending_activations", "daily_reward", "daily_reward2", "daily_reward3", "daily_reward4", "daily_reward5", "daily_reward6", "grinding", "hack_and_slash", "hack_and_slash2", "hack_and_slash3", "hack_and_slash4", "hack_and_slash5", "hack_and_slash6", "hack_and_slash7", "hack_and_slash8", "hack_and_slash9", "hack_and_slash10", "hack_and_slash11", "hack_and_slash12", "hack_and_slash13", "hack_and_slash14", "hack_and_slash_random_buff", "hack_and_slash_sweep", "hack_and_slash_sweep2", "hack_and_slash_sweep3", "hack_and_slash_sweep4", "hack_and_slash_sweep5", "initialize_states", "item_enhancement", "item_enhancement2", "item_enhancement3", "item_enhancement4", "item_enhancement5", "item_enhancement6", "item_enhancement7", "item_enhancement8", "item_enhancement9", "item_enhancement10", "item_enhancement11", "join_arena", "migrate_monster_collection", "migration_activated_accounts_state", "migration_avatar_state", "migration_legacy_shop", "migration_legacy_shop2", "mimisbrunnr_battle", "mimisbrunnr_battle2", "mimisbrunnr_battle3", "mimisbrunnr_battle4", "mimisbrunnr_battle5", "mimisbrunnr_battle6", "mimisbrunnr_battle7", "mimisbrunnr_battle8", "mimisbrunnr_battle9", "monster_collect", "monster_collect2", "monster_collect3", "patch_table_sheet", "ranking_battle", "ranking_battle2", "ranking_battle3", "ranking_battle4", "ranking_battle5", "ranking_battle6", "ranking_battle7", "ranking_battle8", "ranking_battle9", "ranking_battle10", "ranking_battle11", "ranking_battle12", "rapid_combination", "rapid_combination2", "rapid_combination3", "rapid_combination4", "rapid_combination5", "rapid_combination6", "redeem_code", "redeem_code2", "redeem_code3", "renew_admin_state", "sell", "sell2", "sell3", "sell4", "sell5", "sell6", "sell7", "sell8", "sell9", "sell10", "sell_cancellation", "sell_cancellation2", "sell_cancellation3", "sell_cancellation4", "sell_cancellation5", "sell_cancellation6", "sell_cancellation7", "sell_cancellation8", "sell_cancellation9", "stake", "transfer_asset", "transfer_asset2", "unlock_equipment_recipe", "unlock_world", "update_sell", "update_sell2"],
            search: '',
        }
    },
    computed: {
        filteredItems() {
            if (this.search) {
                return this.items.filter(item => item.indexOf(this.search) >= 0).map(item => ({value: item, label: item.replace(this.search, `<b>${this.search}</b>`)}))
            }
            return this.items.map(item => ({value: item, label: item}))
        },
    },
    async created() {

    },
    methods: {
        open() {
            setTimeout(() => {
                document.querySelector('#action-select-search').select()
            }, 100)
        },
        enter() {
            if (document.querySelector('.menu-down-list .v-list-item--highlighted')) return
            if (this.filteredItems[0]) {
                this.select(this.filteredItems[0])
                this.onoff = false
            }
        },
        select(item) {
            if (this.value != item.value) {
                this.$emit('input', item.value)
                this.$emit('change', item.value)
            }
        },
        clearItem() {
            this.$emit('input', '')
            this.$emit('change', '')
        }
    }
}
</script>

<style lang="scss">
.v-menu__content {
  z-index: 20 !important;
  background-color: white;
}
.menu-search {
  position: fixed;
}
.menu-down-list.v-list {
  padding-top: 50px;
  max-height: 500px;
  background-color: #fff !important;
  .v-list-item {
    min-height: 36px;
    &:hover {
      background-color: #eee;
    }
    .v-list-item__icon {
      padding: 0px;
      margin: 6px 8px 0px -4px;
    }
    .v-list-item__title {
      color: #333 !important;
      text-align: left;
      font-size: 14px;

      b {
        color: var(--v-point-base);
      }
    }
  }
}
</style>
<style scoped lang="scss">
.menu-down-btn.v-btn {
  padding: 4px 2px 4px 8px !important;
  min-width: 0px !important;
  min-height: 0px !important;
  height: auto !important;

  ::v-deep .v-ripple__container {
    display: none;
  }
  &:before {
    overflow: hidden;
    border-radius: 4px;
    background-color: var(--v-text-base) !important;
  }
}
</style>
