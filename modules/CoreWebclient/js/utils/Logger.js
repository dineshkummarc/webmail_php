var
	_ = require('underscore'),
	moment = require('moment'),

	UserSettings = require('%PathToCoreWebclientModule%/js/Settings.js'),

	Logger = {}
;

Logger.log = (function () {
	if (UserSettings.AllowClientDebug)
	{
		window.auroraLogs = [];

		return function () {
			var aNewRow = [];

			aNewRow.unshift(moment().format('DD.MM, HH:mm:ss'));
			_.each(arguments, function (mArg) {
				aNewRow.push(mArg);
			});

			if (window.auroraLogs.length > 100)
			{
				window.auroraLogs.shift();
			}

			window.auroraLogs.push(aNewRow);
		};
	}
	else
	{
		return function () {};
	}
}());

module.exports = Logger;