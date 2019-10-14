/**
 * Mocking client-server processing
 */

window._userItems = [
  {
    'userId': 11111,
    'classPK': 11111,
    'createDate': 1538384626000,
    'modifiedDate': 1538384626000,
    'fullName': 'Nguyen Van user',
    'accessible': true,
    'roleId': 0,
    'code': '001d',
    'description': 'Nguyen Van user',
    'email': 'user@gmail.com'
  },
  {
    'userId': 11112,
    'classPK': 11112,
    'createDate': 1538387320000,
    'modifiedDate': 1538476093000,
    'fullName': 'Nguyen Van user2',
    'accessible': true,
    'roleId': 0,
    'code': '001e',
    'description': 'Nguyen Van user2',
    'email': 'user2@gmail.com'
  },
  {
    'userId': 11113,
    'classPK': 11113,
    'createDate': 1538476139000,
    'modifiedDate': 1538476139000,
    'fullName': 'Nguyen Van user2.1',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0001',
    'description': 'Nguyen Van user2 _________ Nguyen Van user2.1',
    'email': 'user2.1@gmail.com'
  },
  {
    'userId': 11114,
    'classPK': 11114,
    'createDate': 1538476507000,
    'modifiedDate': 1538476507000,
    'fullName': 'Nguyen Van user2.2',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0002',
    'description': 'Nguyen Van user2 _________ Nguyen Van user2.2',
    'email': 'user2.2@gmail.com'
  },
  {
    'userId': 11115,
    'classPK': 11115,
    'createDate': 1538476988000,
    'modifiedDate': 1538476988000,
    'fullName': 'Nguyen Van user2.3',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0003',
    'description': 'Nguyen Van user2 _________ Nguyen Van user2.3',
    'email': 'user2.3@gmail.com'
  },
  {
    'userId': 11116,
    'classPK': 11116,
    'createDate': 1538477065000,
    'modifiedDate': 1538477065000,
    'fullName': 'Nguyen Van ws2.4',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0004',
    'description': 'Nguyen Van user2 _________ Nguyen Van ws2.4',
    'email': 'user2.4@gmail.com'
  },
  {
    'userId': 11117,
    'classPK': 11117,
    'createDate': 1538483707000,
    'modifiedDate': 1538483707000,
    'fullName': 'Nguyen Van ws2.5',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0005',
    'description': 'Nguyen Van user2 _________ Nguyen Van ws2.5',
    'email': 'user2.5@gmail.com'
  },
  {
    'userId': 11118,
    'classPK': 11118,
    'createDate': 1538484164000,
    'modifiedDate': 1538484164000,
    'fullName': 'Nguyen Van ws2.6',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0006',
    'description': 'Nguyen Van user2 _________ Nguyen Van ws2.6',
    'email': 'user2.6@gmail.com'
  },
  {
    'userId': 11119,
    'classPK': 11119,
    'createDate': 1538489135000,
    'modifiedDate': 1538489135000,
    'fullName': 'Nguyen Van ws2.7',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0007',
    'description': 'Nguyen Van user2 _________ Nguyen Van ws2.7',
    'email': 'user2.7@gmail.com'
  },
  {
    'userId': 11120,
    'classPK': 11120,
    'createDate': 1538489518000,
    'modifiedDate': 1538489518000,
    'fullName': 'Nguyen Van ws2.8',
    'accessible': true,
    'roleId': 6101,
    'code': '001e.0008',
    'description': 'Nguyen Van user2 _________ Nguyen Van ws2.8',
    'email': 'user2.8@gmail.com'
  },
  {
    'userId': 11121,
    'classPK': 11121,
    'createDate': 1541071582000,
    'modifiedDate': 1541071598000,
    'fullName': 'httrr',
    'accessible': true,
    'roleId': 0,
    'code': '0029',
    'description': 'httrr',
    'email': 'httrr@gmail.com'
  }
]

const endPoint = window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
const urlUsers = endPoint + 'users'

const hasClient = {

  getUsers (query, cb, errorCb) {
    const result = {
      total: window._userItems.length,
      data: window._userItems
    }
    setTimeout(() => cb(result), 100)
  },

  readUser (userId, cb, errorCb) {
    setTimeout(() => cb(window._userItems.find(item => item.userId === userId)), 100)
  },

  createUser (params, cb, errorCb) {
    let result = {}
    for (let key in window._userItems[0]) {
      if (key === 'userId') {
        result[key] = Math.floor(Math.random() * 10000) + 1
      } else {
        result[key] = params[key] || window._userItems[0][key]
      }
    }
    setTimeout(() => cb(result), 100)
  },

  updateUser (params, cb, errorCb) {
    let result = {}
    let selected = window._userItems.find(item => item.userId === params.userId)
    if (selected.userId) {
      Object.assign(result, selected, params)
    }
    setTimeout(() => cb(result), 100)
  },

  deleteUser (userId, cb, errorCb) {
    window._userItems = window._userItems.filter(item => item.userId !== userId)
    setTimeout(() => cb(window._userItems.find(item => item.userId === userId)), 100)
  },

  putUserLogo (params, cb, errorCb) {
    const result = {
      total: window._userItems.length,
      data: window._userItems
    }
    setTimeout(() => cb(result), 100)
  },

  getUserLogo (userId, cb, errorCb) {
    setTimeout(() => cb(window._userItems.find(item => item.userId === userId)), 100)
  }

}

const hasServer = {

  getUsers (query, cb, errorCb) {
    // TODO: call api get users
    let queries = {
      start: -1,
      end: -1
    }
    Object.assign(queries, query)
    window.axios.get(urlUsers, {
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

  readUser (userId, cb, errorCb) {
    // TODO: call api get user by id
    let queries = {
      start: -1,
      end: -1
    }
    const url = urlUsers + '/' + userId
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

  createUser (params, cb, errorCb) {
    // TODO: call api create user

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsCreateUser = new URLSearchParams()
    for (const key in params) {
      urlParamsCreateUser.append(key, params[key])
    }
    window.axios.post(urlUsers, urlParamsCreateUser)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  updateUser (params, cb, errorCb) {
    // TODO: call api create user

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateUser = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateUser.append(key, params[key])
    }
    const url = urlUsers + '/' + params.userId
    window.axios.put(url, urlParamsUpdateUser)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  deleteUser (userId, cb, errorCb) {
    // TODO: call api create user

    const url = urlUsers + '/' + userId
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

  putUserLogo (params, cb, errorCb) {
    // TODO: call api create user

    // if change swagger api, this urlSearchParams is neednt
    let urlParamsUpdateUser = new URLSearchParams()
    for (const key in params) {
      urlParamsUpdateUser.append(key, params[key])
    }
    const url = urlUsers + '/' + params.userId
    window.axios.put(url, urlParamsUpdateUser)
      .then(function (response) {
        const serializable = response.data
        cb(serializable)
      })
      .catch(function (error) {
        console.log(error)
        errorCb(error)
      })
  },

  getUserLogo (userId, cb, errorCb) {
    // TODO: call api get /users/copy/{sourceId}/{targetId}
    let queries = {
      start: -1,
      end: -1
    }
    window.axios.get(urlUsers + '/' + userId + '/logo', {params: queries})
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
