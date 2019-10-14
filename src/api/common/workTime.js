/**
 * Mocking client-server processing
 */
/**
const _workTimeItems = [
  { 'day': 1, 'day': 1, 'hours': '08.00-12.00,13.30-18.00' },
  { 'day': 2, 'day': 2, 'hours': '08.00-12.00,13.30-18.00' },
  { 'day': 3, 'day': 0, 'hours': '08.00-12.00,13.30-18.00' }
]
 */
const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlWorkTimes = endPoint + 'worktimes'

export default {

  getWorkTimes (query, cb, errorCb) {
    /**
    const result = {
      total: _workTimeItems.length,
      data: _workTimeItems
    }
    setTimeout(() => cb(result), 100)
     */
    // TODO: call api get workTimes
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlWorkTimes, {
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

  readWorkTime (day, cb, errorCb) {
    // setTimeout(() => cb(_workTimeItems.find(item => item.day === day)), 100)
    // TODO: call api get workTime by id
    /**  */
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlWorkTimes + '/' + day
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

  createWorkTime (params, cb, errorCb) {
    // setTimeout(() => cb(_workTimeItems[0]), 100)
    // TODO: call api create workTime

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsCreateWorkTime = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateWorkTime.append(key, params[key])
    }
    window.axios.post(urlWorkTimes, urlParamsCreateWorkTime)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateWorkTime (params, cb, errorCb) {
    // setTimeout(() => cb(_workTimeItems[0]), 100)
    // TODO: call api create workTime

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateWorkTime = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateWorkTime.append(key, params[key])
    }
    const url = urlWorkTimes + '/' + params.day
    window.axios.put(url, urlParamsUpdateWorkTime)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteWorkTime (day, cb, errorCb) {
    // setTimeout(() => cb(_workTimeItems), 100)
    // TODO: call api create workTime

    const url = urlWorkTimes + '/' + day
    window.axios.delete(url, url)
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
