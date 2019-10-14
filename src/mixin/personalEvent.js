const MobilinkVariablesConstants =
{
  data () {
    return {
      get personalEventConfirmItems () {
        return [
          { value: 0, text: 'Có quan tâm' },
          { value: 1, text: 'Sẽ tham gia' },
          { value: 2, text: 'Bận không tham dự' }
        ]
      },
      get calendarOthersPublicVariable () {
        return window.themeDisplay ? window.themeDisplay.getCDNBaseURL() + '/o/v2/mobilink/' : 'http://localhost:8081/api/'
      }
    }
  },
  methods: {
    personalEventColorByConfirmCode (value) {
      let result = '#ffc107'
      switch (value) {
        case 0:
          result = '#ffc107'
          break
        case 1:
          result = '#8bc34a'
          break
        case 2:
          result = '#9c27b0'
          break
        default:
          result = '#ffc107'
          break
      }
      return result
    },
    calendarOthersMethodSuchAs (value) {
      if ('owner, leader'.indexOf(value) >= 0) {
        return 'owner'
      } else if ('hoster, manager, write'.indexOf(value) >= 0) {
        return 'write'
      } else if ('read'.indexOf(value) >= 0) {
        return 'read'
      } else {
        return 'none'
      }
    },
    textBoldVisited (value) {
      if (value === false) {
        return 'text-bold'
      } else {
        return ''
      }
    }
  }
}

export default MobilinkVariablesConstants
