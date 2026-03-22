const fs = require('fs')

function prepareModules() {
  const modulesPath = './src/../../../'
  const managersPaths = []
  fs.readdirSync(modulesPath).forEach(sModuleName => {
    let vueManagerPath = modulesPath + sModuleName + '/vue/manager.js'
    if (fs.existsSync(vueManagerPath)) {
      vueManagerPath = vueManagerPath.slice(2)
      vueManagerPath = vueManagerPath.slice(0, -3)
      managersPaths.push('      await import(\'' + vueManagerPath + '\'),')
    }
  })

  const dir = './src/'
  if (fs.existsSync(dir)) {
    const paths = managersPaths.join('\n')
    const modulesContent =
      `export default {
  async getModules () {
    return [
      await import('src/manager'),
${paths}
    ]
  },
}
`
    fs.writeFileSync(dir + 'modules.js', modulesContent)
  }
}

prepareModules()
