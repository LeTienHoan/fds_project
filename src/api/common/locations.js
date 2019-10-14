/**
 * Mocking client-server processing
 */

window._locationItems = [
  {
    'locationId': 1,
    'userId': 1,
    'userName': 'ThanhNV',
    'createDate': 1541056244941,
    'modifiedDate': 1541056244941,
    'location': 'Quan uy HN',
    'geolocation': '2222 1111'
  },
  {
    'locationId': 3,
    'userId': 2,
    'userName': '',
    'createDate': 1541056244941,
    'modifiedDate': 1541056244941,
    'location': 'BLOG',
    'geolocation': ''
  },
  {
    'locationId': 4,
    'userId': 2,
    'userName': '',
    'createDate': 1541056244941,
    'modifiedDate': 1541056244941,
    'location': 'NOTIFICATION',
    'geolocation': ''
  },
  {
    'locationId': 2,
    'userId': 2,
    'userName': 'HO',
    'createDate': 1541056244941,
    'modifiedDate': 1541056244941,
    'location': 'QNA',
    'geolocation': '2222 444333'
  }
]

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://192.168.10.89:8080/api/'
const urlLocations = endPoint + 'locations'

const hasClient = {

  getLocations (query, cb, errorCb) {
    const result = {
      total: window._locationItems.length,
      data: window._locationItems
    }
    setTimeout(() => cb(result), 100)
  },

  readLocation (locationId, cb, errorCb) {
    setTimeout(() => cb(window._locationItems.find(item => Number(item.locationId) === Number(locationId))), 100)
  },

  createLocation (params, cb, errorCb) {
    console.log(params)
    let result = {}
    for (let key in window._locationItems[0]) {
      if (key === 'locationId') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._locationItems[0][key]
      }
    }
    // error window._locationItems.push(result)
    setTimeout(() => cb(result), 100)
  },

  updateLocation (params, cb, errorCb) {
    let updated = window._locationItems.find(item => item.locationId === params.locationId)
    let result = {}
    Object.assign(result, updated, params)
    // error let index = window._locationItems.findIndex(item => item.locationId === params.locationId)
    // error window._locationItems[index] = result
    setTimeout(() => cb(result), 100)
  },

  deleteLocation (locationId, cb, errorCb) {
    window._locationItems = window._locationItems.filter(item => item.locationId !== locationId)
    setTimeout(() => cb(window._locationItems.find(item => item.locationId === locationId)), 100)
  }

}
const hasServer = {

  getLocations (query, cb, errorCb) {
    let url = urlLocations
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: queries
    })
      .then(function (response) {
        const serializable = response.data
        let result = {
          total: serializable.total,
          data: [...serializable.data || []]
        }
        if (!serializable.data) {
          result.data = []
        } else if (serializable.data.length) {
          result.data = serializable.data
        } else {
          result.data = [serializable.data]
        }
        cb(result)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  readLocation (locationId, cb, errorCb) {
    const url = urlLocations + '/' + locationId
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

  createLocation (params, cb, errorCb) {
    let urlParams = new URLSearchParams()
    for (let key in params) {
      urlParams.append(key, params[key])
    }
    window.axios.post(urlLocations, urlParams, {
      headers: {
        'Accept': 'application/json'
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

  updateLocation (params, cb, errorCb) {
    let urlSearchParams = new URLSearchParams()
    for (const key in params) {
      urlSearchParams.append(key, params[key])
    }
    const url = urlLocations + '/' + params.locationId
    window.axios.put(url, urlSearchParams)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteLocation (locationId, cb, errorCb) {
    const url = urlLocations + '/' + locationId
    window.axios.delete(url)
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
