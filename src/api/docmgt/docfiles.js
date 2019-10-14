/**
 * Mocking client-server processing
 */

window._docFileItems = [
  {
    'docFileId': 1,
    'userId': 1,
    'userName': 'thanhnv',
    'createDate': 1541056244941,
    'modifiedDate': 1541056244941,
    'issuerCode': '',
    'issuerName': '',
    'codeNo': '112',
    'codeNotation': 'KH-BT',
    'fullCode': '',
    'promulgationDate': 1541056244941,
    'signerInfo': '',
    'documentType': '',
    'documentCat': '',
    'categoryName': 'VBHC',
    'subject': 'Van ban pc',
    'templateNo': '',
    'content': '',
    'secutype': 0,
    'priority': 0,
    'pageAmount': 0,
    'language': '',
    'register': 0,
    'registerDate': 1541056244941,
    'seqNum': 0,
    'permission': 'owner',
    'dueDate': 1541056244941,
    'editable': 0,
    'state': 0,
    'stateName': 0,
    'hostingId': 0,
    'hostingName': '',
    'managerId': 0,
    'managerName': '',
    'leaderId': 0,
    'leaderName': '',
    'leaderNote': '',
    'eform': '',
    'overdue': 0,
    'visited': false,
    'workspaces': {
      'workspaceId': 0
    }
  },
  {
    'docFileId': 2,
    'userId': 1,
    'userName': 'thanhnv',
    'createDate': 1541056244941,
    'modifiedDate': 1541056244941,
    'issuerCode': '',
    'issuerName': '',
    'codeNo': '112',
    'codeNotation': 'KH-BT',
    'fullCode': '',
    'promulgationDate': 1541056244941,
    'signerInfo': '',
    'documentType': '',
    'documentCat': '',
    'categoryName': 'VBHC',
    'subject': 'Van ban pc',
    'templateNo': '',
    'content': '',
    'secutype': 0,
    'priority': 0,
    'pageAmount': 0,
    'language': '',
    'register': 0,
    'registerDate': 1541056244941,
    'seqNum': 0,
    'permission': 'owner',
    'dueDate': 1541056244941,
    'editable': 0,
    'state': 0,
    'stateName': 0,
    'hostingId': 0,
    'hostingName': '',
    'managerId': 0,
    'managerName': '',
    'leaderId': 0,
    'leaderName': '',
    'leaderNote': '',
    'eform': '',
    'overdue': 0,
    'visited': false,
    'workspaces': [
      {
        'workspaceId': 1,
        'name': 'n2',
        'permanent': false
      }
    ]
  },
  {
    'docFileId': 3,
    'userId': 1,
    'userName': 'thanhnv',
    'createDate': 1541056244941,
    'modifiedDate': 1541056244941,
    'issuerCode': '',
    'issuerName': '',
    'codeNo': '112',
    'codeNotation': 'KH-BT',
    'fullCode': '',
    'promulgationDate': 1541056244941,
    'signerInfo': '',
    'documentType': '',
    'documentCat': '',
    'categoryName': 'VBHC',
    'subject': 'Van ban pc',
    'templateNo': '',
    'content': '',
    'secutype': 0,
    'priority': 0,
    'pageAmount': 0,
    'language': '',
    'register': 0,
    'registerDate': 1541056244941,
    'seqNum': 0,
    'permission': 'owner',
    'dueDate': 1541056244941,
    'editable': 0,
    'state': 0,
    'stateName': 0,
    'hostingId': 0,
    'hostingName': '',
    'managerId': 0,
    'managerName': '',
    'leaderId': 0,
    'leaderName': '',
    'leaderNote': '',
    'eform': '',
    'overdue': 0,
    'visited': false,
    'workspaces': [
      {
        'workspaceId': 3,
        'name': 'n3',
        'permanent': false
      }
    ]
  }
]

window._docFileCount = { 'me': 20, 'all': 100, 'trash': 10 }

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://192.168.10.89:8080/api/'
const urlDocFiles = endPoint + 'docfiles'

const hasClient = {

  getDocFiles (query, cb, errorCb) {
    const result = {
      total: window._docFileItems.length,
      data: window._docFileItems
    }
    setTimeout(() => cb(result), 100)
  },

  readDocFile (docFileId, cb, errorCb) {
    setTimeout(() => cb(window._docFileItems.find(item => Number(item.docFileId) === Number(docFileId))), 100)
  },

  createDocFile (params, cb, errorCb) {
    console.log(params)
    let result = {}
    for (let key in window._docFileItems[0]) {
      if (key === 'docFileId') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._docFileItems[0][key]
      }
    }
    // error window._docFileItems.push(result)
    setTimeout(() => cb(result), 100)
  },

  updateDocFile (params, cb, errorCb) {
    let updated = window._docFileItems.find(item => item.docFileId === params.docFileId)
    let result = {}
    Object.assign(result, updated, params)
    // error let index = window._docFileItems.findIndex(item => item.docFileId === params.docFileId)
    // error window._docFileItems[index] = result
    setTimeout(() => cb(result), 100)
  },

  deleteDocFile (docFileId, cb, errorCb) {
    window._docFileItems = window._docFileItems.filter(item => item.docFileId !== docFileId)
    setTimeout(() => cb(window._docFileItems.find(item => item.docFileId === docFileId)), 100)
  },

  downloadDocFile (docFileId, cb, errorCb) {
    window._docFileItems = window._docFileItems.filter(item => item.docFileId !== docFileId)
    setTimeout(() => cb(window._docFileItems.find(item => item.docFileId === docFileId)), 100)
  },

  copyDocFile (params, cb, errorCb) {
    setTimeout(() => cb(window._docFileItems), 100)
  },

  count (params, cb, errorCb) {
    setTimeout(() => cb(window._docFileCount), 100)
  }

}
const hasServer = {

  getDocFiles (query, cb, errorCb) {
    let url = urlDocFiles
    if (query.recent) {
      url += '/recent'
    }
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

  readDocFile (docFileId, cb, errorCb) {
    const url = urlDocFiles + '/' + docFileId
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

  createDocFile (params, cb, errorCb) {
    let urlParams = new URLSearchParams()
    for (let key in params) {
      urlParams.append(key, params[key])
    }
    window.axios.post(urlDocFiles, urlParams, {
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

  updateDocFile (params, cb, errorCb) {
    const url = urlDocFiles + '/' + params.docFileId
    let urlParams = new URLSearchParams()
    for (let key in params) {
      urlParams.append(key, params[key])
    }
    window.axios.put(url, urlParams)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteDocFile (docFileId, cb, errorCb) {
    const url = urlDocFiles + '/' + docFileId
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

  downloadDocFile (docFileId, cb, errorCb) {
    const url = urlDocFiles + '/' + docFileId + '/download'
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

  copyDocFile (params, cb, errorCb) {
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlDocFiles + '/' + params.userId + '/copy'
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

  count (query, cb, errorCb) {
    let url = urlDocFiles + '/count'
    let queries = {
      start: -1,
      end: -1,
      type: 'TASK'
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
