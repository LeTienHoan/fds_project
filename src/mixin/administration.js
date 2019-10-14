const MobilinkVariablesConstants = {
  data () {
    return {
      get notificationIntervalItems () {
        return ['minutely', '5-mins', '15-mins', '30-mins', 'hourly', 'daily']
      },
      get current_full_name () {
        return window.themeDisplay ? window.themeDisplay.getUserName() : 'Supper Admin'
      },
      get defaultUserImg () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.defaultUserImg : 'http://qa.mobilink.vn/o/frontend-web-usermgt/images/user_02.png'
      },
      get jobposPermissionItems () {
        return [
          { actionId: 'VIEW_EMPLOYEE' },
          { actionId: 'UPDATE_EMPLOYEE' },
          { actionId: 'VIEW_PARTNER' },
          { actionId: 'UPDATE_PARTNER' },
          { actionId: 'ADD_ACTIVITY_TEMPLATE' },
          { actionId: 'ADD_DOCFILE_TEMPLATE' },
          { actionId: 'ADD_DOCARCHIVE_TEMPLATE' },
          { actionId: 'ADD_PROJECT' },
          { actionId: 'ADD_NEWSBOARD' },
          { actionId: 'EDIT_DATA' },
          { actionId: 'ADD_WORKSPACE' },
          { actionId: 'MANIAGE_DOCUMENT' }
        ]
      }
    }
  },
  methods: {
    getPriorityName (value) {
      let priorityKey = ''
      for (let k in this.constantPriorityKey) {
        if (this.constantPriorityKey[k].value === value) {
          priorityKey = this.constantPriorityKey[k].text
          break
        }
      }
      return priorityKey
    }

  }
}

export default MobilinkVariablesConstants
