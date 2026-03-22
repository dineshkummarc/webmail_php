'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	
	AddressUtils = require('%PathToCoreWebclientModule%/js/utils/Address.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js')
;

/**
 * 
 * @param {object} oRequest
 * @param {function} fResponse
 * @param {string} storage
 * @param {boolean} addContactGroups
 * @param {boolean} addUserGroups
 * @param {string} exceptEmail
 * @param {boolean} addEmailsToGroups
 * @returns {undefined}
 */
function Callback(oRequest, fResponse, {storage = 'all', addContactGroups = false,
					addUserGroups = false, exceptEmail = '', addEmailsToGroups = false, useEmailAsValues = false, withoutEmptyEmails = false})
{
	var
		sTerm = oRequest.term,
		oParameters = {
			'Search': sTerm,
			'Storage': storage,
			'SortField': Enums.ContactSortField.Frequency,
			'SortOrder': 1,
			'WithGroups': addContactGroups,
			'WithUserGroups': addUserGroups,
			'WithoutTeamContactsDuplicates': true
		}
	;

	Ajax.send('GetContactSuggestions', oParameters, function (oResponse) {
		var aList = [];
		if (oResponse && oResponse.Result && oResponse.Result.List)
		{
			aList = _.map(oResponse.Result.List, function (oItem) {
				if (oItem.IsGroup && oItem.Name) {
					if (!oItem.Emails && withoutEmptyEmails) {
						return null;
					}
					return {
						label: addEmailsToGroups ? `${oItem.Name} (${oItem.Emails})` : oItem.Name,
						value: addEmailsToGroups ? oItem.Emails : oItem.Name,
						name: oItem.Name,
						email: addEmailsToGroups ? oItem.Emails : oItem.Name,
						groupId: oItem.Id,
						isUserGroup: true,
						isAllUsersGroup: oItem.IsAll
					};
				}
				var
					sValue = oItem.ViewEmail,
					sLabel = ''
				;
				if (!useEmailAsValues && oItem.FullName && 0 < $.trim(oItem.FullName).length)
				{
					if (oItem.ForSharedToAll)
					{
						sValue = oItem.FullName;
					}
					else if (oItem.IsGroup)
					{
						sLabel = `${oItem.FullName} (${oItem.ViewEmail})`;
						sValue = oItem.ViewEmail;
					}
					else
					{
						sValue = ('"' + oItem.FullName + '" <' + oItem.ViewEmail + '>');
					}
				}
				if (oItem && ((oItem.ViewEmail && oItem.ViewEmail !== exceptEmail) || (!oItem.ViewEmail && !withoutEmptyEmails))) {
					return {
						label: sLabel ? sLabel : sValue,
						value: sValue,
						name: oItem.FullName,
						email: oItem.ViewEmail,
						frequency: oItem.Frequency,
						id: oItem.UUID,
						storage: oItem.Storage,
						uuid: oItem.UUID,
						team: oItem.Storage === 'team',
						sharedToAll: oItem.Storage === 'shared',
						hasKey: oItem.HasPgpPublicKey,
						encryptMessage: oItem.PgpEncryptMessages,
						signMessage: oItem.PgpSignMessages,
						isContactGroup: oItem.IsGroup
					};
				}
				return null;
			});

			aList = aList.filter(item => item);
			aList = _.sortBy(_.compact(aList), function(oItem){
				return -oItem.frequency;
			});
		}
		fResponse(aList);
	});
}

/**
 * @param {Object} oContact
 */
function DeleteHandler(oContact)
{
	Ajax.send('UpdateContact', { 'Contact': { 'UUID': oContact.id, 'Frequency': -1, 'Storage': oContact.storage } });
}

module.exports = {
	callback: Callback,
	deleteHandler: DeleteHandler
};
