'use strict';

var $ = require('jquery');

/**
 * Object for saving and restoring data in local storage or cookies.
 * 
 * @constructor
 */
function CStorage()
{
	this.bHtml5 = true;
	
	this.init();
}

/**
 * Returns **true** if data with specified key exists in the storage.
 * 
 * @param {string} sKey
 * @returns {boolean}
 */
CStorage.prototype.hasData = function (sKey)
{
	var sValue = this.bHtml5 ? localStorage.getItem(sKey) : $.cookie(sKey);
	
	return !!sValue;
};

/**
 * Returns value of data with specified key from the storage.
 * 
 * @param {string} sKey
 * @returns {string|number|Object}
 */
CStorage.prototype.getData = function (sKey)
{
	var
		sValue = this.bHtml5 ? localStorage.getItem(sKey) : $.cookie(sKey),
		oResult = ''
	;
	
	try
	{
		oResult = $.parseJSON(sValue);
	}
	catch (oException)
	{
	}
	return oResult;
};

/**
 * Sets value of data with specified key to the storage.
 * 
 * @param {string} sKey
 * @param {string|number|Object} mValue
 */
CStorage.prototype.setData = function (sKey, mValue)
{
	var sValue = JSON.stringify(mValue);
	
	if (this.bHtml5)
	{
		localStorage.setItem(sKey, sValue);
	}
	else
	{
		$.cookie(sKey, sValue, { expires: 30 });
	}
};

/**
 * Removes data with specified key from the storage.
 * 
 * @param {srting} sKey
 */
CStorage.prototype.removeData = function (sKey)
{
	if (this.bHtml5)
	{
		localStorage.removeItem(sKey);
	}
	else
	{
		$.cookie(sKey, null);
	}
};

/**
 * Initializes the object for work with local storage or cookie.
 */
CStorage.prototype.init = function ()
{
	if (typeof Storage === 'undefined')
	{
		this.bHtml5 = false;
	}
	else
	{
		try
		{
			localStorage.setItem('aurora_core_check', 'aurora');
			localStorage.removeItem('aurora_core_check');
		}
		catch (err)
		{
			this.bHtml5 = false;
		}
	}
};

CStorage.prototype.replaceStorageDataKey = function(oldKey, newKey) {
	let data = this.getData(oldKey);
	if (data) {
		this.removeData(oldKey);
		if (oldKey === 'MessageDetailsVisible') {
			data = data === '1';
		}
		if (newKey) {
			this.setData(newKey, data);
		}
	}
};

CStorage.prototype.convertStorageData = function(userId, AccountList) {
	const convertMap = [
		{ old: 'showNewTimezone', new: 'aurora_core_browser-timezone' },
		{ old: 'folderAccordionCleared', new: '' },
		{ old: 'message_listResizerWidth', new: 'aurora_mail_resizer-width' },
		{ old: 'folder_2pane_listResizerWidth', new: 'aurora_mail_hr_folders_resizer-width' },
		{ old: 'message_2pane_listResizerWidth', new: 'aurora_mail_hr_messages_resizer-width' },
		{ old: 'compose_attachmentsResizerWidth', new: 'aurora_mail_compose_resizer-width' },
		{ old: 'contact_listResizerWidth', new: 'aurora_contacts_resizer-width' },
		{ old: 'files_listResizerWidth', new: 'aurora_files_resizer-width' },
		{ old: 'files_list1ResizerWidth', new: 'aurora_files_preview_resizer-width' },
		{ old: 'calendarResizerWidth', new: 'aurora_calendar_resizer-width' },
		{ old: 'tasks_listResizerWidth', new: 'aurora_tasks_resizer-width' },
		{ old: 'sendersExpanded', new: 'aurora_custom_senders-expanded' },
		{ old: 'moveMessagesHistoryData', new: 'aurora_custom_move-messages-history-data' },
		{ old: 'MailtoAsked', new: 'aurora_mail_is-mailto-asked' },
		{ old: 'MessageDetailsVisible', new: 'aurora_mail_is-message-details-visible' }
	];

	convertMap.forEach(dataKeys => {
		this.replaceStorageDataKey(dataKeys.old, dataKeys.new);
	});

	this.replaceStorageDataKey(`user_${userId}_cryptoKeyEncrypted`, `aurora_paranoid_user_${userId}_encrypted-crypto-key`);
	this.replaceStorageDataKey(`user_${userId}_public-keys`, `aurora_openpgp_user_${userId}_public-keys`);
	this.replaceStorageDataKey(`user_${userId}_private-keys`, `aurora_openpgp_user_${userId}_private-keys`);

	if (AccountList) {
		this.replaceStorageDataKey('folderAccordion', `aurora_mail_account_${AccountList.currentId()}_expanded-folders`);
		AccountList.collection().forEach(account => {
			this.replaceStorageDataKey(`customSenderList-${account.id()}`, `aurora_custom_account_${account.id()}_sender-list`);
		});
	}
};

module.exports = new CStorage();
