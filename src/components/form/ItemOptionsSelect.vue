<template>
  <v-menu offset-y v-model="onoff">
    <template v-slot:activator="{on,attrs}">
      <v-btn class="menu-down-btn" small outlined :color="color" rounded v-bind="attrs" v-on="on" style="text-transform: none; font-weight:700;letter-spacing: 0px;" @click="open">
        <span v-if="items.find(item => item.value == value)">
          <img src="/icons/UI_icon_option_stat.png" style="width: 16px;" />
          <img src="/icons/UI_icon_option_stat.png" style="width: 16px;margin-left:-6px;" v-if="value.split('+')[0] > 1" />
          <img src="/icons/UI_icon_option_stat.png" style="width: 16px;margin-left:-6px;" v-if="value.split('+')[0] > 2" />
          <img src="/icons/UI_icon_option_skill.png" style="width: 16px;margin-left:-6px;" v-if="value.split('+')[1] > 0" />
        </span>
        <span v-else>All Options</span>
        <v-icon color="point" class="ml-1" small @click.stop.prevent="clearItem" v-if="value">mdi-close</v-icon>
        <v-icon color="point" class="ml-1" small>mdi-chevron-down</v-icon></v-btn>
    </template>

    <div style="background-color: white">
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="select(item)">
          <v-list-item-title>
            <img src="/icons/UI_icon_option_stat.png" style="width: 16px;" />
            <img src="/icons/UI_icon_option_stat.png" style="width: 16px;margin-left:-6px;" v-if="item.options > 1" />
            <img src="/icons/UI_icon_option_stat.png" style="width: 16px;margin-left:-6px;" v-if="item.options > 2" />
            <img src="/icons/UI_icon_option_skill.png" style="width: 16px;margin-left:-6px;" v-if="item.skill > 0" />
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script>
export default {
    name: 'ItemOptionsSelect',
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
                return this.items.filter(item => item.label.toLowerCase().indexOf(this.search.toLowerCase()) >= 0)
            }
            return this.items
        },
    },
    async created() {
        this.items = [
          {options: 1, skill: 0, value: '1+0'},
          {options: 2, skill: 0, value: '2+0'},
          {options: 3, skill: 0, value: '3+0'},
          {options: 1, skill: 1, value: '1+1'},
          {options: 2, skill: 1, value: '2+1'},
          {options: 3, skill: 1, value: '3+1'}
        ];
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
