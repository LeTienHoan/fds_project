/**
 * Mocking client-server processing
 */

window._dictCollectionItems = [
  {
    'collectionCode': 'aaaa',
    'createDate': 1538384626000,
    'modifiedDate': 1538384626000,
    'collectionName': 'Test dictCollection',
    'collectionNameEN': '001d',
    'description': 'Test dictCollection'
  },
  {
    'collectionCode': '6101',
    'createDate': 1538387320000,
    'modifiedDate': 1538476093000,
    'collectionName': 'Test dictCollection2',
    'collectionNameEN': '001e',
    'description': 'Test dictCollection2'
  },
  {
    'collectionCode': '6201',
    'createDate': 1538476139000,
    'modifiedDate': 1538476139000,
    'collectionName': 'Test dictCollection2.1',
    'collectionNameEN': '001e.0001',
    'description': 'Test dictCollection2 _________ Test dictCollection2.1'
  },
  {
    'collectionCode': '6301',
    'createDate': 1538476507000,
    'modifiedDate': 1538476507000,
    'collectionName': 'Test dictCollection2.2',
    'collectionNameEN': '001e.0002',
    'description': 'Test dictCollection2 _________ Test dictCollection2.2'
  }
]

window._dictGroupItems = [
  {
    'groupCode': '6001',
    'createDate': 1538384626000,
    'modifiedDate': 1538384626000,
    'groupName': 'Test dictGroup',
    'groupNameEN': '001d',
    'groupDescription': 'Test dictGroup'
  },
  {
    'groupCode': '6101',
    'createDate': 1538387320000,
    'modifiedDate': 1538476093000,
    'groupName': 'Test dictGroup2',
    'groupNameEN': '001e',
    'groupDescription': 'Test dictGroup2'
  },
  {
    'groupCode': '6201',
    'createDate': 1538476139000,
    'modifiedDate': 1538476139000,
    'groupName': 'Test dictGroup2.1',
    'groupNameEN': '001e.0001',
    'groupDescription': 'Test dictGroup2 _________ Test dictGroup2.1'
  },
  {
    'groupCode': '6301',
    'createDate': 1538476507000,
    'modifiedDate': 1538476507000,
    'groupName': 'Test dictGroup2.2',
    'groupNameEN': '001e.0002',
    'groupDescription': 'Test dictGroup2 _________ Test dictGroup2.2'
  }
]

window._dictItemItems = [
  {
    'itemCode': '6001',
    'createDate': 1538384626000,
    'modifiedDate': 1538384626000,
    'itemName': 'Test dictItem',
    'accessible': true,
    'roleId': 0,
    'itemNameEN': '001d',
    'itemDescription': 'Test dictItem',
    'parentItem': {
      'itemCode': '6101',
      'createDate': 1538387320000,
      'modifiedDate': 1538476093000,
      'itemName': 'Test dictItem2'
    },
    'groups': {
      'groupCode': '6001',
      'createDate': 1538384626000,
      'modifiedDate': 1538384626000,
      'groupName': 'Test dictGroup'
    }
  },
  {
    'itemCode': '6101',
    'createDate': 1538387320000,
    'modifiedDate': 1538476093000,
    'itemName': 'Test dictItem2',
    'accessible': true,
    'roleId': 0,
    'itemNameEN': '001e',
    'groups': {
      'dictGroupId': 0
    },
    'itemDescription': 'Test dictItem2'
  },
  {
    'itemCode': '6201',
    'createDate': 1538476139000,
    'modifiedDate': 1538476139000,
    'itemName': 'Test dictItem2.1',
    'accessible': true,
    'roleId': 6101,
    'itemNameEN': '001e.0001',
    'itemDescription': 'Test dictItem2 _________ Test dictItem2.1'
  },
  {
    'itemCode': '6301',
    'createDate': 1538476507000,
    'modifiedDate': 1538476507000,
    'itemName': 'Test dictItem2.2',
    'accessible': true,
    'roleId': 6101,
    'itemNameEN': '001e.0002',
    'itemDescription': 'Test dictItem2 _________ Test dictItem2.2'
  }
]

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlDictCollections = endPoint + 'dictcollections'

