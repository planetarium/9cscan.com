<template>
  <div class="table-wrap">
    <v-progress-linear indeterminate height="2" color="pointblue" v-if="loading"></v-progress-linear>
    <v-simple-table>
      <template v-slot:default>
        <thead class="thead">
          <tr>
            <th>Item</th>
            <th>Spec</th>
            <th>Price</th>
            <th>Tx Hash</th>
            <th>Block</th>
            <th>Age</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr>
            <td colspan="100" style="height: 400px;background-color: white">
              <v-progress-circular color="pointblue" width="2" indeterminate></v-progress-circular>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="items.length == 0">
        <tr>
          <td colspan="100" style="height: 400px;background-color: white">
            <span class="grey--text">No Items</span>
          </td>
        </tr>
        </tbody>
        <transition-group name="list-complete" tag="tbody" v-else>
          <tr v-for="item in items" :key="item.txId" class="row-item">
            <td>
              <div class="my-2" style="display: flex;justify-content: center;">
                <div :class="`item-bg item-bg-${item.item.grade || 5}`">
                  <img :src="`/icons/FungibleAssetValue/${item.ticker}.png`" v-if="item.ticker" />
                  <img :src="`/icons/item/${item.itemId}.png`" v-if="item.itemId"/>
                  <div class="item-level" v-if="item.item.level">
                    +{{item.item.level}}
                  </div>
                  <div class="item-quantity text-no-wrap" v-if="item.ticker || item.item.quantity > 1">
                    {{item.item.quantity}}
                  </div>
                  <div :class="`item-option item-option-${item.item.statModels.length + item.item.skillModels.length - 1}`" v-if="item.itemId_options && item.item.itemType == 2">
                    <img src="/icons/UI_icon_option_stat.png" />
                    <img src="/icons/UI_icon_option_stat.png" v-if="item.itemId_options.split('_')[1].split('+')[0] >= 2" />
                    <img src="/icons/UI_icon_option_stat.png" v-if="item.itemId_options.split('_')[1].split('+')[0] >= 3"  />
                    <img src="/icons/UI_icon_option_skill.png" v-if="item.itemId_options.split('_')[1].split('+')[1] > 0"  />
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div :class="`text-grade text-grade-${item.item.grade}`" style="font-weight: 600;font-size: 1.1em">{{ itemNames['ITEM_NAME_' + item.itemId]?.['English'] }} {{ item.ticker}}</div>
              <span v-if="item.item.combatPoint" style="font-style: italic; color: #777;font-weight: 500;">CP {{item.item.combatPoint.toLocaleString()}}</span>
            </td>
            <td>
              <div style="display: flex; align-items: center; justify-content: center;font-weight: 500;">
                  <img src="/icons/FungibleAssetValue/NCG.png" style="width: 16px;margin-right: 3px;" /> <span>{{item.item.price}}</span>
              </div>
              <span style="font-size: 0.85em;color: #888;" v-if="item.item.unitPrice && item.item.unitPrice != item.item.price">({{item.item.unitPrice}})</span>
            </td>
            <td>
              <router-link :to="{name: 'transaction', params: {id: item.txId}}">
                {{shortAddress(item.txId)}}
              </router-link>
            </td>
            <td><v-btn class="rect pointlink-btn" outlined small depressed :to="{name: 'block', params: {index: item.blockIndex}}">{{item.blockIndex}}</v-btn></td>
            <td>
              {{moment(item.blockTime).fromNow()}}
            </td>
            <td>
              <router-link :to="{name: 'avatar', params: {address: item.fromAvatar}}">
                {{item.fromAvatar.substring(0, 8)}}
              </router-link>
            </td>
            <td>
              <router-link :to="{name: 'avatar', params: {address: item.toAvatar}}">
                {{item.toAvatar.substring(0, 8)}}
              </router-link>
            </td>
          </tr>
        </transition-group>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import AmountLabel from "@/components/ui/AmountLabel.vue";
import axios from "axios";

export default {
    name: 'ShopHistoryTable',
    components: {AmountLabel},
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        items: {
            type: Array,
            default: []
        },
    },
    mixins: [],
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex'])
    },
    beforeDestroy() {
    },
    async created() {
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
.table-wrap {
  background-color: white;
}
.row-item {
  transition: all 0.5s;
}
.list-complete-enter, .list-complete-leave-to {
  transform: translateY(-40px);
  background-color: #f5f5fa;
}
.list-complete-leave-active {
  transition: none;
  position: absolute;
  opacity: 0;
}
.item-bg {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.item-bg-1 {
  background: url('/icons/item_bg_1.png');
  background-size: contain;
}
.item-bg-2 {
  background: url('/icons/item_bg_2.png');
  background-size: contain;
}
.item-bg-3 {
  background: url('/icons/item_bg_3.png');
  background-size: contain;
}
.item-bg-4 {
  background: url('/icons/item_bg_4.png');
  background-size: contain;
}
.item-bg-5 {
  background: url('/icons/item_bg_5.png');
  background-size: contain;
}
.item-level {
  position: absolute;
  font-family: "Roboto", sans-serif;
  font-weight: 800;
  font-size: 20px;
  color: #f6ec87;
  font-style: italic;
  right: 2px;
  padding-right: 3px;
  bottom: 0;
  z-index: 10;
  text-align: right;
  width: 40px;
  height: 28px;
  text-shadow: 2px 2px 2px #000;
}
.item-quantity {
  position: absolute;
  font-family: "Roboto", sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: white;
  text-shadow: 2px 2px 2px #333;
  right: 2px;
  padding-right: 3px;
  bottom: 0;
  z-index: 10;
  text-align: right;
  width: 100%;
  height: 28px;
}
.item-option {
  background: url('/icons/item_option_bg.png') no-repeat;
  background-size: 15px 40px;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-flow: column;
  height: 38px;
  justify-content: center;
  padding: 1px;
  margin-left: 1px;

  img {
    width: 13px;
  }

  &.item-option-1 {}
  &.item-option-2 {
  }
  &.item-option-3 {
    padding-top: 5px;
    img {
      margin-top: -5px;
    }
  }
  &.item-option-4 {
    padding-top: 4px;
    img {
      margin-top: -7px;
    }
  }
}
.text-grade {
  font-weight: 600;
  text-shadow: 0px 0px 1px #000;
}
.text-grade-1 {
}
.text-grade-2 {
  color: #75d216;
}
.text-grade-3 {
  color: #083fd5;
}
.text-grade-4 {
  color: #dac60a;
  text-shadow: 0px 0px 1px #ffd35c;
}
.text-grade-5 {
  color: #8b00b9;
}
</style>
