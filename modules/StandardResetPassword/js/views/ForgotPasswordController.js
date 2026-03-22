'use strict';

var Settings = require('modules/%ModuleName%/js/Settings.js');

/**
 * @constructor
 */
function CForgotPasswordController()
{
	this.sResetPasswordHash = '#' + Settings.HashModuleName;
}

CForgotPasswordController.prototype.ViewTemplate = '%ModuleName%_ForgotPasswordController';

module.exports = new CForgotPasswordController();
