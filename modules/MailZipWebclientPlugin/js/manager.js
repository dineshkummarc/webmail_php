'use strict';

module.exports = function (appData) {
	const
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		isZipAllowed = appData['%ModuleName%'] ? !!appData['%ModuleName%'].AllowZip : false
	;

	if (isZipAllowed && App.isUserNormalOrTenant()) {
		const AttachmentUtils = require('modules/%ModuleName%/js/utils/Attachment.js');
		return {
			start: function (ModulesManager) {
				App.subscribeEvent('MailWebclient::CopyFileProperties::after', function (params) {
					if (params) {
						AttachmentUtils.copyProperties(params);
					}
				});

				App.subscribeEvent('MailWebclient::ParseFile::after', function (file) {
					AttachmentUtils.parse(file);
				});

				App.subscribeEvent('MailWebclient::AddAllAttachmentsDownloadMethod', function (fAddAllAttachmentsDownloadMethod) {
					fAddAllAttachmentsDownloadMethod(AttachmentUtils.getAllAttachmentsDownloadMethod());
				});
			}
		};
	}

	return null;
};
