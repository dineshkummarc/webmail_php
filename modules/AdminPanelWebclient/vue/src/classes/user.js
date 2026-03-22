import _ from 'lodash'

import typesUtils from 'src/utils/types'

import enums from 'src/enums'

import GroupModel from 'src/classes/group'

class UserModel {
  constructor (tenantId, serverData, completeData = null) {
    const UserRoles = enums.getUserRoles()

    this.tenantId = tenantId
    this.id = typesUtils.pInt(serverData?.Id)
    this.name = typesUtils.pString(serverData?.Name)
    this.publicId = typesUtils.pString(serverData?.PublicId)
    this.role = typesUtils.pEnum(serverData?.Role, UserRoles, UserRoles.Anonymous)
    this.disabled = typesUtils.pBool(serverData?.IsDisabled)
    this.uuid = typesUtils.pString(serverData?.UUID)
    this.quotaBytes = typesUtils.pInt(serverData?.QuotaBytes)
    this.note = typesUtils.pString(serverData?.Note)

    this.groups = typesUtils.pArray(serverData.Groups).map(groupData => new GroupModel(groupData))

    this.setCompleteData(completeData)
  }

  setCompleteData (data) {
    this.completeData = data

    this.update(data)
  }

  update (data, allTenantGroups = null) {
    const UserRoles = enums.getUserRoles()

    if (data !== null) {
      this.role = typesUtils.pEnum(data?.Role, UserRoles, UserRoles.Anonymous)
    }

    if (data?.IsDisabled !== undefined) {
      this.disabled = typesUtils.pBool(data.IsDisabled)
    }

    if (data?.WriteSeparateLog !== undefined) {
      this.writeSeparateLog = typesUtils.pBool(data?.WriteSeparateLog)
    }

    if (data?.PublicId) {
      this.publicId = typesUtils.pString(data.PublicId)
    }

    if (data?.QuotaBytes) {
      this.quotaBytes = typesUtils.pInt(data.QuotaBytes)
    }

    if (data?.Note) {
      this.note = typesUtils.pString(data.Note)
    }

    if (_.isArray(allTenantGroups)) {
      const groupIds = typesUtils.pArray(data?.GroupIds)
      this.groups = groupIds.map(id => allTenantGroups.find(group => group.id === id))
    }
  }

  addGroup (groupToAdd) {
    if (!this.groups.find(group => group.id === groupToAdd.id)) {
      this.groups = this.groups.concat([groupToAdd])
    }
  }

  removeGroup (groupToRemove) {
    this.groups = this.groups.filter(group => group.id !== groupToRemove.id)
  }

  getData (field) {
    return this.completeData && this.completeData[field]
  }

  updateData (fieldsData) {
    if (!_.isEmpty(this.completeData)) {
      fieldsData.forEach(data => {
        this.completeData[data.field] = data.value
      })
    }
  }
}

export default UserModel
