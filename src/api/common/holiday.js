/**
 * Mocking client-server processing
 */
/**
const _holidayItems = [
  { 'day': 1, 'day': 1, 'hours': '08.00-12.00,13.30-18.00' },
  { 'day': 2, 'day': 2, 'hours': '08.00-12.00,13.30-18.00' },
  { 'day': 3, 'day': 0, 'hours': '08.00-12.00,13.30-18.00' }
]
 */
const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlHolidays = endPoint + 'holidays'

export default {

  getHolidays (query, cb, errorCb) {
    /**
    const result = {
      total: _holidayItems.length,
      data: _holidayItems
    }
    setTimeout(() => cb(result), 100)
     */
    // TODO: call api get holidays
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlHolidays, {
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

  readHoliday (holidayDate, cb, errorCb) {
    // setTimeout(() => cb(_holidayItems.find(item => item.holidayDate === day)), 100)
    // TODO: call api get holiday by id
    /**  */
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlHolidays + '/' + holidayDate
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

  createHoliday (params, cb, errorCb) {
    // setTimeout(() => cb(_holidayItems[0]), 100)
    // TODO: call api create holiday

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsCreateHoliday = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateHoliday.append(key, params[key])
    }
    window.axios.post(urlHolidays, urlParamsCreateHoliday)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateHoliday (params, cb, errorCb) {
    // setTimeout(() => cb(_holidayItems[0]), 100)
    // TODO: call api create holiday

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateHoliday = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateHoliday.append(key, params[key])
    }
    const url = urlHolidays + '/' + params.holidayDate
    window.axios.put(url, urlParamsUpdateHoliday)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteHoliday (holidayDate, cb, errorCb) {
    // setTimeout(() => cb(_holidayItems), 100)
    // TODO: call api create holiday

    const url = urlHolidays + '/' + holidayDate
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
