var authApiLoaded = false
var pickerApiLoaded = false
var oauthToken = null
var viewIdForhandleAuthResult = null
function onApiLoad () {
  window.gapi.load('auth', {
    'callback': onAuthApiLoad
  })
  window.gapi.load('picker', {
    'callback': onPickerApiLoad
  })
}
function onAuthApiLoad () {
  authApiLoaded = true
}
function onPickerApiLoad () {
  pickerApiLoaded = true
}

console.log(authApiLoaded, pickerApiLoaded, oauthToken, viewIdForhandleAuthResult, onApiLoad, '>>>>>>>intitDRIVER-forclient>>>>>')
