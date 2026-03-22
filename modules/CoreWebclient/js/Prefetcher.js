'use strict';

var
	_ = require('underscore'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	
	Settings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	ModulesPrefetchers = ModulesManager.getModulesPrefetchers(),
	Prefetcher = {},
	bServerInitializationsDone = false
;

Prefetcher.start = function ()
{
	if (App.getUserRole() !== Enums.UserRole.Anonymous && !App.isNewTab() && !Ajax.hasInternetConnectionProblem() && !Ajax.hasOpenedRequests())
	{
		Prefetcher.prefetchAll();
	}
};

Prefetcher.prefetchAll = function ()
{
	var bPrefetchStarted = this.doServerInitializations();
	
	_.each(ModulesPrefetchers, function (oModulePrefetcher) {
		if (!bPrefetchStarted)
		{
			if (Settings.AllowPrefetch && _.isFunction(oModulePrefetcher.startAll))
			{
				bPrefetchStarted = oModulePrefetcher.startAll();
			}
			else if (_.isFunction(oModulePrefetcher.startMin))
			{
				bPrefetchStarted = oModulePrefetcher.startMin();
			}
		}
	});
};

Prefetcher.doServerInitializations = function ()
{
	if (App.getUserRole() !== Enums.UserRole.Anonymous && !App.isNewTab() && !App.isPublic() && !bServerInitializationsDone)
	{
		Ajax.send('Core', 'DoServerInitializations', {});
		
		bServerInitializationsDone = true;
		
		return true;
	}
	
	return false;
};

Ajax.registerOnAllRequestsClosedHandler(function () {
	Prefetcher.start();
});
