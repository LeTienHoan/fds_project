/**
 * Mocking client-server processing
 */
/**
const _notificationTemplateItems = [
  { 'day': 1, 'day': 1, 'hours': '08.00-12.00,13.30-18.00' },
  { 'day': 2, 'day': 2, 'hours': '08.00-12.00,13.30-18.00' },
  { 'day': 3, 'day': 0, 'hours': '08.00-12.00,13.30-18.00' }
]
 */
const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlNotificationTemplates = endPoint + 'notificationtemplates'
const urlNotificationTypes = endPoint + 'notificationtypes'
const urlNotificationQueues = endPoint + 'notificationqueues'

export default {

  getNotificationTypes (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlNotificationTypes, {
      params: queries
    })
      .then(function (response) {
        const serializable = response.data
        const result = {
          total: serializable.total,
          data: [...serializable.data || []]
        }
        cb(result)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getNotificationTemplates (query, cb, errorCb) {
    /**
    const result = {
      total: _notificationTemplateItems.length,
      data: _notificationTemplateItems
    }
    setTimeout(() => cb(result), 100)
     */
    // TODO: call api get notificationtemplates
    let queryDefault = {
      start: -1,
      end: -1
    }
    Object.assign(queryDefault, query)
    window.axios.get(urlNotificationTemplates, {
      params: queryDefault
    })
      .then(function (response) {
        const serializable = response.data
        const result = {
          total: serializable.total,
          data: [...serializable.data || []]
        }
        cb(result)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  readNotificationTemplate (notificationType, cb, errorCb) {
    // setTimeout(() => cb(_notificationTemplateItems.find(item => item.notificationType === day)), 100)
    // TODO: call api get holiday by id
    /**  */
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlNotificationTemplates + '/' + notificationType
    window.axios.get(url, {params: queries})
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  createNotificationTemplate (params, cb, errorCb) {
    // setTimeout(() => cb(_notificationTemplateItems[0]), 100)
    // TODO: call api create holiday

    // if change swagger api, this urlSearchParams is neednt
    /**
    let urlParamsCreateNotificationTemplate = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateNotificationTemplate.append(key, params[key])
    } */
    window.axios.post(urlNotificationTemplates, params)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateNotificationTemplate (params, cb, errorCb) {
    // setTimeout(() => cb(_notificationTemplateItems[0]), 100)
    // TODO: call api create holiday

    // if change swagger api, this urlSearchParams is neednt
    /**
    let urlParamsUpdateNotificationTemplate = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateNotificationTemplate.append(key, params[key])
    } */
    const url = urlNotificationTemplates + '/' + params.notificationType
    window.axios.put(url, params)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteNotificationTemplate (notificationType, cb, errorCb) {
    // setTimeout(() => cb(_notificationTemplateItems), 100)
    // TODO: call api create holiday

    const url = urlNotificationTemplates + '/' + notificationType
    window.axios.delete(url)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getNotificationQueues (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlNotificationQueues, {
      params: queries
    })
      .then(function (response) {
        const serializable = response.data
        const result = {
          total: serializable.total,
          data: [...serializable.data || []]
        }
        cb(result)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getNotificationQueueSending (notificationQueueId, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlNotificationQueues + '/' + notificationQueueId + '/sending'
    window.axios.get(url, {params: queries})
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  }

}
