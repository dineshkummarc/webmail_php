import typesUtils from 'src/utils/types'
import _ from 'lodash'

class TenantModel {
  constructor (serverData = {}, completeData = null) {
    this.id = typesUtils.pInt(serverData.Id)
    this.name = typesUtils.pString(serverData.Name)
    this.siteName = typesUtils.pString(serverData.SiteName)
    this.setCompleteData(completeData)
  }

  setCompleteData (data) {
    if (_.isEmpty(this.completeData)) {
      this.completeData = {}
    }
    if (_.isObject(data)) {
      this.completeData = _.extend(this.completeData, data)
    }
  }

  update (name, siteName, completeData) {
    this.name = typesUtils.pString(name)
    this.siteName = typesUtils.pString(siteName)

    this.setCompleteData(completeData)
  }

  getData (field) {
    return this.completeData && this.completeData[field]
  }

  copy (srcTenant) {
    this.id = srcTenant.id
    this.name = srcTenant.name
    this.siteName = srcTenant.siteName
    this.completeData = srcTenant.completeData
  }
}

export default TenantModel
