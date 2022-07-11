import BigNumber from "bignumber.js"
import Vue from "vue"
import {decode} from "bencodex"
import Event from "@/store/event"

let methods = {
    e18Number(eth, fixed=8) {
        return (new BigNumber(eth)).dividedBy(1e18).toFixed(fixed) * 1
    },
    timeFormat(ts) {
        return moment(ts).format('ll, LT')
    },
    searchKeyword(_key) {
        let key = _key.trim().toLowerCase()
        if (key.startsWith('0x')) {
            key = key.substr(2)
        }
        if (key.length <= 1) return

        console.log(key, key.length)
        if (key.length == 64) { //tx hash
            this.$router.push({name: 'transaction', params: {id: key}}).catch(() => {})
        } else if (key.length == 40) {// account address
            this.$router.push({name: 'account', params: {address: '0x'+key}}).catch(() => {})
        } else if (key.match(/[^0-9]+/) == null) {
            this.$router.push({name: 'block', params: {index: key}}).catch(() => {})
        } else if (key.match(/[0-9a-z_]+/)) {
            this.$router.push({name: 'transactions', query: {action: key}}).catch(() => {})
        } else {
            alert('Unknown Format')
        }

    },
    go(name, query = null, params = {}) {
        this.$router.push({name, query: (query || {}), params}).catch(() => {})
    },
    goReplace(name, query = null, params = {}) {
        this.$router.replace({name, query: (query || {}), params}).catch(() => {})
    },
    openBscScan(address) {
        window.open('https://bscscan.com/address/' + address)
    },
    shortAddress(address, left = 2, right = 4) {
        return address.substr(0, left + 2)
            + '..'
            + address.substr(address.length - right, right)
    },
    parseBencodex(hex) {
        let decoded = decode(Buffer.from(hex, 'hex'))
        const parse = (v) => {
            if (v instanceof Array) {
                return parseArray(v)
            } else if (v instanceof Map) {
                return parseMap(v)
            } else if (v instanceof Buffer) {
                return v.toString('hex')
            } else {
                return v
            }
        }
        const parseMap = (map) => {
            let _map = {}
            map.forEach((v, k) => {
                _map[k] = parse(v)
            })
            return _map
        }
        const parseArray = (arr) => {
            return arr.map(a => {
                return parse(a)
            })
        }
        return parseMap(decoded)
    }
}

Vue.mixin({
    beforeDestroy() {

    },
    mounted() {
        this.$nextTick(() => {
            if (typeof this.loading === "undefined") {
                this.$root.$emit('pageLoaded')
                this.$onLoaded && this.$onLoaded()
            } else {
                if (this.loading === false) {
                    this.$root.$emit('pageLoaded')
                    this.$onLoaded && this.$onLoaded()
                } else {
                    let clearWatch = this.$watch('loading', () => {
                        this.$root.$emit('pageLoaded')
                        this.$onLoaded && this.$onLoaded()
                        clearWatch()
                    })
                }
            }
        })
    },
    methods
})

export default methods

