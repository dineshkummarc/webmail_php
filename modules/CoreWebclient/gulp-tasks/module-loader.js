module.exports = function (sSourceCode) {
	this.cacheable();

	var
		aPath = this.resourcePath.split(/[\/\\]{1}modules[\/\\]{1}/),
		aPath2 = aPath[1] && aPath[1].split(/[\/\\]{1}/),
		sModule = aPath2 && aPath2[0]
	;
	
	if (sModule)
	{
		sSourceCode = sSourceCode
					.replace(new RegExp('%ModuleName%', 'g'), sModule)
					.replace(new RegExp('%MODULENAME%', 'g'), sModule.toUpperCase())
					.replace(new RegExp('%PathToCoreWebclientModule%', 'g'), '/modules/CoreWebclient')
					.replace(new RegExp('([\'"])modules\/', 'g'), '$1/modules/')
	}

	return sSourceCode;
};
