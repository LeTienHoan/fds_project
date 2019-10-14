/**
 * Mocking client-server processing
 */
window.mapStatisticApiToExpertedData = function (item, keyName) {
  let remainingCount = item.remainingCount || 0
  let newCount = item.newCount || 0
  // let overdueCount = item.overdueCount || 0
  // let ontimeCount = item.ontimeCount || 0
  // let overtimeCount = item.overtimeCount || 0
  // let undueCount = item.undueCount || 0
  let finishOntimeCount = item.finishOntimeCount || 0
  let finishOvertimeCount = item.finishOvertimeCount || 0
  let unfulfilledOvertimeCount = item.unfulfilledOvertimeCount || 0
  let unfulfilledOntimeCount = item.unfulfilledOntimeCount || 0
  let processingOntimeCount = item.processingOntimeCount || 0
  let processingOvertimeCount = item.processingOvertimeCount || 0
  let okrArchive = item.okrArchive || 0
  item[keyName] = item.name || item.userName || item.workingUnitName
  item['tong_so'] = remainingCount + newCount // total = remainingCount + newCount
  item['tao_moi'] = newCount
  item['ton_truoc'] = remainingCount
  item['chua_thuc_hien'] = unfulfilledOvertimeCount + unfulfilledOntimeCount
  item['dang_thuc_hien_tong_so'] = processingOntimeCount + processingOvertimeCount
  item['dang_thuc_hien_con_han'] = processingOntimeCount
  item['dang_thuc_hien_tre_han'] = processingOvertimeCount
  item['da_hoan_thanh_tong_so'] = finishOntimeCount + finishOvertimeCount
  item['da_hoan_thanh_dung_han'] = finishOntimeCount
  item['da_hoan_thanh_qua_han'] = finishOvertimeCount
  item['da_hoan_thanh_diem_danh_gia_tb'] = okrArchive
  item['da_hoan_thanh_ty_le_qua_han'] = Math.round(100 * finishOvertimeCount / ((finishOntimeCount + finishOvertimeCount) || 1)) + '%'
  return item
}
window._activityStatisticItems = [
  {
    name: 'Dummy',
    remainingCount: 3, // ky truoc chuyen qua
    newCount: 4, // so moi tao trong ky
    overdueCount: 5, // chua hoan thanh qua han
    ontimeCount: 6, // da hoan thanh dung han
    overtimeCount: 7, // da hoan thanh qua han
    undueCount: 8, // chua hoan thanh con han
    finishOntimeCount: 9, // hoan thanh dung han
    finishOvertimeCount: 10, // hoan thanh qua han
    unfulfilledOvertimeCount: 11, // chua xu ly qua han
    unfulfilledOntimeCount: 12, // chua xu ly con han
    processingOntimeCount: 13, // dang xu ly con han
    processingOvertimeCount: 14, // dang xu ly qua han
    okrArchive: 15
  },
  {
    name: 'Dummy 222',
    remainingCount: 3, // ky truoc chuyen qua
    newCount: 4, // so moi tao trong ky
    overdueCount: 5, // chua hoan thanh qua han
    ontimeCount: 6, // da hoan thanh dung han
    overtimeCount: 7, // da hoan thanh qua han
    undueCount: 8, // chua hoan thanh con han
    finishOntimeCount: 9, // hoan thanh dung han
    finishOvertimeCount: 10, // hoan thanh qua han
    unfulfilledOvertimeCount: 11, // chua xu ly qua han
    unfulfilledOntimeCount: 12, // chua xu ly con han
    processingOntimeCount: 13, // dang xu ly con han
    processingOvertimeCount: 14, // dang xu ly qua han
    okrArchive: 15
  },
  {
    name: 'Dummy 333',
    remainingCount: 3, // ky truoc chuyen qua
    newCount: 4, // so moi tao trong ky
    overdueCount: 5, // chua hoan thanh qua han
    ontimeCount: 6, // da hoan thanh dung han
    overtimeCount: 7, // da hoan thanh qua han
    undueCount: 8, // chua hoan thanh con han
    finishOntimeCount: 9, // hoan thanh dung han
    finishOvertimeCount: 10, // hoan thanh qua han
    unfulfilledOvertimeCount: 11, // chua xu ly qua han
    unfulfilledOntimeCount: 12, // chua xu ly con han
    processingOntimeCount: 13, // dang xu ly con han
    processingOvertimeCount: 14, // dang xu ly qua han
    okrArchive: 15
  }
]
window._activityStatisticLogItems = [
  {
    activityId: 1,
    subject: 'Ten cong viec 1',
    startDate: 1547626156959,
    endDate: 1547626156959,
    leaderName: 'Nguyen Van A',
    managerName: 'Nguyen Van B'
  },
  {
    activityId: 2,
    subject: 'Ten cong viec 1',
    startDate: 1547626156959,
    endDate: 1547626156959,
    leaderName: 'Nguyen Van A',
    managerName: 'Nguyen Van B'
  },
  {
    activityId: 3,
    subject: 'Ten cong viec 1',
    startDate: 1547626156959,
    endDate: 1547626156959,
    leaderName: 'Nguyen Van A',
    managerName: 'Nguyen Van B'
  }, {
    activityId: 4,
    subject: 'Ten cong viec 1',
    startDate: 1547626156959,
    endDate: 1547626156959,
    leaderName: 'Nguyen Van A',
    managerName: 'Nguyen Van B'
  },
  {
    activityId: 5,
    subject: 'Ten cong viec 1',
    startDate: 1547626156959,
    endDate: 1547626156959,
    leaderName: 'Nguyen Van A',
    managerName: 'Nguyen Van B'
  },
  {
    activityId: 6,
    subject: 'Ten cong viec 1',
    startDate: 1547626156959,
    endDate: 1547626156959,
    leaderName: 'Nguyen Van A',
    managerName: 'Nguyen Van B'
  }
]
window._activityStatisticWorkingUnitItems = [
  {
    'workingUnitId': 0,
    'workingUnitName': 'GPCP 6',
    'hosting': {
      'totalCount': 0,
      'ontimeCount': 0,
      'overtimeCount': 0
    },
    'inviting': {
      'totalCount': 0,
      'ontimeCount': 0,
      'overtimeCount': 0
    }
  }
]
window._activityStatisticUserItems = [
  {
    'userId': 0,
    'userName': 'Tran Hoa 1',
    'leading': {
      'totalCount': 0,
      'ontimeCount': 0,
      'overtimeCount': 0
    },
    'managing': {
      'totalCount': 0,
      'ontimeCount': 0,
      'overtimeCount': 0
    }
  }
]

