const _ = require('lodash')
const fs = require('fs')
const iniParser = require('iniparser')

function getShortLangName(langName) {
  const list = {
    'arabic.ini': 'ar',
    'bulgarian.ini': 'bg',
    'chinese-traditional.ini': 'zh-tw',
    'chinese-simplified.ini': 'zh-cn',
    'czech.ini': 'cs',
    'danish.ini': 'da',
    'dutch.ini': 'nl',
    'english.ini': 'en',
    'estonian.ini': 'et',
    'finnish.ini': 'fi',
    'french.ini': 'fr',
    'german.ini': 'de',
    'greek.ini': 'el',
    'hebrew.ini': 'he',
    'hungarian.ini': 'hu',
    'italian.ini': 'it',
    'japanese.ini': 'ja',
    'korean.ini': 'ko',
    'latvian.ini': 'lv',
    'lithuanian.ini': 'lt',
    'norwegian.ini': 'nb',
    'persian.ini': 'fa',
    'polish.ini': 'pl',
    'portuguese-brazil.ini': 'pt-br',
    'portuguese-portuguese.ini': 'pt',
    'romanian.ini': 'ro',
    'russian.ini': 'ru',
    'serbian.ini': 'sr',
    'slovenian.ini': 'sl',
    'spanish.ini': 'es',
    'swedish.ini': 'sv',
    'thai.ini': 'th',
    'turkish.ini': 'tr',
    'ukrainian.ini': 'uk',
    'vietnamese.ini': 'vi'
  }
  return list[langName.toLowerCase()] || 'en'
}

function getInCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/[-\s]+/g, '')
}

function prepareLangs() {
  const coreI18nPath = './src/../../../CoreWebclient/i18n/'
  const modulesPath = './src/../../../'

  const importLines = []
  const nameLines = []
  fs.readdirSync(coreI18nPath).forEach(langName => {
    const shortName = getShortLangName(langName)
    if (prepareOneLang(modulesPath, langName, shortName)) {
      const nameInCamelCase = getInCamelCase(shortName)
      importLines.push(`import ${nameInCamelCase} from './${shortName}'`)
      nameLines.push(`  ${nameInCamelCase},`)
    }
  })

  const i18nDir = './src/i18n/'
  if (fs.existsSync(i18nDir)) {
    const names = nameLines.join('\n')
    const imports = importLines.join('\n')
    const modulesContent =
      `${imports}

export default {
${names}
}
`
    fs.writeFileSync(i18nDir + 'index.js', modulesContent)
  }
}

function prepareOneLang(modulesPath, iniFileName, langFolder) {
  const langsJson = {}
  fs.readdirSync(modulesPath).forEach(moduleName => {
    const i18nPath = modulesPath + moduleName + '/i18n/' + iniFileName
    const englishI18nPath = modulesPath + moduleName + '/i18n/English.ini'
    if (fs.existsSync(i18nPath)) {
      const content = fs.readFileSync(i18nPath, 'utf8')
      langsJson[moduleName.toUpperCase()] = iniParser.parseString(content)
    } else if (fs.existsSync(englishI18nPath)) {
      const content = fs.readFileSync(englishI18nPath, 'utf8')
      langsJson[moduleName.toUpperCase()] = iniParser.parseString(content)
    }
  })

  const newLangsJson = {}
  _.each(langsJson, (moduleJson, moduleName) => {
    const newModuleJson = {}
    _.each(moduleJson, (constValue, constName) => {
      constValue = constValue.replace(/^"/, '').replace(/"$/, '').replace(/\\"/g, '"').replace(/@/g, "{'@'}")
      if (constValue.indexOf('%') !== -1) {
        const re = /%([\w_\-=]+)%/gi
        constValue = constValue.replace(re, (match, p1, offset, string) => {
          return '{' + p1 + '}'
        })
      }
      newModuleJson[constName] = constValue
    })
    newLangsJson[moduleName] = newModuleJson
  })

  const dir = './src/i18n/' + langFolder + '/'
  if (!_.isEmpty(newLangsJson)) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    if (fs.existsSync(dir)) {
      fs.writeFileSync(dir + 'index.json', JSON.stringify(newLangsJson, null, 2))
      return true
    }
  }

  return false
}

prepareLangs()
