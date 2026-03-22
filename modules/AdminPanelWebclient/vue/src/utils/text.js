import { i18n } from 'boot/i18n'

import typesUtils from './types'

export default {
  getFriendlySize: function (sizeInBytes) {
    const bytesInKb = 1024
    const bytesInMb = bytesInKb * bytesInKb
    const bytesInGb = bytesInKb * bytesInKb * bytesInKb

    sizeInBytes = typesUtils.pInt(sizeInBytes)

    if (sizeInBytes >= bytesInGb) {
      return typesUtils.roundNumber(sizeInBytes / bytesInGb, 1) + i18n.global.tc('COREWEBCLIENT.LABEL_GIGABYTES')
    } else if (sizeInBytes >= bytesInMb) {
      return typesUtils.roundNumber(sizeInBytes / bytesInMb, 1) + i18n.global.tc('COREWEBCLIENT.LABEL_MEGABYTES')
    } else if (sizeInBytes >= bytesInKb) {
      return typesUtils.roundNumber(sizeInBytes / bytesInKb, 0) + i18n.global.tc('COREWEBCLIENT.LABEL_KILOBYTES')
    }

    return sizeInBytes + i18n.global.tc('COREWEBCLIENT.LABEL_BYTES')
  },

  encodeHtml: function (text) {
    if (typesUtils.isNonEmptyString(text)) {
      return text.toString()
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
    }
    return ''
  },

  htmlToPlain: function (html) {
    return html
      .replace(/([^>]{1})<div>/gi, '$1\n')
      .replace(/<style[^>]*>[^<]*<\/style>/gi, '\n')
      .replace(/<br *\/{0,1}>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<a [^>]*href="([^"]*?)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
  },

  htmlToTextSearch: function (html) {
    return html
      .replace(/([^>]{1})<div>/gi, '$1 ')
      .replace(/<style[^>]*>[^<]*<\/style>/gi, ' ')
      .replace(/<br *\/{0,1}>/gi, '\n')
      .replace(/<\/p>/gi, ' ')
      .replace(/<\/div>/gi, ' ')
      .replace(/<a [^>]*href="([^"]*?)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
  },

  unescapeHTMLSymbols (text) {
    const htmlEntities = {
      nbsp: ' ',
      cent: '¢',
      pound: '£',
      yen: '¥',
      euro: '€',
      copy: '©',
      reg: '®',
      lt: '<',
      gt: '>',
      quot: '"',
      amp: '&',
      apos: '\'',
    }

    return text.replace(/&([^;]+);/g, function (entity, entityCode) {
      let match

      if (entityCode in htmlEntities) {
        return htmlEntities[entityCode]
        /* eslint no-cond-assign: 0 */
      } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
        return String.fromCharCode(parseInt(match[1], 16))
        /* eslint no-cond-assign: 0 */
      } else if (match = entityCode.match(/^#(\d+)$/)) {
        return String.fromCharCode(~~match[1])
      } else {
        return entity
      }
    })
  },
}
