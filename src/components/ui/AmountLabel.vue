<template>
  <span class="amount">
    {{ncgFormat(decimalAmount)}} <span class="ticker">{{ticker}}</span>
  </span>
</template>
<script>
export default {
  name: 'AmountLabel',
  props: {
    assetData: {
      type: Object
    },
    amount: {
      type: Number
    },
    minus: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  mixins: [],
  data() {
    return {
    }
  },
  computed: {
    ticker() {
      return this.assetData?.['ticker'] || ""
    },
    decimalAmount() {
      const decimal = Number(this.assetData?.['decimalPlaces'] ?? 0)
      let amount = this.amount * (this.minus ? -1 : 1)
      if (decimal > 0) {
        amount /= Math.pow(10, decimal)
        return amount.toFixed(2)
      }
      return amount
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.amount {
  color: #444;
  font-weight: 500;

  .ticker {
    color: #666;
  }
}
</style>
