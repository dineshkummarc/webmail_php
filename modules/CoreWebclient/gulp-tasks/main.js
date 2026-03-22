/* eslint-disable */

// import { createApp } from 'vue'
// import App from './App.vue'
// import { Quasar } from 'quasar'
// import quasarUserOptions from './quasar-user-options'

// createApp(App).use(Quasar, quasarUserOptions).mount('#app')

import $ from 'jquery'
import _ from 'underscore'
import 'core-js'
import 'regenerator-runtime/runtime'
import utils from './utils'

require('/modules/CoreWebclient/js/vendors/jquery.cookie.js');

$(function () {
	window.isPublic = false;
	window.isNewTab = false;

	const templatesPromise = new Promise((resolve, reject) => {
		utils.sendRequest('CoreWebclient', 'GetTemplates', {}, function (res) {
			if (res.responseJSON?.ErrorCode) {
				reject(new Error(res.responseJSON?.ErrorCode))
			} else {
				resolve(res.responseJSON?.Result)
			}
		});
	})

	const translationPromise = new Promise((resolve, reject) => {
		utils.sendRequest('CoreWebclient', 'GetTranslation', {}, function (res) {
			if (res.responseJSON?.ErrorCode) {
				reject(new Error(res.responseJSON?.ErrorCode))
			} else {
				resolve(res.responseJSON?.Result)
			}
		});
	})

	const appDataPromise = new Promise((resolve, reject) => {
		utils.sendRequest('Core', 'GetAppdata', {}, function (res) {
			if (res.responseJSON?.ErrorCode) {
				reject(new Error(res.responseJSON?.ErrorCode))
			} else {
				resolve(res.responseJSON?.Result)
			}
		});
	})

	Promise.all([templatesPromise, translationPromise, appDataPromise]).then((aData) => {
		//appending knockout templates
		document.getElementById('pSevenHidden').insertAdjacentHTML('afterend', aData[0])

		// setting translations
		window.auroraI18n = JSON.parse(aData[1])

		window.auroraAppData = aData[2]
		window.aAvailableModules = aData[2].Core.AvailableClientModules
		window.aAvailableBackendModules = aData[2].Core.AvailableBackendModules

		// loading the precompiled css.
		// Less watcher can be run in parallel.
		if (window.auroraAppData?.CoreWebclient?.Theme) {
			require('/static/styles/libs/libs.css')
			require(`/static/styles/themes/${window.auroraAppData?.CoreWebclient?.Theme}/styles.css`)
		}

		const oAvailableModules = {}

		window.aAvailableModules.forEach(function(sModuleName) {
			oAvailableModules[sModuleName] = import(`/modules/${sModuleName}/js/manager.js`).then(module => module.default);
		})
	
		Promise.all(_.values(oAvailableModules))
			.then(aModules => {
				const ModulesManager = require('/modules/CoreWebclient/js/ModulesManager.js')
				const App = require('/modules/CoreWebclient/js/App.js')
				const bSwitchingToMobile = App.checkMobile()
				
				if (!bSwitchingToMobile) {
					if (window.isPublic) {
						App.setPublic()
					}
					if (window.isNewTab) {
						App.setNewTab()
					}
					
					ModulesManager.init(_.object(_.keys(oAvailableModules), aModules), window.auroraAppData)
					App.init()
				}
			})
			.catch(function (oError) { console.error('An error occurred while loading the component:'); console.error(oError); });
	})	
});

