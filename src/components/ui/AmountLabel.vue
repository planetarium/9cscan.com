<template>
  <span class="amount">
    {{minus ? '-' : ''}}{{amount}} <span class="ticker">{{ticker}}</span>
  </span>
</template>
<script>
export default {
  name: 'AmountLabel',
  props: {
    amountValue: {
      type: String
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
      return this.amountValue.split(' ')[1] || ""
    },
    amount() {
      const amount = this.amountValue.split(' ')[0]
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
