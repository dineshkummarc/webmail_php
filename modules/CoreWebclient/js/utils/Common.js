'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),

	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),

	Utils = {}
;

require('jquery.easing');

/**
 * @param {(Object|null|undefined)} oContext
 * @param {Function} fExecute
 * @param {(Function|boolean|null)=} mCanExecute
 * @return {Function}
 */
Utils.createCommand = function (oContext, fExecute, mCanExecute)
{
	var
		fResult = fExecute ? function () {
			if (fResult.canExecute && fResult.canExecute())
			{
				return fExecute.apply(oContext, Array.prototype.slice.call(arguments));
			}
			return false;
		} : function () {}
	;

	if (ko.isObservable(mCanExecute))
	{
		fResult.canExecute = ko.computed(function () {
			return mCanExecute.call(oContext);
		});
	}
	else
	{
		if (mCanExecute === undefined)
		{
			mCanExecute = true;
		}
		fResult.canExecute = ko.computed(function () {
			return !!mCanExecute;
		});
	}

	return fResult;
};

Utils.isTextFieldFocused = function ()
{
	var
		mTag = document && document.activeElement ? document.activeElement : null,
		mTagName = mTag ? mTag.tagName : null,
		mTagType = mTag && mTag.type ? mTag.type.toLowerCase() : null,
		mContentEditable = mTag ? mTag.contentEditable : null
	;
	return ('INPUT' === mTagName && (mTagType === 'text' || mTagType === 'password' || mTagType === 'email' || mTagType === 'search')) ||
		'TEXTAREA' === mTagName || 'IFRAME' === mTagName || mContentEditable === 'true';
};

/**
 * @param {object} oEvent
 */
Utils.calmEvent  = function (oEvent)
{
	if (oEvent)
	{
		if (oEvent.stop)
		{
			oEvent.stop();
		}
		if (oEvent.preventDefault)
		{
			oEvent.preventDefault();
		}
		if (oEvent.stopPropagation)
		{
			oEvent.stopPropagation();
		}
		if (oEvent.stopImmediatePropagation)
		{
			oEvent.stopImmediatePropagation();
		}
		oEvent.cancelBubble = true;
		oEvent.returnValue = false;
	}
};

Utils.removeSelection = function ()
{
	if (window.getSelection)
	{
		window.getSelection().removeAllRanges();
	}
	else if (document.selection)
	{
		document.selection.empty();
	}
};

Utils.desktopNotify = (function ()
{
	var aNotifications = [];

	return function (oData) {
		var AppTab = require('%PathToCoreWebclientModule%/js/AppTab.js');
		var UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js')

		if (oData && UserSettings.AllowDesktopNotifications && window.Notification && !AppTab.focused())
		{
			switch (oData.action)
			{
				case 'show':
					if (window.Notification.permission !== 'denied')
					{
						// oData - action, body, dir, lang, tag, icon, callback, timeout
						var
							oOptions = { //https://developer.mozilla.org/en-US/docs/Web/API/Notification
								body: oData.body || '', //A string representing an extra content to display within the notification
								dir: oData.dir || 'auto', //The direction of the notification; it can be auto, ltr, or rtl
								lang: oData.lang || '', //Specify the lang used within the notification. This string must be a valid BCP 47 language tag
								tag: oData.tag || Math.floor(Math.random() * (1000 - 100) + 100), //An ID for a given notification that allows to retrieve, replace or remove it if necessary
								icon: oData.icon || false //The URL of an image to be used as an icon by the notification
							},
							oNotification,
							fShowNotification = function() {
								oNotification = new window.Notification(oData.title, oOptions); //Firefox and Safari close the notifications automatically after a few moments, e.g. 4 seconds.
								oNotification.onclick = function (oEv) { //there are also onshow, onclose & onerror events
									if(oData.callback)
									{
										oData.callback();
									}
									oNotification.close();
								};

								if (oData.timeout)
								{
									setTimeout(function() { oNotification.close(); }, oData.timeout);
								}
								aNotifications.push(oNotification);
							}
						;

						if (window.Notification.permission === 'granted')
						{
							fShowNotification();
						}
						else if (window.Notification.permission === 'default')
						{
							window.Notification.requestPermission(function (sPermission) {
								if(sPermission === 'granted')
								{
									fShowNotification();
								}
							});
						}
					}
					break;
				case 'hide':
					_.each(aNotifications, function (oNotifi, ikey) {
						if (oData.tag === oNotifi.tag)
						{
							oNotifi.close();
							aNotifications.splice(ikey, 1);
						}
					});
					break;
				case 'hideAll':
					_.each(aNotifications,function (oNotifi) {
						oNotifi.close();
					});
					aNotifications.length = 0;
					break;
			}
		}
	};
}());

