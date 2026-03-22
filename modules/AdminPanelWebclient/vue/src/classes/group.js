import typesUtils from 'src/utils/types'

class GroupModel {
  constructor (serverData = {}) {
    this.tenantId = typesUtils.pInt(serverData.TenantId)
    this.id = typesUtils.pInt(serverData.Id)
    this.name = typesUtils.pString(serverData.Name)
    this.isTeam = typesUtils.pBool(serverData.IsAll)
  }

  update (name) {
    this.name = typesUtils.pString(name)
  }

  copy (srcGroup) {
    this.id = srcGroup.id
    this.name = srcGroup.name
  }
}

export default GroupModel