function arrLastToTop (arrayData) {
  if (arrayData.length) {
    const last = arrayData[arrayData.length - 1]
    arrayData.pop()
    arrayData.unshift(last)
    return arrayData
  } else {
    return []
  }
}

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlActivityStatistics = endPoint + 'activities/statistics'
const urlActivityStatisticsWorkingUnits = endPoint + '/activities/statistics/dashboard/workingunits'
const urlActivityStatisticsUsers = endPoint + '/activities/statistics/dashboard/users'

const hasClient = {

  getActivityStatistics (query, cb, errorCb, keyName) {
    const result = {
      total: Math.floor(Math.random() * 100) + 1,
      data: window._activityStatisticItems
    }
    if (keyName) {
      const dt = result.data.map(item => {
        return window.mapStatisticApiToExpertedData(item, keyName)
      })
      result.data = dt
      setTimeout(() => cb(result), 100)
    } else {
      setTimeout(() => cb(result), 100)
    }
  },

  getActivityStatisticsLogs (query, cb, errorCb, keyName) {
    let queries = {
      start: -1,
      end: -1,
      activityType: 'TASK',
      statistics: 'all'
    }
    Object.assign(queries, query)
    const result = {
      total: Math.floor(Math.random() * 100) + 1,
      data: window._activityStatisticLogItems
    }
    setTimeout(() => cb(result), 100)
  },

  getActivityStatisticsWorkingUnits (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1,
      activityType: 'TASK',
      statisticType: 2,
      statistics: 'all'
    }
    Object.assign(queries, query)
    hasClient.getActivityStatistics(queries, cb, errorCb, 'workingUnitName')
  },

  getActivityStatisticsUsers (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1,
      activityType: 'TASK',
      statisticType: 1,
      statistics: 'all'
    }
    Object.assign(queries, query)
    hasClient.getActivityStatistics(queries, cb, errorCb, 'userName')
  },

  _deprecated_getActivityStatisticsWorkingUnits (query, cb, errorCb) {
    const result = {
      total: Math.floor(Math.random() * 100) + 1,
      data: window._activityStatisticWorkingUnitItems
    }
    setTimeout(() => cb(result), 100)
  },

  _deprecated_getActivityStatisticsUsers (query, cb, errorCb) {
    const result = {
      total: Math.floor(Math.random() * 100) + 1,
      data: window._activityStatisticUserItems
    }
    setTimeout(() => cb(result), 100)
  }

}

const hasServer = {

  getActivityStatistics (query, cb, errorCb, keyName) {
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlActivityStatistics, {
      params: queries
    })
      .then(function (response) {
        const serializable = response.data
        const result = {
          total: serializable.total,
          data: arrLastToTop(serializable.data || [])
        }
        if (keyName) {
          const dt = result.data.map(item => {
            return window.mapStatisticApiToExpertedData(item, keyName)
          })
          result.data = dt
          cb(result)
        } else {
          cb(result)
        }
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getActivityStatisticsLogs (query, cb, errorCb, keyName) {
    let queries = {
      start: -1,
      end: -1,
      activityType: 'TASK',
      statistics: 'all'
    }
    Object.assign(queries, query)
    window.axios.get(urlActivityStatistics + '/logs', {
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

  getActivityStatisticsWorkingUnits (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1,
      activityType: 'TASK',
      statisticType: 2
    }
    Object.assign(queries, query)
    hasServer.getActivityStatistics(queries, cb, errorCb, 'workingUnitName')
  },

  getActivityStatisticsUsers (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1,
      activityType: 'TASK',
      statisticType: 1
    }
    Object.assign(queries, query)
    hasServer.getActivityStatistics(queries, cb, errorCb, 'userName')
  },

  _deprecated_getActivityStatisticsWorkingUnits (query, cb, errorCb) {
    window.axios.get(urlActivityStatisticsWorkingUnits, {
      params: query
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

  _deprecated_getActivityStatisticsUsers (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlActivityStatisticsUsers, {
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
  }

}

const exportVl = window.themeDisplay ? hasServer : hasClient

export default exportVl
