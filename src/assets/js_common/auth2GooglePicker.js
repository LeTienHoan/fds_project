
// The Browser API key obtained from the Google API Console.
var developerKeyHHHHH = 'AIzaSyCqirwRWuYRB4U1Ayb7kHhFM2AfUzqkHuk-----'

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientIdHHHHH = '695774120434-l58k4dfk0dvvucsni804gpji97tmsg4b.apps.googleusercontent.com-----'

// Scope to use to access user's photos.
var scopeHHHHH = 'https://www.googleapis.com/auth/photoslibrary'

var pickerApiLoadedHHHHH = false
var oauthTokenHHHHH

// Use the API Loader script to load google.picker and gapi.auth.
function onApiLoadHHHHH () {
  window.gapi.load('auth', onAuthApiLoadHHHHH)
  window.gapi.load('picker', onPickerApiLoadHHHHH)
}

function onAuthApiLoadHHHHH () {
  // console.log('onAuthApiLoad', clientIdHHHHH)
}

window.onAuthApiLoadAndHandleAuthResultAndCreatePicker = function (pViewId, cb) {
  if (cb) {
    idHHHHH = pViewId
    vueCallBackHHHHH = cb
    checkLogic1HHHHH()
  } else {
    window.gapi.auth.authorize({
      client_id: clientIdHHHHH,
      scope: scopeHHHHH
    }, handleAuthResult)
  }
}

function onPickerApiLoadHHHHH () {
  // console.log('pickerApiLoadedHHHHH = true')
  pickerApiLoadedHHHHH = true
}

function handleAuthResult (authResult) {
  if (authResult && !authResult.error) {
    oauthTokenHHHHH = authResult.access_token
    createPicker()
  }
}

// Create and render a Picker object for picking user Photos.
function createPicker () {
  if (pickerApiLoadedHHHHH && oauthTokenHHHHH) {
    let picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.PHOTOS)
      .setOAuthToken(oauthTokenHHHHH)
      .setDeveloperKey(developerKeyHHHHH)
      .setCallback(pickerCallback)
      .build()
    picker.setVisible(true)
  }
}

// A simple callback implementation.
function pickerCallback (data) {
  let url = 'nothing'
  if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
    let doc = data[window.google.picker.Response.DOCUMENTS][0]
    url = doc[window.google.picker.Document.URL]
  }
  alert('You picked: ' + url)
}

const auth2GooglePicker = {

  onApiLoad (Vue, mApiKey, mClient) {
    developerKeyHHHHH = mApiKey
    clientIdHHHHH = mClient
    return onApiLoadHHHHH
  }
}
export default auth2GooglePicker

// ThanhNv Move List attach google to
scopeHHHHH = ['https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/photoslibrary']
var idHHHHH = 'DOCS'
var viewIdForhandleAuthResultHHHHH = 'DOCS'
function checkLogic1HHHHH () {
  let viewIdsHHHHH = {
    'DOCS': window.google.picker.ViewId.DOCS,
    'DOCS_IMAGES': window.google.picker.ViewId.DOCS_IMAGES,
    'DOCUMENTS': window.google.picker.ViewId.DOCUMENTS,
    'PRESENTATIONS': window.google.picker.ViewId.PRESENTATIONS,
    'SPREADSHEETS': window.google.picker.ViewId.SPREADSHEETS,
    'FORMS': window.google.picker.ViewId.FORMS,
    'DOCS_IMAGES_AND_VIDEOS': window.google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS,
    'DOCS_VIDEOS': window.google.picker.ViewId.DOCS_VIDEOS,
    'FOLDERS': window.google.picker.ViewId.FOLDERS,
    'PDFS': window.google.picker.ViewId.PDFS,
    'DOCS_UPLOAD': new window.google.picker.DocsUploadView(),
    'PHOTO_ALBUMS': window.google.picker.ViewId.PHOTO_ALBUMS,
    'PHOTOS': window.google.picker.ViewId.PHOTOS,
    'PHOTO_UPLOAD': window.google.picker.ViewId.PHOTO_UPLOAD,
    'IMAGE_SEARCH': window.google.picker.ViewId.IMAGE_SEARCH,
    'MAPS': window.google.picker.ViewId.MAPS,
    'VIDEO_SEARCH': window.google.picker.ViewId.VIDEO_SEARCH,
    'WEBCAM': window.google.picker.ViewId.WEBCAM,
    'YOUTUBE': window.google.picker.ViewId.YOUTUBE,
    'RECENTLY_PICKED': window.google.picker.ViewId.RECENTLY_PICKED
  }
  let viewIdHHHHH = viewIdsHHHHH[idHHHHH]
  let setOAuthTokenHHHHH = true
  if (idHHHHH === 'IMAGE_SEARCH' || idHHHHH === 'MAPS' || idHHHHH === 'VIDEO_SEARCH') {
    setOAuthTokenHHHHH = false
    createPickerLogicHHHHH(viewIdHHHHH, setOAuthTokenHHHHH)
  } else {
    if (pickerApiLoadedHHHHH && !oauthTokenHHHHH) {
      viewIdForhandleAuthResultHHHHH = viewIdHHHHH
      window.gapi.auth.authorize(
        {
          'client_id': clientIdHHHHH,
          'scope': scopeHHHHH,
          'immediate': false
        },
        handleAuthResultLogicHHHHH
      )
    } else {
      createPickerLogicHHHHH(viewIdHHHHH, setOAuthTokenHHHHH)
    }
  }
}
function createPickerLogicHHHHH (viewId, setOAuthToken) {
  if (pickerApiLoadedHHHHH && pickerApiLoadedHHHHH) {
    let picker
    if (pickerApiLoadedHHHHH && oauthTokenHHHHH && setOAuthToken) {
      picker = new window.google.picker.PickerBuilder().addView(viewId)
        .setOAuthToken(oauthTokenHHHHH)
        .setDeveloperKey(developerKeyHHHHH).setCallback(
          pickerCallbackLogicHHHHH).build()
    } else {
      picker = new window.google.picker.PickerBuilder().addView(viewId)
        .setDeveloperKey(developerKeyHHHHH).setCallback(
          pickerCallbackLogicHHHHH).build()
    }
    picker.setVisible(true)
  }
}
function handleAuthResultLogicHHHHH (authResult) {
  if (authResult && !authResult.error) {
    oauthTokenHHHHH = authResult.access_token
    createPickerLogicHHHHH(viewIdForhandleAuthResultHHHHH, true)
  }
}

function pickerCallbackLogicHHHHH (data) {
  vueCallBackHHHHH(data, oauthTokenHHHHH)
}

var vueCallBackHHHHH = function (data, oauthToken) {
  console.log(vueCallBackHHHHH)
}
