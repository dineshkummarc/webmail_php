'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),

	CAbstractScreenView = require('%PathToCoreWebclientModule%/js/views/CAbstractScreenView.js'),

	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js')
;

/**
 * View that is used as screen of the module. Inherits from CAbstractScreenView that has showing and hiding methods.
 * 
 * @constructor
 */
function CMainView()
{
	CAbstractScreenView.call(this, '%ModuleName%');

	// Text for displaying in browser title.
	this.browserTitle = ko.observable(TextUtils.i18n('%MODULENAME%/HEADING_BROWSER_TAB'));

	this.sFrameUrl = UrlUtils.getAppPath() + 'adminpanel';

	this.iframeDom = ko.observable(null);

	this.isLogoutStarted = false;
	this.isLogoutError = false;
	App.subscribeEvent('Logout', (params) => {
		if (this.isLogoutError) {
			// second logout is without attempt to logout from tenant adminpanel
			return;
		}
		if (this.isLogoutStarted) {
			// disable logout if we're waiting reply from iframe
			params.logoutPromises.push(new Promise((resolve, reject) => {
				reject();
			}));
			return;
		}
		params.logoutPromises.push(new Promise((resolve, reject) => {
			this.isLogoutStarted = true;
			if (this.iframeDom() && this.iframeDom().length > 0) {
				const loadingTimerId = setTimeout(() => {
					Screens.showLoading(TextUtils.i18n('%MODULENAME%/INFO_LOGOUT_FROM_ADMINPANEL'));
				}, 1000);

				const errorTimerId = setTimeout(() => {
					this.isLogoutError = true;
					Screens.hideLoading();
					Screens.showReport(TextUtils.i18n('%MODULENAME%/ERROR_CANNOT_LOGOUT_FROM_ADMINPANEL'), 0);
					$('.report_panel.report a').attr('href', this.sFrameUrl).on('click', () => {
						resolve();
					});
				}, 10000);

				window.addEventListener('message', function(event) {
					if (event && event.origin === window.location.origin && event.data &&
							event.data.eventName === 'after-logout'
					) {
						Screens.hideLoading();
						clearTimeout(loadingTimerId);
						clearTimeout(errorTimerId);
						resolve();
					}
				});

				
				this.iframeDom()[0].contentWindow.postMessage({
					eventName: 'logout'
				}, window.location.origin);
			} else {
				resolve();
			}
		}));
	});

	App.broadcastEvent('%ModuleName%::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CMainView.prototype, CAbstractScreenView.prototype);

CMainView.prototype.ViewTemplate = '%ModuleName%_MainView';
CMainView.prototype.ViewConstructorName = 'CMainView';

CMainView.prototype.handleBeforeLogoutAndLogout = function (continueLogout) {
	console.log('handleBeforeLogoutAndLogout', this.iframeDom());
	if (this.iframeDom() && this.iframeDom().length > 0) {
		this.iframeDom()[0].contentWindow.postMessage({
			eventName: 'logout'
		}, '*');

		window.addEventListener('message', function(oEvent) {
			console.log({oEvent});
			if (oEvent && oEvent.data && oEvent.data.eventName === 'after-logout') {
				continueLogout();
			}
		});
	}
};

module.exports = new CMainView();
