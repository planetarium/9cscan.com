import axios from "axios"
const isDevelopment = process.env.NODE_ENV !== 'production'
import { param, delayWrap } from './util'
async function api(method, url, data, option = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await delayWrap(() => {
                let headers = {}
                return axios({
                    method,
                    url,
                    data,
                    headers
                })
            }, option.delay || 0)
            resolve(response['data'])
        } catch(e) {
            if (e?.response?.data) {
                reject(e.response.data)
            } else {
                reject(e.message)
            }
        }
    })
}

function apiHost() {
    return process.env.VUE_APP_API_HOST
}

function buildUrl(path, data) {
    let queryString = data ? '?' + param(data) : ''
    return apiHost() + path + queryString
}

async function del(path, data, option) {
    return api('DELETE', buildUrl(path, data), {}, option)
}
async function post(path, data, option) {
    return api('POST', buildUrl(path), data, option)
}
async function put(path, data, option) {
    return api('PUT', buildUrl(path), data, option)
}
async function get(path, data, option) {
    return api('GET', buildUrl(path, data), {}, option)
}
async function multipartPost(path, file, option = {}) {
    let headers = option.headers || {}
    headers['Content-Type'] = 'multipart/form-data'
    option.headers = headers
    let formData = new FormData();
    formData.append('file', file);
    return api('POST', buildUrl(path), formData, option)
}

const hexlify = function(str) {
    let result = '';
    let padding = '00';
    for (let i=0, l=str.length; i<l; i++) {
        let digit = str.charCodeAt(i).toString(16);
        let padded = (padding+digit).slice(-2);
        result += padded;
    }
    return result;
}

function parseTxAction(tx) {
    tx['actions'] && tx['actions'].forEach((action, idx) => {
        if (action['inspection']) {
            let inspection = JSON.parse(action['inspection']
                .replace(/\,(?!\s*?[\{\[\"\'\w])/g, '')
                .replace(/[\n\r]/gi, '')
                .replace(/b"([\\x0-9a-fA-F]+?)"/g, function(_, v) { return '"0x' + v.replace(/\\x/g, '') + '"' }))
            inspection['txIdSeq'] = tx.id + '/' + idx
            inspection['actionCount'] = tx.actions.length
            inspection['typeId'] = inspection['type_id']
            inspection['timestamp'] = tx.timestamp
            delete inspection['type_id']
            if (inspection['values']) {
                for (let key of Object.keys(inspection['values'])) {
                    if (!inspection[key]) {
                        inspection[key] = inspection['values'][key]
                    } else {
                        inspection['_' + key] = inspection['values'][key]
                    }
                }
                delete inspection['values']
            }

            if (!inspection['avatarAddress']) {
                if (inspection['a'] && typeof inspection['a'] == "string" && inspection['a'].startsWith('0x')) {
                    inspection['avatarAddress'] = inspection['a']
                } else if (inspection['aa'] && typeof inspection['aa'] == "string" && inspection['aa'].startsWith('0x')) {
                    inspection['avatarAddress'] = inspection['aa']
                } else if (inspection['sva'] && typeof inspection['sva'] == "string" && inspection['sva'].startsWith('0x')) {
                    inspection['avatarAddress'] = inspection['sva']
                } else if (inspection['ba'] && typeof inspection['ba'] == "string" && inspection['ba'].startsWith('0x')) {
                    inspection['avatarAddress'] = inspection['ba']
                } else if (inspection['sellerAvatarAddress'] && typeof inspection['sellerAvatarAddress'] == "string" && inspection['sellerAvatarAddress'].startsWith('0x')) {
                    inspection['avatarAddress'] = inspection['sellerAvatarAddress']
                }
            }

            if (inspection['avatarAddress']) {
                inspection['avatarAddress'] = inspection['avatarAddress'].toLowerCase()
            }

            action['inspection'] = inspection
        }
    })
}

export default {
    api,
    get,
    post,
    multipartPost,
    buildUrl,
    getBlock: async function(index) {
        let data = await get('/blocks/' + index)
        data.transactions.forEach(tx => parseTxAction(tx))
        return data
    },
    getBlocks: async function(param) {
        return await get('/blocks', param)
    },
    getBlockTransactions: async function(index) {
        return await get('/blocks/' + index + '/transactions')
    },
    getAccountTransactions: async function(address, param) {
        let data = await get('/accounts/' + address + '/transactions', param)
        data.transactions.forEach(tx => parseTxAction(tx))
        return data
    },
    getTransactions: async function(param) {
        let data = await get('/transactions', param)
        data.transactions.forEach(tx => parseTxAction(tx))
        return data
    },
    getTransaction: async function(id) {
        let tx = await get('/transactions/' + id)
        parseTxAction(tx)
        return tx
    },
    getTransactionStatus: async function(id) {
        let {status} = await get('/transactions/' + id + '/status')
        return status
    },
    refreshAccount: async function(address) {
        let data = await post('/account/refresh?address=' + address)
        return data
    },
    getAccount: async function(param) {
        let data = await get('/account', param)
        return data
    },
    getPrice: async function() {
        return await get('/price')
    },
    getStatus: async function() {
        return await get('/status')
    },
}
