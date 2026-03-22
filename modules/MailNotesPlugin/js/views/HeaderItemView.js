'use strict';

var
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
	CHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js'),

	PublicHeaderItem = new CHeaderItemView(TextUtils.i18n('%MODULENAME%/LABEL_FOLDER_NOTES'))
;

module.exports = PublicHeaderItem;
