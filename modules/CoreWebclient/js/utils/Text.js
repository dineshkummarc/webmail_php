'use strict';

var	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	Settings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	TextUtils = {}
;

TextUtils.trim = function (text = '')
{
	return typeof text === 'string' ? text.trim() : '';
};

TextUtils.isHtml = function (text = '')
{
	// Alternative way
	// var doc = new DOMParser().parseFromString(text, "text/html");
	// return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
	
	// checking for tags (including closing ones) with names that consist of letters and dashes only
	return /<\/?[a-zA-Z-]+(?:\s|\s[^>]+|\S)?>/i.test(text)
};

/**
 * Converts plaintext to HTML text.
 * @param {string} text
 * @param {boolean} prepareLinks
 * @returns {string}
 */
TextUtils.plainToHtml = function (text = '', prepareLinks = false)
{
	let html = text.toString()
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;')
			.replaceAll('&gt;', ' &gt;') /* whitespace is required to separate encoded > from the end of a link */
	;

	if (prepareLinks) {
		//URLs starting with http://, https://, or ftp://
		const replacePattern1 = /(\b(?:https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		html = html.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

		//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		html = html.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

		//Change email addresses to mailto:: links.
		const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
		html = html.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
	}

	/* removing spaces befor &gt; that where added on purpose */
	html = html.replaceAll(' &gt;', '&gt;'); 

	return html.replace(/\r/g, '').replace(/\n/g, '<br />');
};

/**
 * Converts HTML text to plaintext.
 * @param {string} html
 * @returns {string}
 */
TextUtils.htmlToPlain = function(html = '') {
	return html.toString()
		.replace(/([^>]{1})<div>/gi, '$1\n')
		.replace(/<style[^>]*>[^<]*<\/style>/gi, '\n')
		.replace(/<br *\/{0,1}>/gi, '\n')
		.replace(/<\/p>/gi, '\n')
		.replace(/<\/div>/gi, '\n')
		.replace(/<a [^>]*href="([^"]*?)"[^>]*>(.*?)<\/a>/gi, '$2')
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
	;
};

/**
 * @param {string} sText
 * 
 * @return {string}
 */
TextUtils.encodeHtml = function (sText)
{
	return (sText) ? sText.toString()
		.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;').replace(/'/g, '&#039;') : '';
};

/**
 * @param {string} sHtml
 * @returns {Boolean}
 */
TextUtils.htmlStartsWithBlockquote = function (sHtml)
{
	var
		aParts = sHtml.split('<blockquote'),
		sBegin = aParts.length > 0 ? aParts[0] : '',
		sBeginWithoutTags = TextUtils.trim(sBegin.replace(/<[^>]*>/g, ''))
	;
	
	return sBeginWithoutTags === '';
};


/**
 * @param {string} sKey
 * @param {?Object=} oValueList
 * @param {?string=} sDefaultValue
 * @param {number=} iPluralCount
 * 
 * @return {string}
 */
TextUtils.i18n = function (sKey, oValueList, sDefaultValue, iPluralCount) {
	var
		sValueName = '',
		sResult = Types.isNonEmptyString(sDefaultValue) ? sDefaultValue : sKey,
		I18n = window.auroraI18n
	;
	
	if (Types.isNonEmptyString(sKey))
	{
		if (Types.isNonEmptyString(I18n[sKey]))
		{
			sResult = I18n[sKey];
		}
		else
		{
			sKey = sKey.replace(('MobileWebclient').toUpperCase(), ('Webclient').toUpperCase());
			if (Types.isNonEmptyString(I18n[sKey]))
			{
				sResult = I18n[sKey];
			}
		}
	}
	
	if (Types.isNumber(iPluralCount))
	{
		sResult = (function (iPluralCount, sResult) {
			var
				nPlural = TextUtils.getPlural(Settings.Language, iPluralCount),
				aPluralParts = sResult.split('|')
			;

			return (aPluralParts && aPluralParts[nPlural]) ? aPluralParts[nPlural] : (
				aPluralParts && aPluralParts[0] ? aPluralParts[0] : sResult);

		}(iPluralCount, sResult));
	}

	if (oValueList)
	{
		for (sValueName in oValueList)
		{
			if (oValueList.hasOwnProperty(sValueName))
			{
				var reg = new RegExp('%' + sValueName + '%', 'g');
				sResult = sResult.replace(reg, oValueList[sValueName]);
			}
		}
	}

	return sResult;
};

/**
 * http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms
 * 
 * @param {string} sLang
 * @param {number} iNumber
 * 
 * @return {number}
 */
