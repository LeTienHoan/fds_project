/**
 * Mocking client-server processing
 */

window._workingUnitItems = [
  {
    'workingUnitId': 6001,
    'createDate': 1538384626000,
    'modifiedDate': 1538384626000,
    'name': 'Test workingUnit 1',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': '',
    'address': 'Ha Noi 1',
    'email': 'workinguni@gmail.com 1',
    'enName': 'workingunit a 1',
    'faxNo': '4011512 1',
    'govAgencyCode': 'WorkingUnit B 1 1',
    'leaderId': 11111,
    'leaderName': 'Nguyen van A 1',
    'roleId': 11111111111,
    'sibling': '111 1',
    'telNo': '09782665241',
    'website': 'http://dev.mobilink.vn1'
  },
  {
    'workingUnitId': 6101,
    'createDate': 1538387320000,
    'modifiedDate': 1538476093000,
    'name': 'Test workingUnit2',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': '',
    'address': 'Ha Noi 2',
    'email': 'workinguni@gmail.com1',
    'enName': 'workingunit a2',
    'faxNo': '40115122',
    'govAgencyCode': 'WorkingUnit B2',
    'leaderId': 11112,
    'leaderName': 'Nguyen van A2',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 6201,
    'createDate': 1538476139000,
    'modifiedDate': 1538476139000,
    'name': 'Test workingUnit2.1',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1538384626000,
    'address': 'Ha Noi 23',
    'email': 'workinguni@gmail.com3',
    'enName': 'workingunit a3',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B3',
    'leaderId': 11113,
    'leaderName': 'Nguyen van A3',
    'roleId': 11111111111,
    'sibling': '1113',
    'telNo': '0978266523',
    'website': 'http://dev.mobilink.vn3'
  },
  {
    'workingUnitId': 6301,
    'createDate': 1538476507000,
    'modifiedDate': 1538476507000,
    'name': 'Test workingUnit2.2',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 4',
    'email': 'workinguni@gmail.com4',
    'enName': 'workingunit a4',
    'faxNo': '40115124',
    'govAgencyCode': 'WorkingUnit B4',
    'leaderId': 11114,
    'leaderName': 'Nguyen van A4',
    'roleId': 11111111111,
    'sibling': '1114',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn4'
  },
  {
    'workingUnitId': 6401,
    'createDate': 1538476988000,
    'modifiedDate': 1538476988000,
    'name': 'Test workingUnit2.3',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 5',
    'email': 'workinguni@gmail.com5',
    'enName': 'workingunit a5',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B5',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A5',
    'roleId': 11111111111,
    'sibling': '1115',
    'telNo': '0978266525',
    'website': 'http://dev.mobilink.vn5'
  },
  {
    'workingUnitId': 6402,
    'createDate': 1538477065000,
    'modifiedDate': 1538477065000,
    'name': 'Test ws2.4',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 6411,
    'createDate': 1538483707000,
    'modifiedDate': 1538483707000,
    'name': 'Test ws2.5',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 6501,
    'createDate': 1538484164000,
    'modifiedDate': 1538484164000,
    'name': 'Test ws2.6',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 6502,
    'createDate': 1538489135000,
    'modifiedDate': 1538489135000,
    'name': 'Test ws2.7',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 6503,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 6101,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 7403,
    'createDate': 1541071582000,
    'modifiedDate': 1541071598000,
    'name': 'httrr',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65041,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B11',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65042,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B12',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65043,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a12',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B14',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65044,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a14',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B16',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65045,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B17',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65046,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B18',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65047,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B19',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65048,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B20',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65049,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B21',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 650410,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B22',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 650411,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B23',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 650412,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B24',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 650413,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B26',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 650414,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B27',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 650415,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B28',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65031,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B29',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  },
  {
    'workingUnitId': 65032,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'parentWorkingUnitId': 0,
    'treeIndex': '001d',
    'level': 0,
    'permission': 'write',
    'ceremonyDate': 1543991834953,
    'address': 'hanoi 2',
    'email': 'workinguni@gmail.com',
    'enName': 'workingunit a',
    'faxNo': '4011512',
    'govAgencyCode': 'WorkingUnit B30',
    'leaderId': 1111,
    'leaderName': 'Nguyen van A',
    'roleId': 11111111111,
    'sibling': '111',
    'telNo': '0978266524',
    'website': 'http://dev.mobilink.vn'
  }
]

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlWorkingUnits = endPoint + 'workingunits'

