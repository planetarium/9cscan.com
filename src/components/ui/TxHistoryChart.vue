<template>
  <canvas height="130" width="300" style="max-height: 130px" id="tx-chart"></canvas>
</template>

<script>
import Chart from "chart.js/auto"
import {mapGetters} from "vuex";
export default {
    name: 'TxHistoryChart',
    props: {
    },
    components: {},
    mixins: [],
    data() {
        return {
            chart: null
        }
    },
    computed: {
        ...mapGetters('Block', ['latestBlockIndex', 'latestBlocksFull'])
    },
    mounted() {
        this.chart = new Chart(document.querySelector('#tx-chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    borderColor: '#f6a14c',
                    borderWidth: 2,
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    fill: false,
                    radius: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {display: false},
                    title: {display: false},
                },
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        display: false,
                        title: {display: false}
                    },
                    y: {display: true}
                }
            }
        })

        this.$watch('latestBlockIndex', () => {
            this.update()
        })
        this.update()
    },
    methods: {
        update() {
            if (!this.chart) return
            let blocks = this.latestBlocksFull.map(b => ({timestamp: b.timestamp, txc: b.transactionCount, index: b.index})).reverse()
            if (blocks && blocks.length > 0) {
                blocks = blocks.splice(10 - (blocks[0].index % 10))
                this.chart.data.labels = _.chunk(blocks, 10).map(bs => bs[0].index + '~' + _.last(bs).index)
                this.chart.data.datasets[0].data = _.chunk(blocks, 10).map(bs => bs.map(b => b.txc).reduce((a,b) => a+b)/ bs.length)
                this.chart.update()
            }
        }
    }
}
</script>

<style lang="scss">
</style>
