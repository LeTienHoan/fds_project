const MobilinkVariablesConstants =
{
  data () {
    return {
      get profileConfigNotice () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.profileConfigNotice : {
          'SHARING': {
            'org.mobilink.activitymgt.model.Activity': {
              'email': true,
              'sms': false,
              'notify': true
            },
            'org.mobilink.docmgt.model.DocFile': {
              'email': true,
              'sms': false,
              'notify': true
            }
          }
        }
      },
      get profileConfigSchema () {
        return window.ACTIVITY_CONST ? window.ACTIVITY_CONST.profileConfigSchema : {
          'schema': {
            'type': 'object',
            'required': false,
            'properties': {
              'SHARING': {
                'title': 'Chia sẻ - SHARING',
                'type': 'object',
                'required': false,
                'properties': {
                  'org.mobilink.activitymgt.model.Activity': {
                    'title': 'Hoạt động',
                    'type': 'object',
                    'properties': {
                      'email': {
                        'type': 'boolean',
                        'title': 'Email'
                      },
                      'sms': {
                        'type': 'boolean',
                        'title': 'SMS'
                      },
                      'notify': {
                        'type': 'boolean',
                        'title': 'Notify'
                      }
                    }
                  },
                  'org.mobilink.docmgt.model.DocFile': {
                    'title': 'Tài liệu',
                    'type': 'object',
                    'properties': {
                      'email': {
                        'type': 'boolean',
                        'title': 'Email'
                      },
                      'sms': {
                        'type': 'boolean',
                        'title': 'SMS'
                      },
                      'notify': {
                        'type': 'boolean',
                        'title': 'Notify'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export default MobilinkVariablesConstants
