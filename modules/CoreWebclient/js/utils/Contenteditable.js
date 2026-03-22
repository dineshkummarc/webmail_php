'use strict'

const _ = require('underscore')

const ContenteditableUtils = {}

ContenteditableUtils.setCursorAtTheEnd = function (contentEditableElement) {
  if (document.createRange) {
    const range = document.createRange()
    range.selectNodeContents(contentEditableElement)
    range.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    contentEditableElement.focus()
    range.detach()
  }
}

ContenteditableUtils.getSelectionRanges = function () {
  const ranges = []
  if (window.getSelection) {
    const selection = window.getSelection(),
      count = selection.rangeCount
    for (let index = 0; index < count; index++) {
      ranges.push(selection.getRangeAt(index))
    }
  }
  return ranges
}

ContenteditableUtils.setSelectionRanges = function (ranges, collapse = false) {
  let rangeText = ''
  if (window.getSelection && _.isArray(ranges)) {
    const count = ranges.length,
      selection = window.getSelection()
    selection.removeAllRanges()
    for (let index = 0; index < count; index++) {
      const range = ranges[index]
      if (range) {
        selection.addRange(range)
        rangeText += range
        if (collapse) {
          range.collapse(false)
        }
      }
    }
  }
  return rangeText
}

module.exports = ContenteditableUtils
