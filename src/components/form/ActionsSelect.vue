<template>
  <v-menu offset-y v-model="onoff">
    <template v-slot:activator="{on,attrs}">
      <v-btn class="menu-down-btn" outlined :color="color" rounded v-bind="attrs" v-on="on" @click="open">
        {{ value || 'All Actions'}}
        <v-icon :color="color" class="ml-1" small @click.stop.prevent="clearItem" v-if="value">mdi-close</v-icon>
        <v-icon :color="color" class="ml-1" small>mdi-chevron-down</v-icon></v-btn>
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
            items: [],
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
        const actionTypeIdsResponse = await fetch(`https://9cscan.com/all_action_type_ids.txt`);
        const actionTypeIds = (await actionTypeIdsResponse.text()).split('\n');

        this.items = actionTypeIds;
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
