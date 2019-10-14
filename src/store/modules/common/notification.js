import notificationApi from '@/api/common/notifications'

// initial state
const state = {
  notificationTypeItems: [],
  notificationTypeQueries: {},
  totalNotificationTypeItem: 0,
  notificationTemplateItems: [],
  notificationTemplateQueries: {},
  totalNotificationTemplateItems: 0,
  notificationQueueItems: [],
  notificationQueueQueries: {},
  totalNotificationQueueItem: 0
}

// getters
const getters = {
  notificationTypeItems: (state) => {
    return state.notificationTypeItems
  },
  notificationTypeQueries: (state) => {
    return state.notificationTypeQueries
  },
  totalNotificationTypeItem: (state) => {
    return state.totalNotificationTypeItem
  },
  notificationTemplateItems: (state) => {
    return state.notificationTemplateItems
  },
  notificationTemplateQueries: (state) => {
    return state.notificationTemplateQueries
  },
  totalNotificationTemplateItems: (state) => {
    return state.totalNotificationTemplateItems
  },
  notificationQueueItems: (state) => {
    return state.notificationQueueItems
  },
  notificationQueueQueries: (state) => {
    return state.notificationQueueQueries
  },
  totalNotificationQueueItem: (state) => {
    return state.totalNotificationQueueItem
  }
}

// actions
const actions = {
  async getNotificationTypeItems ({ dispatch, commit, getters }, notificationTypeQueries) {
    await dispatch('setNotificationTypeQueries', notificationTypeQueries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (notificationTypes) => {
        commit('setTotalNotificationTypeItem', notificationTypes.total)
        commit('setNotificationTypeItems', notificationTypes.data)
        resolve(notificationTypes)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setNotificationTypeItems', [])
        // reject(error)
      }
      notificationApi.getNotificationTypes(getters.notificationTypeQueries, cb, errorCb)
    })
  },
  async getNotificationTemplateItems ({ dispatch, commit, getters }, notificationTemplateQueries) {
    await dispatch('setNotificationTemplateQueries', notificationTemplateQueries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (notificationTemplates) => {
        commit('setTotalNotificationTemplateItems', notificationTemplates.total)
        commit('setNotificationTemplateItems', notificationTemplates.data)
        resolve(notificationTemplates)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setNotificationTemplateItems', [])
        // reject(error)
      }
      notificationApi.getNotificationTemplates(getters.notificationTemplateQueries, cb, errorCb)
    })
  },
  async setNotificationTemplateQueries ({ commit }, payload) {
    for (let key in payload) {
      if (payload[key] === '' || payload[key] === undefined ||
        payload[key] === 'undefined' || payload[key] === null) {
        delete payload[key]
      }
    }
    commit('setNotificationTemplateQueries', payload)
  },
  async createNotificationTemplate ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (notificationTemplate) => {
        const notificationTemplateItems = getters.notificationTemplateItems.concat([notificationTemplate])
        commit('setTotalNotificationTemplateItems', getters.totalNotificationTemplateItems + 1)
        commit('setNotificationTemplateItems', notificationTemplateItems)
        resolve(notificationTemplate)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      notificationApi.createNotificationTemplate(payload, cb, errorCb)
    })
  },
  async readNotificationTemplate ({ commit }, notificationType) {
    return new Promise((resolve, reject) => {
      let cb = (notificationTemplate) => {
        resolve(notificationTemplate)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      notificationApi.readNotificationTemplate(notificationType, cb, errorCb)
    })
  },
  async updateNotificationTemplate ({ commit, getters }, payload) {
    return new Promise((resolve, reject) => {
      let cb = (notificationTemplate) => {
        let notificationTemplateItems = getters.notificationTemplateItems
        let currentIndex = notificationTemplateItems.findIndex(item => String(item.notificationType) === String(notificationTemplate.notificationType))
        if (currentIndex >= 0) {
          for (let key in notificationTemplate) {
            notificationTemplateItems[currentIndex][key] = notificationTemplate[key]
          }
        } else {
          notificationTemplateItems.push(notificationTemplate)
          commit('setTotalNotificationTemplateItems', getters.totalNotificationTemplateItems + 1)
        }
        commit('setNotificationTemplateItems', notificationTemplateItems)
        resolve(notificationTemplate)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      notificationApi.updateNotificationTemplate(payload, cb, errorCb)
    })
  },
  async deleteNotificationTemplate ({ commit, getters }, notificationType) {
    return new Promise((resolve, reject) => {
      let cb = (notificationTemplate) => {
        const notificationTemplateItems = getters.notificationTemplateItems.filter(item => String(item.notificationType) !== String(notificationType))
        commit('setTotalNotificationTemplateItems', getters.totalNotificationTemplateItems - 1)
        commit('setNotificationTemplateItems', notificationTemplateItems)
        resolve(notificationTemplate)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      notificationApi.deleteNotificationTemplate(notificationType, cb, errorCb)
    })
  },
  async getNotificationQueueItems ({ dispatch, commit, getters }, notificationQueueQueries) {
    await dispatch('setNotificationQueueQueries', notificationQueueQueries) // wait for `setQueries` to finish

    return new Promise((resolve, reject) => {
      let cb = (notificationQueues) => {
        commit('setTotalNotificationQueueItem', notificationQueues.total)
        commit('setNotificationQueueItems', notificationQueues.data)
        resolve(notificationQueues)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        // commit('setNotificationQueueItems', [])
        // reject(error)
      }
      notificationApi.getNotificationQueues(getters.notificationQueueQueries, cb, errorCb)
    })
  },
  async getNotificationQueueSending ({ commit, getters }, notificationQueueId) {
    return new Promise((resolve, reject) => {
      let cb = (notificationTemplate) => {
        resolve(notificationTemplate)
      }

      // TODO: check when call api error
      let errorCb = (error) => {
        console.log(error)
        reject(error)
      }
      notificationApi.getNotificationQueueSending(notificationQueueId, cb, errorCb)
    })
  }

}

// mutations
const mutations = {
  setTotalNotificationTypeItem (state, payload) {
    state.totalNotificationTypeItem = payload
  },
  setNotificationTypeItems (state, payload) {
    state.notificationTemplateItems = payload
  },
  setNotificationTypeQueries (state, payload) {
    state.notificationTemplateQueries = payload
  },
  setTotalNotificationTemplateItems (state, payload) {
    state.totalNotificationTemplateItems = payload
  },
  setNotificationTemplateItems (state, payload) {
    state.notificationTemplateItems = payload
  },
  setNotificationTemplateQueries (state, payload) {
    state.notificationTemplateQueries = payload
  },
  setTotalNotificationQueueItem (state, payload) {
    state.totalNotificationQueueItem = payload
  },
  setNotificationQueueItems (state, payload) {
    state.notificationTemplateItems = payload
  },
  setNotificationQueueQueries (state, payload) {
    state.notificationTemplateQueries = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
