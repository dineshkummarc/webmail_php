'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @constructor
 */
function CSecuritySettingsFormView()
{
	CAbstractSettingsFormView.call(this);
	
	this.visibleHeading = ko.observable(true);
	this.securitySections = ko.observableArray([]);
	this.hideSecuritySiblings = ko.observable(false);
}

_.extendOwn(CSecuritySettingsFormView.prototype, CAbstractSettingsFormView.prototype);

CSecuritySettingsFormView.prototype.ViewTemplate = '%ModuleName%_SecuritySettingsFormView';

CSecuritySettingsFormView.prototype.registerTabSection = function (fGetSectionView, sModuleName)
{
	const oSection = fGetSectionView();
	oSection.sSsecurityModuleName = sModuleName;
	oSection.bSecurityScreenEmbeded = true;
	oSection.securityVisibleSection = ko.observable(true);

	if (ko.isObservable(oSection.subPage))
	{
		oSection?.visibleHeading(false);

		oSection.subPage.subscribe(function (v) {
			oSection?.visibleHeading(v);
			this.visibleHeading(!v);

			_.each(this.securitySections(), function (oItem) {
				const bHideSection = v ? oItem.sSsecurityModuleName === oSection.sSsecurityModuleName : true;
				oItem.securityVisibleSection(bHideSection);
			})
		}, this);
	}

	this.securitySections().push(oSection);
	var iLastIndex = Settings.ModulesOrder.length;
	this.securitySections(_.sortBy(this.securitySections(), function (oSection) {
		var iIndex = _.indexOf(Settings.ModulesOrder, oSection.sModuleName);
		return iIndex !== -1 ? iIndex : iLastIndex;
	}));
};

CSecuritySettingsFormView.prototype.onShow = function ()
{
	_.each(this.securitySections(), function (oSection) {
		if (_.isFunction(oSection.onShow)) {
			oSection.onShow();
		}
	});
};

module.exports = new CSecuritySettingsFormView();
