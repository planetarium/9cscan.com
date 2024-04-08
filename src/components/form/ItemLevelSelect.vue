<template>
  <v-menu offset-y v-model="onoff">
    <template v-slot:activator="{on,attrs}">
      <v-btn class="menu-down-btn" outlined :color="color" rounded v-bind="attrs" v-on="on" @click="open">
        {{ items.find(item => item.value === value)?.label || 'All Level'}}
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
    name: 'ItemLevelSelect',
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
          {value: '0', label: '+0'},
          {value: '1', label: '+1'},
          {value: '2', label: '+2'},
          {value: '3', label: '+3'},
          {value: '4', label: '+4'},
          {value: '5', label: '+5'},
          {value: '6', label: '+6'},
          {value: '7', label: '+7'},
          {value: '8', label: '+8'},
          {value: '9', label: '+9'},
          {value: '10', label: '+10'},
          {value: '11', label: '+11'},
          {value: '12', label: '+12'},
          {value: '13', label: '+13'},
          {value: '14', label: '+14'},
          {value: '15', label: '+15'},
          {value: '16', label: '+16'},
          {value: '17', label: '+17'},
          {value: '18', label: '+18'},
          {value: '19', label: '+19'},
          {value: '20', label: '+20'},
          {value: '21', label: '+21'},
          {value: '22', label: '+22'},
          {value: '23', label: '+23'},
          {value: '24', label: '+24'},
          {value: '25', label: '+25'},
          {value: '26', label: '+26'},
          {value: '27', label: '+27'},
          {value: '28', label: '+28'},
          {value: '29', label: '+29'},
          {value: '30', label: '+30'},
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