const hasClient = {

  getWorkingUnits (query, cb, errorCb) {
    const result = {
      total: window._workingUnitItems.length,
      data: window._workingUnitItems
    }
    setTimeout(() => cb(result), 100)
  },

  readWorkingUnit (workingUnitId, cb, errorCb) {
    setTimeout(() => cb(window._workingUnitItems.find(item => item.workingUnitId === workingUnitId)), 100)
  },

  createWorkingUnit (params, cb, errorCb) {
    let result = {}
    for (let key in window._workingUnitItems[0]) {
      if (key === 'workingUnitId') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._workingUnitItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  updateWorkingUnit (params, cb, errorCb) {
    let result = {}
    let selected = window._workingUnitItems.find(item => item.workingUnitId === params.workingUnitId)
    if (selected.workingUnitId) {
      Object.assign(result, selected, params)
    }
    setTimeout(() => cb(result), 100)
  },

  deleteWorkingUnit (workingUnitId, cb, errorCb) {
    window._workingUnitItems = window._workingUnitItems.filter(item => item.workingUnitId !== workingUnitId)
    setTimeout(() => cb(window._workingUnitItems.find(item => item.workingUnitId === workingUnitId)), 100)
  },

  putWorkingUnitLogo (params, cb, errorCb) {
    const result = {
      total: window._workingUnitItems.length,
      data: window._workingUnitItems
    }
    setTimeout(() => cb(result), 100)
  },

  getWorkingUnitLogo (workingUnitId, cb, errorCb) {
    setTimeout(() => cb(window._workingUnitItems.find(item => item.workingUnitId === workingUnitId)), 100)
  }

}

const hasServer = {

  getWorkingUnits (query, cb, errorCb) {
    // TODO: call api get workingUnits
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlWorkingUnits, {
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

  readWorkingUnit (workingUnitId, cb, errorCb) {
    // TODO: call api get workingUnit by id
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlWorkingUnits + '/' + workingUnitId
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

  createWorkingUnit (params, cb, errorCb) {
    // TODO: call api create workingUnit

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsCreateWorkingUnit = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateWorkingUnit.append(key, params[key])
    }
    window.axios.post(urlWorkingUnits, urlParamsCreateWorkingUnit)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateWorkingUnit (params, cb, errorCb) {
    // TODO: call api create workingUnit

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateWorkingUnit = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateWorkingUnit.append(key, params[key])
    }
    const url = urlWorkingUnits + '/' + params.workingUnitId
    window.axios.put(url, urlParamsUpdateWorkingUnit)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteWorkingUnit (workingUnitId, cb, errorCb) {
    // TODO: call api create workingUnit

    const url = urlWorkingUnits + '/' + workingUnitId
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

  putWorkingUnitLogo (params, cb, errorCb) {
    // TODO: call api create workingUnit

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateWorkingUnit = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateWorkingUnit.append(key, params[key])
    }
    const url = urlWorkingUnits + '/' + params.workingUnitId
    window.axios.put(url, urlParamsUpdateWorkingUnit)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getWorkingUnitLogo (workingUnitId, cb, errorCb) {
    // TODO: call api get /workingUnits/copy/{sourceId}/{targetId}
    let queries = {
      start: -1,
      end: -1
    }
    window.axios.get(urlWorkingUnits + '/' + workingUnitId + '/logo', {params: queries})
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
