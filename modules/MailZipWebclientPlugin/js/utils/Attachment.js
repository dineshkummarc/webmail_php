'use strict';

const
	ko = require('knockout'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	UrlUtils = require('%PathToCoreWebclientModule%/js/utils/Url.js'),

	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js')
;

function getActionData(file) {
	return {
		Text: ko.computed(function () {
			if (this.subFilesExpanded()) {
				return TextUtils.i18n('COREWEBCLIENT/ACTION_COLLAPSE_FILE');
			}
			if (this.mailzipSubFilesLoading()) {
				return TextUtils.i18n('COREWEBCLIENT/INFO_LOADING');
			}
			return TextUtils.i18n('COREWEBCLIENT/ACTION_EXPAND_FILE');
		}, file),
		Handler: function () {
			if (!this.mailzipSubFilesLoading()) {
				if (this.subFilesExpanded()) {
					this.subFilesExpanded(false);
				} else {
					this.mailzipExpandFile();
				}
			}
		}.bind(file)
	};
}

module.exports = {
	parse(file) {
		if (file && typeof file.addAction === 'function' && file.extension() === 'zip') {
			file.mailzipSubFilesLoaded = ko.observable(false);
			file.mailzipSubFilesLoading = ko.observable(false);
			file.mailzipExpandFile = function () {
				if (!this.mailzipSubFilesLoaded() && !this.mailzipSubFilesLoading()) {
					this.mailzipSubFilesLoading(true);
					Ajax.send('%ModuleName%', 'ExpandFile', { 'Hash': this.hash() }, function (response) {
						this.mailzipSubFilesLoading(false);
						const subFilesData = response.Result && Array.isArray(response.Result.Files) ? response.Result.Files : [];
						const subFiles = [];
						subFilesData.forEach((fileData) => {
							const subFile = file.getNewInstance();
							subFile.parse(fileData);
							subFiles.push(subFile);
						});
						this.subFiles(subFiles);
						this.mailzipSubFilesLoaded(true);
						this.subFilesExpanded(true);
					}, this);
				} else {
					this.subFilesExpanded(true);
				}
			};

			file.removeAction('view');
			file.addAction('expand', true, getActionData(file));
		}
	},

	copyProperties({ file, source }) {
		if (file && typeof file.addAction === 'function' && file.extension() === 'zip') {
			file.mailzipSubFilesLoaded = ko.observable(source.mailzipSubFilesLoaded());
			file.mailzipSubFilesLoading = ko.observable(source.mailzipSubFilesLoading());
			file.mailzipExpandFile = source.mailzipExpandFile.bind(file);

			file.removeAction('expand');
			file.addAction('expand', true, getActionData(file));
		}
	},

	getAllAttachmentsDownloadMethod() {
		return {
			Text: TextUtils.i18n('%MODULENAME%/ACTION_DOWNLOAD_ATTACHMENTS_ZIP'),
			Handler: function (accountId, hashes) {
				Screens.showLoading(TextUtils.i18n('COREWEBCLIENT/INFO_LOADING'));
				Ajax.send('%ModuleName%', 'SaveAttachments', {
					AccountID: accountId,
					Attachments: hashes
				}, function (response) {
					Screens.hideLoading();
					if (response.Result && response.Result.Actions && response.Result.Actions.download) {
						var sDownloadLink = response.Result.Actions.download.url;
						UrlUtils.downloadByUrl(sDownloadLink);
					} else {
						Api.showErrorByCode(response);
					}
				});
			}
		};
	}
};