/**
 * @param {string} sFile
 *
 * @return {string}
 */
Utils.getFileExtension = function (sFile)
{
	var
		sResult = '',
		iIndex = sFile.lastIndexOf('.')
	;

	if (iIndex > -1)
	{
		sResult = sFile.substr(iIndex + 1);
	}

	return sResult;
};

Utils.draggableItems = function ()
{
	return $('<div class="draggable"><div class="content"><span class="count-text"></span></div></div>').appendTo('#pSevenHidden');
};

Utils.uiDropHelperAnim = function (oEvent, oUi)
{
	var
		iLeft = 0,
		iTop = 0,
		iNewLeft = 0,
		iNewTop = 0,
		iWidth = 0,
		iHeight = 0,
		helper = oUi.helper.clone().appendTo('#pSevenHidden'),
		target = $(oEvent.target).find('.animGoal'),
		position = null
	;

	target = target[0] ? $(target[0]) : $(oEvent.target);
	position = target && target[0] ? target.offset() : null;

	if (position)
	{
		iLeft = window.Math.round(position.left);
		iTop = window.Math.round(position.top);

		iWidth = target.width();
		iHeight = target.height();

		iNewLeft = iLeft;
		if (0 < iWidth)
		{
			iNewLeft += window.Math.round(iWidth / 2);
		}

		iNewTop = iTop;
		if (0 < iHeight)
		{
			iNewTop += window.Math.round(iHeight / 2);
		}

		helper.animate({
			'left': iNewLeft + 'px',
			'top': iNewTop + 'px',
			'font-size': '0px',
			'opacity': 0
		}, 800, 'easeOutQuint', function() {
			$(this).remove();
		});
	}
};

/**
 * @param {string} sName
 * @return {boolean}
 */
Utils.validateFileOrFolderName = function (sName)
{
	return '' !== sName && !/["\/\\*?<>|:]/.test(sName);
};

/**
 * @param {string} sFile
 *
 * @return {string}
 */
Utils.getFileNameWithoutExtension = function (sFile)
{
	var
		sResult = sFile,
		iIndex = sFile.lastIndexOf('.')
	;
	if (iIndex > -1)
	{
		sResult = sFile.substr(0, iIndex);
	}
	return sResult;
};

/**
 * @param {Object} oElement
 * @param {Object} oItem
 */
Utils.defaultOptionsAfterRender = function (oElement, oItem)
{
	if (oItem && oItem.disable !== undefined)
	{
		ko.applyBindingsToNode(oElement, {
			'disable': !!oItem.disable
		}, oItem);
	}
};

/**
 * @param {string} dateFormat
 *
 * @return string
 */
Utils.getDateFormatForMoment = function (dateFormat)
{
	// 'MM/DD/YYYY' -> 'MM/DD/YYYY'
	// 'DD/MM/YYYY' -> 'DD/MM/YYYY'
	// 'DD Month YYYY' -> 'DD MMMM YYYY'
	return dateFormat.replace('Month', 'MMMM');
};

/**
 * @param {string} sUniqVal
 */
Utils.getHash = function (sUniqVal)
{
	var
		iHash = 0,
		iIndex = 0,
		iLen = sUniqVal.length
	;

	while (iIndex < iLen)
	{
		iHash  = ((iHash << 5) - iHash + sUniqVal.charCodeAt(iIndex++)) << 0;
	}

	return Types.pString(iHash);
};

/**
 * Disposes all observable properties of the object and destroys them along with all others.
 * After that, deletes the object reference from its parent so that the GC will free up memory.
 * @param {object} oParent
 * @param {mixed} mObjectKey
 */
Utils.destroyObjectWithObservables = function (oParent, mObjectKey)
{
	var oObject = oParent[mObjectKey];

	for (var mKey in oObject)
	{
		if (oObject[mKey] && _.isFunction(oObject[mKey].dispose))
		{
			oObject[mKey].dispose();
		}
		delete oObject[mKey];
	}

	delete oParent[mObjectKey];
};

Utils.getRandomHash = function (length)
{
	const sSymbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const iSymbolsLength = sSymbols.length;
	let sResult = '';
	length = typeof length === 'number' ? length : 10;

	if (window.crypto && window.crypto.getRandomValues) {
		const aRandomValues = new Uint32Array(length);
		window.crypto.getRandomValues(aRandomValues);
		aRandomValues.forEach((value) => {
			sResult += sSymbols.charAt(value % iSymbolsLength);
		});
	} else {
		for (let i = 0; i < length; i++) {
			sResult += sSymbols.charAt(Math.floor(Math.random() * iSymbolsLength));
		}
	}

	return sResult;
};

Utils.generateUUID = function ()
{
	if (window.crypto && window.crypto.getRandomValues) {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

module.exports = Utils;
