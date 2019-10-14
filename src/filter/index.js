export function timeFilter (value) {
  if (value) {
    value = Number(value)
    let dateCur = new Date(value)
    let month = dateCur.getMonth() + 1
    let day = dateCur.getDate()
    let hour = dateCur.getHours()
    let minute = dateCur.getMinutes()
    let seconds = dateCur.getSeconds()
    if (day < 10) {
      day = '0' + day
    }
    if (month < 10) {
      month = '0' + month
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return hour + ':' + minute
  } else {
    return 'Chưa cập nhật'
  }
}

export function dateTimeFilter (value) {
  if (value) {
    value = Number(value)
    let dateCur = new Date(value)
    let month = dateCur.getMonth() + 1
    let day = dateCur.getDate()
    let year = dateCur.getFullYear()
    let hour = dateCur.getHours()
    let minute = dateCur.getMinutes()
    let seconds = dateCur.getSeconds()
    if (day < 10) {
      day = '0' + day
    }
    if (month < 10) {
      month = '0' + month
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return day + '/' + month + '/' + year + ' ' + hour + ':' + minute
  } else {
    return 'Chưa cập nhật'
  }
}

export function dateFilter (value) {
  if (value) {
    value = Number(value)
    let dateCur = new Date(value)
    let month = dateCur.getMonth() + 1
    let day = dateCur.getDate()
    let year = dateCur.getFullYear()
    let hour = dateCur.getHours()
    let minute = dateCur.getMinutes()
    let seconds = dateCur.getSeconds()
    if (day < 10) {
      day = '0' + day
    }
    if (month < 10) {
      month = '0' + month
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return day + '/' + month + '/' + year
  } else {
    return 'Chưa cập nhật'
  }
}
