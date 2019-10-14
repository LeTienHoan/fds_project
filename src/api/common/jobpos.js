/**
 * Mocking client-server processing
 */

window._jobposItems = [
  {
    'jobPosId': 6001,
    'createDate': 1538384626000,
    'modifiedDate': 1538384626000,
    'title': 'Test jobpos',
    'accessible': true,
    'roleId': 0,
    'code': '001d',
    'description': 'Test jobpos'
  },
  {
    'jobPosId': 6101,
    'createDate': 1538387320000,
    'modifiedDate': 1538476093000,
    'title': 'Test jobpos2',
    'accessible': true,
    'roleId': 0,
    'code': '001e',
    'description': 'Test jobpos2'
  },
  {
    'jobPosId': 6201,
    'createDate': 1538476139000,
    'modifiedDate': 1538476139000,
    'title': 'Test jobpos2.1',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0001',
    'description': 'Test jobpos2 _________ Test jobpos2.1'
  },
  {
    'jobPosId': 6301,
    'createDate': 1538476507000,
    'modifiedDate': 1538476507000,
    'title': 'Test jobpos2.2',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0002',
    'description': 'Test jobpos2 _________ Test jobpos2.2'
  },
  {
    'jobPosId': 6401,
    'createDate': 1538476988000,
    'modifiedDate': 1538476988000,
    'title': 'Test jobpos2.3',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0003',
    'description': 'Test jobpos2 _________ Test jobpos2.3'
  },
  {
    'jobPosId': 6402,
    'createDate': 1538477065000,
    'modifiedDate': 1538477065000,
    'title': 'Test ws2.4',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0004',
    'description': 'Test jobpos2 _________ Test ws2.4'
  },
  {
    'jobPosId': 6411,
    'createDate': 1538483707000,
    'modifiedDate': 1538483707000,
    'title': 'Test ws2.5',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0005',
    'description': 'Test jobpos2 _________ Test ws2.5'
  },
  {
    'jobPosId': 6501,
    'createDate': 1538484164000,
    'modifiedDate': 1538484164000,
    'title': 'Test ws2.6',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0006',
    'description': 'Test jobpos2 _________ Test ws2.6'
  },
  {
    'jobPosId': 6502,
    'createDate': 1538489135000,
    'modifiedDate': 1538489135000,
    'title': 'Test ws2.7',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0007',
    'description': 'Test jobpos2 _________ Test ws2.7'
  },
  {
    'jobPosId': 6503,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'title': 'Test ws2.8',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0008',
    'description': 'Test jobpos2 _________ Test ws2.8'
  },
  {
    'jobPosId': 7403,
    'createDate': 1541071582000,
    'modifiedDate': 1541071598000,
    'title': 'httrr',
    'accessible': true,
    'roleId': 0,
    'code': '0029',
    'description': 'httrr'
  }
]

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlJobposs = endPoint + 'jobpos'

const hasClient = {

  getJobposs (query, cb, errorCb) {
    const result = {
      total: window._jobposItems.length,
      data: window._jobposItems
    }
    setTimeout(() => cb(result), 100)
  },

  readJobpos (jobPosId, cb, errorCb) {
    setTimeout(() => cb(window._jobposItems.find(item => item.jobPosId === jobPosId)), 100)
  },

  createJobpos (params, cb, errorCb) {
    let result = {}
    for (let key in window._jobposItems[0]) {
      if (key === 'jobPosId') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._jobposItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  updateJobpos (params, cb, errorCb) {
    let result = {}
    let selected = window._jobposItems.find(item => item.jobPosId === params.jobPosId)
    if (selected.jobPosId) {
      Object.assign(result, selected, params)
    }
    setTimeout(() => cb(result), 100)
  },

  deleteJobpos (jobPosId, cb, errorCb) {
    window._jobposItems = window._jobposItems.filter(item => item.jobPosId !== jobPosId)
    setTimeout(() => cb(window._jobposItems.find(item => item.jobPosId === jobPosId)), 100)
  },

  putJobposLogo (params, cb, errorCb) {
    const result = {
      total: window._jobposItems.length,
      data: window._jobposItems
    }
    setTimeout(() => cb(result), 100)
  },

  getJobposLogo (jobPosId, cb, errorCb) {
    setTimeout(() => cb(window._jobposItems.find(item => item.jobPosId === jobPosId)), 100)
  }

}

const hasServer = {

  getJobposs (query, cb, errorCb) {
    // TODO: call api get jobposs
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlJobposs, {
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

  readJobpos (jobPosId, cb, errorCb) {
    // TODO: call api get jobpos by id
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlJobposs + '/' + jobPosId
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

  createJobpos (params, cb, errorCb) {
    // TODO: call api create jobpos

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsCreateJobpos = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateJobpos.append(key, params[key])
    }
    window.axios.post(urlJobposs, urlParamsCreateJobpos)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateJobpos (params, cb, errorCb) {
    // TODO: call api create jobpos

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateJobpos = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateJobpos.append(key, params[key])
    }
    const url = urlJobposs + '/' + params.jobPosId
    window.axios.put(url, urlParamsUpdateJobpos)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteJobpos (jobPosId, cb, errorCb) {
    // TODO: call api create jobpos

    const url = urlJobposs + '/' + jobPosId
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

  putJobposLogo (params, cb, errorCb) {
    // TODO: call api create jobpos

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateJobpos = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateJobpos.append(key, params[key])
    }
    const url = urlJobposs + '/' + params.jobPosId
    window.axios.put(url, urlParamsUpdateJobpos)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getJobposLogo (jobPosId, cb, errorCb) {
    // TODO: call api get /jobposs/copy/{sourceId}/{targetId}
    let queries = {
      start: -1,
      end: -1
    }
    window.axios.get(urlJobposs + '/' + jobPosId + '/logo', {params: queries})
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
