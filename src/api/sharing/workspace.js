/**
 * Mocking client-server processing
 */

window._workspaceItems = [
  {
    'workspaceId': 6001,
    'createDate': 1538384626000,
    'modifiedDate': 1538384626000,
    'name': 'Test workspace',
    'accessible': true,
    'parentId': 0,
    'treeIndex': '001d',
    'level': 0,
    'editable': false,
    'workspaceNamePath': 'Test workspace',
    'scope': 'TASK',
    'description': '123',
    'permission': 'read'
  },
  {
    'workspaceId': 6101,
    'createDate': 1538387320000,
    'modifiedDate': 1538476093000,
    'name': 'Test workspace2',
    'accessible': true,
    'parentId': 0,
    'treeIndex': '001e',
    'level': 0,
    'editable': false,
    'workspaceNamePath': 'Test workspace2',
    'scope': 'TASK',
    'description': '',
    'permission': 'write'
  },
  {
    'workspaceId': 6201,
    'createDate': 1538476139000,
    'modifiedDate': 1538476139000,
    'name': 'Test workspace2.1',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0001',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test workspace2.1',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 6301,
    'createDate': 1538476507000,
    'modifiedDate': 1538476507000,
    'name': 'Test workspace2.2',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0002',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test workspace2.2',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 6401,
    'createDate': 1538476988000,
    'modifiedDate': 1538476988000,
    'name': 'Test workspace2.3',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0003',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test workspace2.3',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 64011,
    'createDate': 1538476988000,
    'modifiedDate': 1538476988000,
    'name': 'Test workspace2.3.1',
    'accessible': true,
    'parentId': 6401,
    'treeIndex': '001e.0003',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test workspace2.3',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 64012,
    'createDate': 1538476988000,
    'modifiedDate': 1538476988000,
    'name': 'Test workspace2.3.2',
    'accessible': true,
    'parentId': 6401,
    'treeIndex': '001e.0003',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test workspace2.3',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 6402,
    'createDate': 1538477065000,
    'modifiedDate': 1538477065000,
    'name': 'Test ws2.4',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0004',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test ws2.4',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 6411,
    'createDate': 1538483707000,
    'modifiedDate': 1538483707000,
    'name': 'Test ws2.5',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0005',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test ws2.5',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 6501,
    'createDate': 1538484164000,
    'modifiedDate': 1538484164000,
    'name': 'Test ws2.6',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0006',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test ws2.6',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 6502,
    'createDate': 1538489135000,
    'modifiedDate': 1538489135000,
    'name': 'Test ws2.7',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0007',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test ws2.7',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 6503,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'name': 'Test ws2.8',
    'accessible': true,
    'parentId': 6101,
    'treeIndex': '001e.0008',
    'level': 1,
    'editable': true,
    'workspaceNamePath': 'Test workspace2 _________ Test ws2.8',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  },
  {
    'workspaceId': 7403,
    'createDate': 1541071582000,
    'modifiedDate': 1541071598000,
    'name': 'httrr',
    'accessible': true,
    'parentId': 0,
    'treeIndex': '0029',
    'level': 0,
    'editable': true,
    'workspaceNamePath': 'httrr',
    'scope': 'TASK',
    'description': '',
    'permission': 'owner'
  }
]

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlWorkspaces = endPoint + 'workspaces'

const hasClient = {

  getWorkspaces (query, cb, errorCb) {
    const result = {
      total: window._workspaceItems.length,
      data: window._workspaceItems
    }
    setTimeout(() => cb(result), 100)
  },

  readWorkspace (workspaceId, cb, errorCb) {
    setTimeout(() => cb(window._workspaceItems.find(item => item.workspaceId === workspaceId)), 100)
  },

  createWorkspace (params, cb, errorCb) {
    let result = {}
    for (let key in window._workspaceItems[0]) {
      if (key === 'workspaceId') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._workspaceItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  updateWorkspace (params, cb, errorCb) {
    let result = {}
    let selected = window._workspaceItems.find(item => item.workspaceId === params.workspaceId)
    if (selected.workspaceId) {
      Object.assign(result, selected, params)
    }
    setTimeout(() => cb(result), 100)
  },

  deleteWorkspace (workspaceId, cb, errorCb) {
    window._workspaceItems = window._workspaceItems.filter(item => item.workspaceId !== workspaceId)
    setTimeout(() => cb(window._workspaceItems.find(item => item.workspaceId === workspaceId)), 100)
  },

  getWorkspacesCopy (sourceId, targetId, cb, errorCb) {
    const result = {
      total: window._workspaceItems.length,
      data: window._workspaceItems
    }
    setTimeout(() => cb(result), 100)
  }

}

const hasServer = {

  getWorkspaces (query, cb, errorCb) {
    // TODO: call api get workspaces
    let queries = {
      start: -1,
      end: -1,
      sort: 'name_String'
    }
    Object.assign(queries, query)
    window.axios.get(urlWorkspaces + '/scope/' + query.scope, {
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

  readWorkspace (workspaceId, cb, errorCb) {
    // TODO: call api get workspace by id

    const url = urlWorkspaces + '/' + workspaceId
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

  createWorkspace (params, cb, errorCb) {
    // TODO: call api create workspace

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsCreateWorkspace = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateWorkspace.append(key, params[key])
    }
    window.axios.post(urlWorkspaces + '/' + params.scope, urlParamsCreateWorkspace)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateWorkspace (params, cb, errorCb) {
    // TODO: call api create workspace

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateWorkspace = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateWorkspace.append(key, params[key])
    }
    const url = urlWorkspaces + '/' + params.workspaceId
    window.axios.put(url, urlParamsUpdateWorkspace)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteWorkspace (workspaceId, cb, errorCb) {
    // TODO: call api create workspace

    const url = urlWorkspaces + '/' + workspaceId
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

  getWorkspacesCopy (sourceId, targetId, cb, errorCb) {
    // TODO: call api get /workspaces/copy/{sourceId}/{targetId}
    let queries = {
      start: -1,
      end: -1
    }
    window.axios.get(urlWorkspaces + '/copy/' + sourceId + '/' + targetId, {params: queries})
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