const hasClient = {

  getDictCollections (query, cb, errorCb) {
    const result = {
      total: window._dictCollectionItems.length,
      data: window._dictCollectionItems
    }
    setTimeout(() => cb(result), 100)
  },

  readDictCollection (collectionCode, cb, errorCb) {
    setTimeout(() => cb(window._dictCollectionItems.find(item => item.collectionCode === collectionCode)), 100)
  },

  createDictCollection (params, cb, errorCb) {
    let result = {}
    for (let key in window._dictCollectionItems[0]) {
      if (key === 'collectionCode') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._dictCollectionItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  updateDictCollection (params, cb, errorCb) {
    let result = {}
    let selected = window._dictCollectionItems.find(item => item.collectionCode === params.collectionCode)
    if (selected.collectionCode) {
      Object.assign(result, selected, params)
    }
    setTimeout(() => cb(result), 100)
  },

  deleteDictCollection (collectionCode, cb, errorCb) {
    window._dictCollectionItems = window._dictCollectionItems.filter(item => item.collectionCode !== collectionCode)
    setTimeout(() => cb(window._dictCollectionItems.find(item => item.collectionCode === collectionCode)), 100)
  },

  postDictCollectionDataform (params, cb, errorCb) {
    const result = {
      total: window._dictCollectionItems.length,
      data: window._dictCollectionItems
    }
    setTimeout(() => cb(result), 100)
  },

  getDictCollectionDataform (collectionCode, cb, errorCb) {
    setTimeout(() => cb(window._dictCollectionItems.find(item => item.collectionCode === collectionCode)), 100)
  },

  // Dict group

  getDictGroups (query, cb, errorCb) {
    const result = {
      total: window._dictGroupItems.length,
      data: window._dictGroupItems
    }
    setTimeout(() => cb(result), 100)
  },

  readDictGroup (payload, cb, errorCb) {
    setTimeout(() => cb(window._dictGroupItems.find(item => item.groupCode === payload.groupCode)), 100)
  },

  createDictGroup (params, cb, errorCb) {
    let result = {}
    for (let key in window._dictGroupItems[0]) {
      if (key === 'groupCode') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._dictGroupItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  updateDictGroup (params, cb, errorCb) {
    let result = {}
    let selected = window._dictGroupItems.find(item => item.groupCode === params.groupCode)
    if (selected.groupCode) {
      Object.assign(result, selected, params)
    }
    setTimeout(() => cb(result), 100)
  },

  deleteDictGroup (payload, cb, errorCb) {
    window._dictGroupItems = window._dictGroupItems.filter(item => item.groupCode !== payload.groupCode)
    setTimeout(() => cb(window._dictGroupItems.find(item => item.groupCode === payload.groupCode)), 100)
  },

  getDictItemInDictGroups (query, cb, errorCb) {
    const result = {
      total: window._dictItemItems.length,
      data: window._dictItemItems
    }
    setTimeout(() => cb(result), 100)
  },

  createDictItemInDictGroup (params, cb, errorCb) {
    let result = {}
    for (let key in window._dictItemItems[0]) {
      if (key === 'groupCode') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._dictItemItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  deleteDictItemInDictGroup (payload, cb, errorCb) {
    setTimeout(() => cb(window._dictItemItems.find(item => item.groupCode === payload.groupCode)), 100)
  },

  // Dict item

  getDictItems (query, cb, errorCb) {
    const result = {
      total: window._dictItemItems.length,
      data: window._dictItemItems
    }
    setTimeout(() => cb(result), 100)
  },

  readDictItem (payload, cb, errorCb) {
    setTimeout(() => cb(window._dictItemItems.find(item => item.itemCode === payload.itemCode)), 100)
  },

  createDictItem (params, cb, errorCb) {
    let result = {}
    for (let key in window._dictItemItems[0]) {
      if (key === 'itemCode') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._dictItemItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  updateDictItem (params, cb, errorCb) {
    let result = {}
    let selected = window._dictItemItems.find(item => item.itemCode === params.itemCode)
    if (selected.itemCode) {
      Object.assign(result, selected, params)
    }
    setTimeout(() => cb(result), 100)
  },

  deleteDictItem (payload, cb, errorCb) {
    window._dictItemItems = window._dictItemItems.filter(item => item.itemCode !== payload.itemCode)
    setTimeout(() => cb(window._dictItemItems.find(item => item.itemCode === payload.itemCode)), 100)
  },

  getMetaDataInDictItems (query, cb, errorCb) {
    const result = {
      total: window._metaDataItems.length,
      data: window._metaDataItems
    }
    setTimeout(() => cb(result), 100)
  },

  createMetaDataInDictItem (params, cb, errorCb) {
    let result = {}
    for (let key in window._metaDataItems[0]) {
      if (key === 'groupCode') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._metaDataItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  getMetaDataInDictDictItemsByKey (query, cb, errorCb) {
    const result = {
      total: window._metaDataItems.length,
      data: window._metaDataItems
    }
    setTimeout(() => cb(result), 100)
  }

}

const hasServer = {

  getDictCollections (query, cb, errorCb) {
    // TODO: call api get dictCollections
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlDictCollections, {
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

  readDictCollection (collectionCode, cb, errorCb) {
    // TODO: call api get dictCollection by id

    const url = urlDictCollections + '/' + collectionCode
    window.axios.get(url)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  createDictCollection (params, cb, errorCb) {
    // TODO: call api create dictCollection

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsCreateDictCollection = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateDictCollection.append(key, params[key])
    }
    window.axios.post(urlDictCollections, urlParamsCreateDictCollection)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateDictCollection (params, cb, errorCb) {
    // TODO: call api create dictCollection

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateDictCollection = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateDictCollection.append(key, params[key])
    }
    const url = urlDictCollections + '/' + params.collectionCode
    window.axios.put(url, urlParamsUpdateDictCollection)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteDictCollection (collectionCode, cb, errorCb) {
    // TODO: call api create dictCollection

    const url = urlDictCollections + '/' + collectionCode
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

  postDictCollectionDataform (params, cb, errorCb) {
    // TODO: call api create dictCollection

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateDictCollection = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateDictCollection.append(key, params[key])
    }
    const url = urlDictCollections + '/' + params.collectionCode
    window.axios.put(url, urlParamsUpdateDictCollection)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getDictCollectionDataform (collectionCode, cb, errorCb) {
    // TODO: call api get /dictCollections/copy/{sourceId}/{targetId}

    window.axios.get(urlDictCollections + '/' + collectionCode + '/logo')
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  // Dict group

  getDictGroups (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    const url = urlDictCollections + '/' + query.collectionCode + '/dictgroups'
    window.axios.get(url, {
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

  readDictGroup (payload, cb, errorCb) {
    const url = urlDictCollections + '/' + payload.collectionCode + '/dictgroups/' + payload.groupCode
    window.axios.get(url)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  createDictGroup (params, cb, errorCb) {
    let urlParamsCreateDictGroup = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateDictGroup.append(key, params[key])
    }
    const url = urlDictCollections + '/' + params.collectionCode + '/dictgroups'
    window.axios.post(url, urlParamsCreateDictGroup)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateDictGroup (params, cb, errorCb) {
    let urlParamsUpdateDictCollection = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateDictCollection.append(key, params[key])
    }
    const url = urlDictCollections + '/' + params.collectionCode + '/dictgroups/' + params.groupCode
    window.axios.put(url, urlParamsUpdateDictCollection)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteDictGroup (payload, cb, errorCb) {
    const url = urlDictCollections + '/' + payload.collectionCode + '/dictgroups/' + payload.groupCode
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

  getDictItemInDictGroups (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    let url = urlDictCollections + '/' + query.collectionCode + '/dictgroups/' + query.groupCode + '/dictitems'
    window.axios.get(url, {
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

  createDictItemInDictGroup (params, cb, errorCb) {
    let urlParamsCreateDictItemInDictGroup = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateDictItemInDictGroup.append(key, params[key])
    }
    const url = urlDictCollections + '/' + params.collectionCode + '/dictgroups'
    window.axios.post(url, urlParamsCreateDictItemInDictGroup)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteDictItemInDictGroup (payload, cb, errorCb) {
    const url = urlDictCollections + '/' + payload.collectionCode + '/dictgroups/' + payload.groupCode + '/dictitems/' + payload.itemCode
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

  // Dict item

  getDictItems (query, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    const url = urlDictCollections + '/' + query.collectionCode + '/dictitems'
    window.axios.get(url, {
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

  readDictItem (payload, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlDictCollections + '/' + payload.collectionCode + '/dictitems/' + payload.itemCode
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

  createDictItem (params, cb, errorCb) {
    let urlParamsCreateDictItem = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateDictItem.append(key, params[key])
    }
    const url = urlDictCollections + '/' + params.collectionCode + '/dictitems'
    window.axios.post(url, urlParamsCreateDictItem)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateDictItem (params, cb, errorCb) {
    let urlParamsUpdateDictCollection = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateDictCollection.append(key, params[key])
    }
    const url = urlDictCollections + '/' + params.collectionCode + '/dictitems/' + params.itemCode
    window.axios.put(url, urlParamsUpdateDictCollection)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteDictItem (payload, cb, errorCb) {
    const url = urlDictCollections + '/' + payload.collectionCode + '/dictitems/' + payload.itemCode
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

  getMetaDataInDictItems (query, cb, errorCb) {
    const result = {
      total: window._metaDataItems.length,
      data: window._metaDataItems
    }
    setTimeout(() => cb(result), 100)
  },

  createMetaDataInDictItem (params, cb, errorCb) {
    let result = {}
    for (let key in window._metaDataItems[0]) {
      if (key === 'groupCode') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._metaDataItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  getMetaDataInDictDictItemsByKey (query, cb, errorCb) {
    const result = {
      total: window._metaDataItems.length,
      data: window._metaDataItems
    }
    setTimeout(() => cb(result), 100)
  }

}

const exportVl = window.themeDisplay ? hasServer : hasClient
export default exportVl
