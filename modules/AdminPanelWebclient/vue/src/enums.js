import _ from 'lodash'

import typesUtils from 'src/utils/types'

const enums = {
  UserRoles: {},

  init (appData) {
    const coreData = typesUtils.pObject(appData.Core, {})
    if (!_.isEmpty(coreData)) {
      this.UserRoles = typesUtils.pObject(coreData.EUserRole)
    }
  },
}

export default {
  init: enums.init.bind(enums),

  getUserRoles () {
    return enums.UserRoles
  },

}
