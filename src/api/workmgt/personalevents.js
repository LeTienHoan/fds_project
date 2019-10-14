/**
 * Mocking client-server processing
 */

window._personalEventItems = [
  {
    'personalEventId': 0,
    'subject': 'personalEventId 1',
    'locationId': 101,
    'location': 'Phong hop 1',
    'geolocation': '2222, 2222',
    'startDate': window.moment().startOf('day').toDate().getTime(),
    'endDate': window.moment().toDate().getTime(),
    'confirm': 0,
    'permission': 'read'
  },
  {
    'personalEventId': 2,
    'subject': 'personalEventId 2',
    'locationId': 102,
    'location': 'Phong hop 2',
    'geolocation': '2222, 2222',
    'startDate': window.moment().startOf('day').toDate().getTime(),
    'endDate': window.moment().toDate().getTime(),
    'confirm': 2,
    'permission': 'write'
  },
  {
    'personalEventId': 3,
    'subject': 'personalEventId 3',
    'locationId': 103,
    'location': 'Phong hop 3',
    'geolocation': '2222, 2222',
    'startDate': window.moment().startOf('day').toDate().getTime(),
    'endDate': window.moment().toDate().getTime(),
    'confirm': 1,
    'permission': 'owner'
  }
]

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://192.168.10.89:8080/api/'
const urlPersonalEvents = endPoint + 'personalevents'

const hasClient = {

  getPersonalEvents (urlParams, query, cb, errorCb) {
    const result = {
      total: window._personalEventItems.length,
      data: window._personalEventItems
    }
    setTimeout(() => cb(result), 100)
  },

  readPersonalEvent (personalEventId, cb, errorCb) {
    setTimeout(() => cb(window._personalEventItems.find(item => item.personalEventId === personalEventId)), 100)
  },

  createPersonalEvent (params, cb, errorCb) {
    let result = {}
    for (let key in window._personalEventItems[0]) {
      if (key === 'personalEventId') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._personalEventItems[0][key]
      }
    }
    // error window._personalEventItems.push(result)
    setTimeout(() => cb(result), 100)
  },

  updatePersonalEvent (params, cb, errorCb) {
    let updated = window._personalEventItems.find(item => item.personalEventId === params.personalEventId)
    let result = {}
    Object.assign(result, updated, params)
    // error let index = window._personalEventItems.findIndex(item => item.personalEventId === params.personalEventId)
    // error window._personalEventItems[index] = result
    setTimeout(() => cb(result), 100)
  },

  deletePersonalEvent (personalEventId, cb, errorCb) {
    window._personalEventItems = window._personalEventItems.filter(item => item.personalEventId !== personalEventId)
    setTimeout(() => cb(window._personalEventItems.find(item => item.personalEventId === personalEventId)), 100)
  },

  copyPersonalEvent (params, cb, errorCb) {
    setTimeout(() => cb(window._personalEventItems), 100)
  }

}
const hasServer = {

  getPersonalEvents (urlParams, query, cb, errorCb) {
    let url = urlPersonalEvents + '/user/' + urlParams.userId + '/from/' + urlParams.fromdate + '/to/' + urlParams.todate
    let queries = {
      start: -1,
      end: -1
    }
    let activitieQueries = {
      start: -1,
      end: -1,
      type: 'EVENT',
      join: 'do,support,leader'
    }
    Object.assign(queries, query)
    Object.assign(activitieQueries, query)
    if (Number(query.personalId) === 0) {
      delete queries.personalId
      delete activitieQueries.personalId
    }
    if (Number(query.workspace) === 0) {
      delete queries.workspace
      delete activitieQueries.workspace
    }
    let headerPersonalEvent = {
      params: queries
    }
    window.axios.all([
      window.axios.get(url, headerPersonalEvent)
    ])
      .then(window.axios.spread(function (response) {
        let serializable = response.data
        let result = {
          total: serializable.total,
          data: []
        }
        if (!serializable.data) {
          result.data = []
        } else {
          result.data = [].concat(serializable.data)
        }
        cb(result)
      }))
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  readPersonalEvent (personalEventId, cb, errorCb) {
    const url = urlPersonalEvents + '/' + personalEventId
    let queries = {
      start: -1,
      end: -1
    }
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

  createPersonalEvent (params, cb, errorCb) {
    window.axios.post(urlPersonalEvents, params, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updatePersonalEvent (params, cb, errorCb) {
    const url = urlPersonalEvents + '/' + params.personalEventId
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

  deletePersonalEvent (personalEventId, cb, errorCb) {
    const url = urlPersonalEvents + '/' + personalEventId
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

  copyPersonalEvent (params, cb, errorCb) {
    const url = urlPersonalEvents + '/' + params.userId + '/copy'
    let queries = {
      start: -1,
      end: -1
    }
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

const exportVl = window.themeDisplay ? hasServer : hasClient
export default exportVl
