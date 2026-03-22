'use strict';

var
	_ = require('underscore'),

	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

	AddressUtils = {}
;

/**
 * Checks if specified email is correct.
 * 
 * @param {string} sValue String to check.
 * 
 * @return {boolean}
 */
AddressUtils.isCorrectEmail = function (sValue)
{
	// \p{L} matches a single code point in the category "letter"
	const regex = /^[0-9A-Z"!#$%^{}`~&'+-=_./]+@[0-9\p{L}.-]+$/iu;
	return !!(sValue.match(regex));
};

/**
 * @param {string} sName
 * @param {string} sEmail
 * @returns {string}
 */
AddressUtils.getFullEmail = function (sName, sEmail)
{
	var sFull = '';
	
	if (sEmail.length > 0)
	{
		if (sName.length > 0)
		{
			if (AddressUtils.isCorrectEmail(sName) || sName.indexOf(',') !== -1)
			{
				sFull = '"' + sName + '" <' + sEmail + '>';
			}
			else
			{
				sFull = sName + ' <' + sEmail + '>';
			}
		}
		else
		{
			sFull = sEmail;
		}
	}
	else
	{
		sFull = sName;
	}
	
	return sFull;
};

/**
 * Obtains Recipient-object which include "name", "email" and "fullEmail" fields from string.
 * 
 * @param {string} sFullEmail String includes only name, only email or both name and email.
 * @param {boolean} bIgnoreQuotesInName
 *
 * @return {Object}
 */
AddressUtils.getEmailParts = function (sFullEmail, bIgnoreQuotesInName)
{
	var
		iQuote1Pos = sFullEmail.indexOf('"'),
		iQuote2Pos = sFullEmail.indexOf('"', iQuote1Pos + 1),
		iLeftBrocketPos = sFullEmail.indexOf('<', iQuote2Pos),
		iPrevLeftBroketPos = -1,
		iRightBrocketPos = -1,
		sName = '',
		sEmail = ''
	;

	while (iLeftBrocketPos !== -1)
	{
		iPrevLeftBroketPos = iLeftBrocketPos;
		iLeftBrocketPos = sFullEmail.indexOf('<', iLeftBrocketPos + 1);
	}

	iLeftBrocketPos = iPrevLeftBroketPos;
	iRightBrocketPos = sFullEmail.indexOf('>', iLeftBrocketPos + 1);

	if (iLeftBrocketPos === -1)
	{
		sEmail = TextUtils.trim(sFullEmail);
	}
	else
	{
		iQuote1Pos = bIgnoreQuotesInName ? -1 : iQuote1Pos;
		sName = (iQuote1Pos === -1) ?
			TextUtils.trim(sFullEmail.substring(0, iLeftBrocketPos)) :
			TextUtils.trim(sFullEmail.substring(iQuote1Pos + 1, iQuote2Pos));

		sEmail = TextUtils.trim(sFullEmail.substring(iLeftBrocketPos + 1, iRightBrocketPos));
	}

	return {
		'name': sName,
		'email': sEmail,
		'fullEmail': AddressUtils.getFullEmail(sName, sEmail)
	};
};

/**
 * Obtains list of Recipient-objects which include "name", "email" and "fullEmail" fields from string.
 * 
 * @param {string} sRecipients Includes recipients, separated by separators.
 * @param {boolean} bIncludeLastIncorrectEmail If true, last recipient will be included to list, even if it is not correct email.
 * 
 * @returns {Array}
 */
AddressUtils.getArrayRecipients = function (sRecipients, bIncludeLastIncorrectEmail)
{
	var
		aSeparators = [',', ';', ' '],
		sStartRcp = '',
		sEndRcp = sRecipients,
		iPos = 0,
		iNextPos = 0,
		sFullEmail = '',
		oRecipient = null,
		aRecipients = []
	;
	
	while (sEndRcp.length > 0)
	{
		iPos = AddressUtils._getFirstSeparatorPosition(sEndRcp, aSeparators);
		iNextPos = iPos;
		
		while (_.indexOf(aSeparators, sEndRcp[iNextPos + 1]) !== -1)
		{
			iNextPos++;
		}
		
		if (iPos === -1)
		{
			sFullEmail = sStartRcp + sEndRcp;
			oRecipient = AddressUtils.getEmailParts(sFullEmail);
			if (bIncludeLastIncorrectEmail || AddressUtils.isCorrectEmail(oRecipient.email))
			{
				aRecipients.push(oRecipient);
			}
			sEndRcp = '';
		}
		else
		{
			sFullEmail = sStartRcp + sEndRcp.substring(0, iPos);
			oRecipient = AddressUtils.getEmailParts(sFullEmail);
			if (AddressUtils.isCorrectEmail(oRecipient.email))
			{
				aRecipients.push(oRecipient);
				sStartRcp = '';
			}
			else
			{
				sStartRcp += sEndRcp.substring(0, iNextPos + 1);
			}
			sEndRcp = sEndRcp.substring(iNextPos + 1);
		}
	}
	
	return aRecipients;
};

/**
 * Obtains position number of first separator-symbol in string. Available separator symbols are specified in array.
 * 
 * @param {string} sValue String for search separator-symbol in.
 * @param {Array} aSeparators List of separators.
 * @returns {number}
 */
AddressUtils._getFirstSeparatorPosition = function (sValue, aSeparators)
{
	var iPos = -1;

	_.each(aSeparators, function (sSep) {
		var iSepPos = sValue.indexOf(sSep);
		if (iSepPos !== -1 && (iPos === -1 || iSepPos < iPos))
		{
			iPos = iSepPos;
		}
	});

	return iPos;
};

/**
 * @param {string} sAddresses
 * 
 * @return {Array}
 */
AddressUtils.getIncorrectEmailsFromAddressString = function (sAddresses)
{
	var
		aEmails = sAddresses.replace(/"[^"]*"/g, '').replace(/;/g, ',').split(','),
		aIncorrectEmails = [],
		iIndex = 0,
		iLen = aEmails.length,
		sFullEmail = '',
		oEmailParts = null
	;

	for (; iIndex < iLen; iIndex++)
	{
		sFullEmail = TextUtils.trim(aEmails[iIndex]);
		if (sFullEmail.length > 0)
		{
			oEmailParts = AddressUtils.getEmailParts(TextUtils.trim(aEmails[iIndex]));
			if (!AddressUtils.isCorrectEmail(oEmailParts.email))
			{
				aIncorrectEmails.push(oEmailParts.email);
			}
		}
	}

	return aIncorrectEmails;
};

AddressUtils.getDomain = function (sEmail)
{
	var aParts = this.isCorrectEmail(sEmail) ? sEmail.split('@') : [''];
	return aParts[aParts.length - 1];
};

module.exports = AddressUtils;