TextUtils.getPlural = function (sLang, iNumber)
{
	var iResult = 0;
	iNumber = Types.pInt(iNumber);

	switch (sLang)
	{
		case 'Arabic':
			iResult = (iNumber === 0 ? 0 : iNumber === 1 ? 1 : iNumber === 2 ? 2 : iNumber % 100 >= 3 && iNumber % 100 <= 10 ? 3 : iNumber % 100 >= 11 ? 4 : 5);
			break;
		case 'Bulgarian':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Chinese-Simplified':
			iResult = 0;
			break;
		case 'Chinese-Traditional':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Czech':
			iResult = (iNumber === 1) ? 0 : (iNumber >= 2 && iNumber <= 4) ? 1 : 2;
			break;
		case 'Danish':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Dutch':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'English':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Estonian':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Finnish':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'French':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'German':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Greek':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Hebrew':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Hungarian':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Italian':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Japanese':
			iResult = 0;
			break;
		case 'Korean':
			iResult = 0;
			break;
		case 'Latvian':
			iResult = (iNumber % 10 === 1 && iNumber % 100 !== 11 ? 0 : iNumber !== 0 ? 1 : 2);
			break;
		case 'Lithuanian':
			iResult = (iNumber % 10 === 1 && iNumber % 100 !== 11 ? 0 : iNumber % 10 >= 2 && (iNumber % 100 < 10 || iNumber % 100 >= 20) ? 1 : 2);
			break;
		case 'Norwegian':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Persian':
			iResult = 0;
			break;
		case 'Polish':
			iResult = (iNumber === 1 ? 0 : iNumber % 10 >= 2 && iNumber % 10 <= 4 && (iNumber % 100 < 10 || iNumber % 100 >= 20) ? 1 : 2);
			break;
		case 'Portuguese-Portuguese':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Portuguese-Brazil':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Romanian':
			iResult = (iNumber === 1 ? 0 : (iNumber === 0 || (iNumber % 100 > 0 && iNumber % 100 < 20)) ? 1 : 2);
			break;
		case 'Russian':
			iResult = (iNumber % 10 === 1 && iNumber % 100 !== 11 ? 0 : iNumber % 10 >= 2 && iNumber % 10 <= 4 && (iNumber % 100 < 10 || iNumber % 100 >= 20) ? 1 : 2);
			break;
		case 'Slovenian':
			iResult = ((iNumber % 10 === 1 && iNumber % 100 !== 11) ? 0 : ((iNumber % 10 === 2 && iNumber % 100 !== 12) ? 1 : 2));
			break;
		case 'Serbian':
			iResult = (iNumber % 10 === 1 && iNumber % 100 !== 11 ? 0 : iNumber % 10 >= 2 && iNumber % 10 <= 4 && (iNumber % 100 < 10 || iNumber % 100 >= 20) ? 1 : 2);
			break;
		case 'Spanish':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Swedish':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Thai':
			iResult = 0;
			break;
		case 'Turkish':
			iResult = (iNumber === 1 ? 0 : 1);
			break;
		case 'Ukrainian':
			iResult = (iNumber % 10 === 1 && iNumber % 100 !== 11 ? 0 : iNumber % 10 >= 2 && iNumber % 10 <= 4 && (iNumber % 100 < 10 || iNumber % 100 >= 20) ? 1 : 2);
			break;
		case 'Vietnamese':
			iResult = 0;
			break;
		default:
			iResult = 0;
			break;
	}

	return iResult;
};

/**
 * Convert string in CamelCase format to dash-separated
 * 
 * @param {string} sName
 * @returns {string}
 */

TextUtils.getUrlFriendlyName = function (sName)
{
	return sName.replace(/([A-Z])/g, '-$1').replace(/(^-)/g, '').replace(/\s+/g, '-').replace(/-{2,}/g, '-').toLowerCase();
};

/**
 * @param {(number|string)} iSizeInBytes
 * 
 * @return {string}
 */
TextUtils.getFriendlySize = function (iSizeInBytes)
{
	var
		iBytesInKb = 1024,
		iBytesInMb = iBytesInKb * iBytesInKb,
		iBytesInGb = iBytesInKb * iBytesInKb * iBytesInKb
	;

	iSizeInBytes = Types.pInt(iSizeInBytes);

	if (iSizeInBytes >= iBytesInGb)
	{
		return Types.roundNumber(iSizeInBytes / iBytesInGb, 1) + TextUtils.i18n('%MODULENAME%/LABEL_GIGABYTES');
	}
	else if (iSizeInBytes >= iBytesInMb)
	{
		return Types.roundNumber(iSizeInBytes / iBytesInMb, 1) + TextUtils.i18n('%MODULENAME%/LABEL_MEGABYTES');
	}
	else if (iSizeInBytes >= iBytesInKb)
	{
		return Types.roundNumber(iSizeInBytes / iBytesInKb, 0) + TextUtils.i18n('%MODULENAME%/LABEL_KILOBYTES');
	}

	return iSizeInBytes + TextUtils.i18n('%MODULENAME%/LABEL_BYTES');
};

module.exports = TextUtils;
