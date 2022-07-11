import axios from "axios"
import _ from "underscore"

const TABLECSV_PATH = '/NineChronicles/nekoyume/Assets/AddressableAssets/TableCSV/Item/'
const L10N_PATH = '/NineChronicles/nekoyume/Assets/StreamingAssets/Localization/'
const ICON_PATH = '/NineChronicles/nekoyume/Assets/Resources/UI/Icons/Item/'

async function loadCSV(path, csv) {
    let {data} = await axios.get(path + csv)
    return CSV.parse(data)
}
export default {
    namespaced: true,
    state() {
        return {
            inited: false,
            sheet: {},
            iconPath: ICON_PATH
        }
    },
    getters: {
        sheet: state => state.sheet,
        iconPath: state => state.iconPath
    },
    mutations: {
        setInited(state) {
            state.inited = true
        },
        setSheet(state, {type, sheet}) {
            state.sheet[type] = sheet
            console.log('sheet', state.sheet)
        },
    },
    actions: {
        async init({state, commit, dispatch}) {
            if (state.inited) return

            dispatch('loadItemSheet')
            dispatch('loadRecipeSheet')
            commit('setInited')
        },
        async loadRecipeSheet({state, commit, dispatch}) {
            let recipeSheet = {}
            let recipeSheetFiles = ['ConsumableItemRecipeSheet.csv', 'EquipmentItemRecipeSheet.csv']
            for (let file of recipeSheetFiles) {
                loadCSV(TABLECSV_PATH, file).then(rows => {
                    rows.forEach(row => {recipeSheet[row['id']] = row})
                })
            }
            commit('setSheet', {type:'recipe', sheet:recipeSheet})

            let subRecipeSheet = {}
            let subRecipeSheetFiles = ['EquipmentItemSubRecipeSheetV2.csv']
            for (let file of subRecipeSheetFiles) {
                loadCSV(TABLECSV_PATH, file).then(rows => {
                    rows.forEach(row => {subRecipeSheet[row['ID'] || row['id']] = row})
                })
            }
            commit('setSheet', {type:'subRecipe', sheet:subRecipeSheet})
        },
        async loadItemSheet({state, commit, dispatch}) {

            let itemSheet = {}
            let itemSheetFiles = [
                'ConsumableItemSheet.csv',
                'CostumeItemSheet.csv',
                'CostumeItemSheet.csv',
                'EquipmentItemSheet.csv',
                'MaterialItemSheet.csv'
            ]
            for (let file of itemSheetFiles) {
                loadCSV(TABLECSV_PATH, file).then(rows => {
                    rows.forEach(row => {itemSheet[row['id']] = row})
                })
            }

            loadCSV(L10N_PATH, 'item_name.csv').then(rows => {
                rows.forEach(row => {
                    let id = row['Key'].split('_')[2]
                    if (itemSheet[id]) {
                        itemSheet[id].name = row
                    }
                })
            })
            loadCSV(L10N_PATH, 'item_description.csv').then(rows => {
                rows.forEach(row => {
                    let id = row['Key'].split('_')[2]
                    if (itemSheet[id]) {
                        itemSheet[id].desc = row
                    }
                })
            })

            commit('setSheet', {type:'item', sheet:itemSheet})
        },
        async getItemImage({state}, itemId) {
            return ICON_PATH + itemId + '.png'
        }
    },

}
