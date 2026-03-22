import _ from 'lodash'

export default {
  pInt(value, defaultValue = 0) {
    let intValue = parseInt(value, 10)
    if (isNaN(intValue)) {
      intValue = !isNaN(defaultValue) ? defaultValue : 0
    }
    return intValue
  },
  roundNumber(iNum, iDec) {
    return Math.round(iNum * Math.pow(10, iDec)) / Math.pow(10, iDec)
  },
  pPositiveInt(value, defaultValue = 1) {
    const intValue = window.parseInt(value, 10)
    if (!isNaN(intValue) && intValue >= 1) {
      return intValue
    }
    if (!isNaN(defaultValue) && defaultValue >= 1) {
      return defaultValue
    }
    return 1
  },

  pNonNegativeInt(value, defaultValue = 0) {
    const intValue = window.parseInt(value, 10)
    if (!isNaN(intValue) && intValue >= 0) {
      return intValue
    }
    if (!isNaN(defaultValue) && defaultValue >= 0) {
      return defaultValue
    }
    return 0
  },

  isNonEmptyString(value) {
    return _.isString(value) && value !== ''
  },

  pString(value, defaultValue = '') {
    if (value !== undefined && value !== null) {
      return value.toString()
    }
    if (typeof defaultValue === 'string') {
      return defaultValue
    }
    return ''
  },

  isNonEmptyArray: function (value, arrayLength = 1) {
    return _.isArray(value) && arrayLength <= value.length
  },

  pArray: function (value, defaultValue = []) {
    if (_.isArray(value)) {
      return value
    }
    if (_.isArray(defaultValue)) {
      return defaultValue
    }
    return []
  },

  pBool: function (value, defaultValue = false) {
    if (typeof value === 'boolean') {
      return value
    }
    if (typeof defaultValue === 'boolean') {
      return defaultValue
    }
    return false
  },

  isNotNullObject: function (value) {
    return _.isObject(value) && !_.isArray(value) && value !== null
  },

  isNonEmptyObject: function (value) {
    return _.isObject(value) && !_.isArray(value) && !_.isEmpty(value)
  },

  pObject: function (value, defaultValue = {}) {
    if (this.isNotNullObject(value)) {
      return value
    }
    if (_.isObject(defaultValue) && !_.isArray(defaultValue)) {
      return defaultValue
    }
    return {}
  },

  pEnum(value = null, enumObject = {}, defaultValue = null) {
    const enumValues = Object.values(enumObject)
    if (enumValues.includes(value)) {
      return value
    }
    if (enumValues.includes(defaultValue)) {
      return defaultValue
    }
    return enumValues[0] || null
  },

  pStringToJson: function (value) {
    let oResult = null
    if (this.isNonEmptyString(value)) {
      oResult = JSON.parse(value)
      if (!_.isObject(oResult)) {
        oResult = null
      }
    }
    return oResult
  },
}
