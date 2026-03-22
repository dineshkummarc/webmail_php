'use strict';

var
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Popups = require('%PathToCoreWebclientModule%/js/Popups.js'),
	AlertPopup = require('%PathToCoreWebclientModule%/js/popups/AlertPopup.js'),
	
	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	FilesUtils = {}
;

/**
 * Gets link for download by hash.
 *
 * @param {string} sModuleName Name of module that owns the file.
 * @param {string} sHash Hash of the file.
 * @param {string} sPublicHash Hash of shared folder if the file is displayed by public link.
 * 
 * @return {string}
 */
FilesUtils.getDownloadLink = function (sModuleName, sHash, sPublicHash)
{
	return sHash.length > 0 ? '?/Download/' + sModuleName + '/DownloadFile/' + sHash + '/' + (sPublicHash ? '0/' + sPublicHash : '') : '';
};

/**
 * Gets link for view by hash in iframe.
 *
 * @param {number} iAccountId
 * @param {string} sUrl
 *
 * @return {string}
 */
FilesUtils.getIframeWrappwer = function (iAccountId, sUrl)
{
	return '?/Raw/Iframe/' + iAccountId + '/' + window.encodeURIComponent(sUrl) + '/';
};

FilesUtils.thumbQueue = (function () {

	var
		oImages = {},
		oImagesIncrements = {},
		iNumberOfImages = 2
	;

	return function (sImageSrc, fImageSrcObserver)
	{
		if(fImageSrcObserver)
		{
			if(!(sImageSrc in oImagesIncrements) || oImagesIncrements[sImageSrc] > 0) //load first images
			{
				if(!(sImageSrc in oImagesIncrements)) //on first image
				{
					oImagesIncrements[sImageSrc] = iNumberOfImages;
					oImages[sImageSrc] = [];
				}
				oImagesIncrements[sImageSrc]--;

				fImageSrcObserver(sImageSrc); //load image
			}
			else //create queue
			{
				oImages[sImageSrc].push({
					imageSrc: sImageSrc,
					imageSrcObserver: fImageSrcObserver
				});
			}
		}
		else //load images from queue (fires load event)
		{
			if(oImages[sImageSrc] && oImages[sImageSrc].length)
			{
				oImages[sImageSrc][0].imageSrcObserver(oImages[sImageSrc][0].imageSrc);
				oImages[sImageSrc].shift();
			}
		}
	};
}());

/**
 * @param {string} sFileName
 * @param {number} iSize
 * @returns {Boolean}
 */
FilesUtils.showErrorIfAttachmentSizeLimit = function (sFileName, iSize)
{
	var
		sWarning = TextUtils.i18n('%MODULENAME%/ERROR_UPLOAD_SIZE_DETAILED', {
			'FILENAME': sFileName,
			'MAXSIZE': TextUtils.getFriendlySize(UserSettings.AttachmentSizeLimit)
		})
	;
	
	if (UserSettings.AttachmentSizeLimit > 0 && iSize > UserSettings.AttachmentSizeLimit)
	{
		Popups.showPopup(AlertPopup, [sWarning]);
		return true;
	}
	
	return false;
};

module.exports = FilesUtils;
