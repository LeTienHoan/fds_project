const state = {
  end_point_new: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2.1/mbl/' : 'http://192.168.10.36:8081/api/',
  end_point: window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://192.168.10.36:8081/api/',
  group_id: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942,
  apiConfigHeader: {
    headers: {
      groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : 42942
    }
  },
  loadedLayouts: [],
  loadedTypes: [],
  loadedTemplateCodes: []
}
const mutations = {
  setLoadedLayouts (state, payload) {
    state.loadedLayouts = payload
  },
  setLoadedTypes (state, payload) {
    state.loadedTypes = payload
  },
  setLoadedTemplateCodes (state, payload) {
    state.loadedTemplateCodes = payload
  }
}
const actions = {
  async loadLayouts ({ commit, getters }, templateCode) {
    return new Promise((resolve, reject) => {
      /**
      console.log('TODO: LOAD LAYOUTS by templateCode', templateCode)
      let fake = [
        { widgetLayoutId: 11111, widgetCode: 'xxxxxxx', widgetName: 'acdss', widgetX: 0, widgetY: 0, widgetWidth: 2, widgetHeight: 2 },
        { widgetLayoutId: 111112, widgetCode: 'xxxxxxx', widgetName: 'acdss', widgetX: 2, widgetY: 0, widgetWidth: 2, widgetHeight: 4 },
        { widgetLayoutId: 111113, widgetCode: 'xxxxxxx', widgetName: 'acdss', widgetX: 4, widgetY: 0, widgetWidth: 2, widgetHeight: 5 },
        { widgetLayoutId: 111114, widgetCode: 'xxxxxxx', widgetName: 'acdss', widgetX: 6, widgetY: 0, widgetWidth: 2, widgetHeight: 3 }
      ]
      commit('setLoadedLayouts', fake)
      */
      templateCode = templateCode || ' '
      let url = getters.end_point_new + 'widgetlayouts/' + templateCode
      window.axios.get(url, getters.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          let returnData = {
            total: serializable.total,
            data: serializable.data || []
          }
          commit('setLoadedLayouts', returnData.data)
          resolve(returnData)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
          commit('setLoadedLayouts', [])
        })
    })
  },
  async addWidgetType ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let loadedTypes = getters.loadedTypes
      /**
      let paramsAddWidgetType = new URLSearchParams()
      paramsAddWidgetType.append('widgetName', payload.widgetName)
      paramsAddWidgetType.append('widgetCode', payload.widgetCode)
      paramsAddWidgetType.append('widgetTemplate', payload.widgetTemplate)
      */
      let config = {
        headers: {
          groupId: getters.group_id
        }
      }
      let url = getters.end_point_new + 'widgettypes'
      window.axios.post(url, payload, config)
        .then(function (response) {
          loadedTypes.push(response.data)
          commit('setLoadedTypes', loadedTypes)
          resolve(response.data)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
        })
    })
  },
  async editWidgetType ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let loadedTypes = getters.loadedTypes
      let url = getters.end_point_new + 'widgettypes/' + payload.widgetTypeId
      window.axios.put(url, payload, getters.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          for (let k in loadedTypes) {
            if (loadedTypes[k]['widgetTypeId'] === payload.widgetTypeId) {
              loadedTypes[k] = serializable
            }
          }
          commit('setLoadedTypes', loadedTypes)
          resolve(serializable)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
        })
    })
  },
  async editLayout ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let layouts = getters.loadedLayouts
      for (let key in layouts) {
        if (layouts[key]['widgetLayoutId'] === payload['widgetLayoutId']) {
          for (let k in payload) {
            layouts[key][k] = payload[k]
          }
          commit('setLoadedLayouts', layouts)
        }
      }
      let url = getters.end_point_new + '/widgetlayouts/' + payload['widgetLayoutId']
      window.axios.put(url, payload, getters.apiConfigHeader)
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
        })
    })
  },
  async addLayout ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let layouts = getters.loadedLayouts
      /**
      let paramsAddLayout = new URLSearchParams()
      paramsAddLayout.append('widgetName', payload.widgetName)
      paramsAddLayout.append('widgetCode', payload.widgetCode)
      */
      payload.templateCode = payload.templateCode || ' '
      let url = getters.end_point_new + 'widgetlayouts/' + payload.templateCode
      window.axios.post(url, payload, getters.apiConfigHeader)
        .then(function (response) {
          layouts.push(response.data)
          commit('setLoadedLayouts', layouts)
          resolve(response.data)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
        })
    })
  },
  async removeLayout ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let layouts = getters.loadedLayouts
      let url = getters.end_point_new + 'widgetlayouts/' + payload.widgetLayoutId
      window.axios.delete(url, getters.apiConfigHeader)
        .then(function (response) {
          layouts = layouts.filter(function (item) {
            return item.widgetLayoutId !== payload.widgetLayoutId
          })
          commit('setLoadedLayouts', layouts)
          resolve(payload)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
        })
    })
  },
  async loadTypes ({ commit, getters }) {
    return new Promise((resolve, reject) => {
      /**
      let code = '<h1>aaaaaaaaaaaa</h1>'
      let fake = [
        { widgetTypeId: '1', widgetCode: 'TYPE1', widgetName: 'type 1', widgetTemplate: code + '1' },
        { widgetTypeId: '2', widgetCode: 'TYPE2', widgetName: 'type 2', widgetTemplate: code + '2' },
        { widgetTypeId: '3', widgetCode: 'TYPE3', widgetName: 'type 3', widgetTemplate: code + '3' },
        { widgetTypeId: '4', widgetCode: 'TYPE4', widgetName: 'type 4', widgetTemplate: code + '4' }
      ]
      alert('loadTypes')
      commit('setLoadedTypes', fake)
      */
      let url = getters.end_point_new + 'widgettypes/'
      window.axios.get(url, getters.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          let dataResult = {
            total: serializable.total,
            data: serializable.data || []
          }
          commit('setLoadedTypes', dataResult.data)
          resolve(dataResult)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
          commit('setLoadedTypes', [])
        })
    })
  },
  async loadTemplateCodes ({ commit, getters }) {
    return new Promise((resolve, reject) => {
      /**
      let fake = [
        { itemName: 'template 1', itemCode: 'TEM1' },
        { itemName: 'template 2', itemCode: 'TEM2' },
        { itemName: 'template 3', itemCode: 'TEM3' },
        { itemName: 'template 4', itemCode: 'TEM4' }
      ]
      commit('setLoadedTemplateCodes', fake)
      */
      let url = getters.end_point + 'dictcollections/DASHBOARD_TYPE/dictitems'
      window.axios.get(url, getters.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          let dataResult = {
            total: serializable.total,
            data: serializable.data || []
          }
          commit('setLoadedTemplateCodes', dataResult.data)
          resolve(dataResult)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
          commit('setLoadedTemplateCodes', [])
        })
    })
  },
  async copyLayouts ({ commit, getters }, templateCode) {
    return new Promise((resolve, reject) => {
      let url = getters.end_point_new + 'widgetlayouts/copy/' + (templateCode || ' ')
      window.axios.get(url, getters.apiConfigHeader)
        .then(function (response) {
          let serializable = response.data
          let dataResult = {
            total: serializable.total,
            data: serializable.data || []
          }
          commit('setLoadedLayouts', dataResult.data)
          resolve(dataResult)
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
          commit('setLoadedLayouts', [])
        })
    })
  }
}
const getters = {
  loadedLayouts (state) {
    return state.loadedLayouts
  },
  end_point_new (state) {
    return state.end_point_new
  },
  end_point (state) {
    return state.end_point
  },
  group_id (state) {
    return state.group_id
  },
  apiConfigHeader (state) {
    return state.apiConfigHeader
  },
  loadedTypes (state) {
    return state.loadedTypes
  },
  loadedTemplateCodes (state) {
    return state.loadedTemplateCodes
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
