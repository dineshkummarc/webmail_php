const
	_ = require('underscore'),
	log = require('fancy-log'),
	fs = require('fs'),
	ncp = require('ncp').ncp,
	mkdirp = require('mkdirp'),
	chokidar = require('chokidar'),
	less = require('less'),
	aThemes = process.env.npm_config_themes ? process.env.npm_config_themes.split(',') : [],
	sTenantName = process.env.npm_config_tenant,
	sTenantPathPrefix = sTenantName ? 'tenants/' + sTenantName + '/' : '',
	sPathToCoreWebclient = 'modules/CoreWebclient',
	crlf = '\n'
;

let 
	aModulesNames = [],
	aModulesWatchPaths = []
;

aModulesNames = fs.readdirSync('./modules/');

aModulesNames.forEach(function (sModuleName) {
	if (fs.existsSync('./modules/' + sModuleName + '/styles/styles.less') || fs.existsSync('./modules/' + sModuleName + '/styles/styles-mobile.less'))
	{
		aModulesWatchPaths.push('./modules/' + sModuleName + '/styles/**/*.less');
	}
});

function BuildLibsCss(){
	var
		aLibsFiles = [
			sPathToCoreWebclient + '/styles/vendors/normalize.css',
			sPathToCoreWebclient + '/styles/vendors/jquery/jquery-ui-1.10.4.custom.min.css',
			//sPathToCoreWebclient + '/styles/vendors/fullcalendar-2.2.3.min.css',
			sPathToCoreWebclient + '/styles/vendors/inputosaurus.css'
		],
		sDestPath = 'static/styles/libs/',
		fBuild = function () {
			let lessContent;
			aLibsFiles.forEach(file => {
				lessContent += fs.readFileSync(file, 'utf8');
			});

			log.info('libs.css was build');
		
			fs.writeFileSync(sDestPath + 'libs.css', lessContent);
		}
	;
	
	CheckFolderAndCallHandler(sDestPath, fBuild);
}

function BuildThemeCss(sTheme, bMobile) {
	var
		sCoreModule = bMobile ? 'CoreMobileWebclient' : 'CoreWebclient',
		aModulesFiles = [],
		aThemeSpecyficFiles = [],
		aThemeSpecyficDefaultFiles = [],
		sPostfix = bMobile ? '-mobile' : '',
		iCoreModuleIndex = aModulesNames.indexOf(sCoreModule)
	;

	// check if required theme exists in CoreWebclient module or as a separate theme module 
	if (!fs.existsSync('modules/' + sCoreModule + '/styles/themes/' + sTheme + '/styles' + sPostfix + '.less')
		&& !fs.existsSync('modules/Theme' + sTheme + '/styles/styles' + sPostfix + '.less')) {
		console.log(sTheme + ' > styles' + sPostfix + '.css was skipped');
		return;
	}
	
	if (iCoreModuleIndex >= 0) {
		aModulesNames.unshift(aModulesNames.splice(iCoreModuleIndex, 1)[0]);
	}
	
	//remove Theme modules because they are not a regular modules and must be handled separately
	aModulesNames = aModulesNames.filter(function (sModuleName) {
		return sModuleName.indexOf('Theme') !== 0
	})
	
	aModulesNames.forEach(function (sModuleName) {
		if (fs.existsSync('modules/' + sModuleName + '/styles/styles' + sPostfix + '.less')) {
			//check module override
			if (fs.existsSync('tenants/' + sTenantPathPrefix + 'modules/' + sModuleName + '/styles/styles' + sPostfix + '.less'))
			{
				aModulesFiles.push('tenants/' + sTenantPathPrefix + 'modules/' + sModuleName + '/styles/styles' + sPostfix + '.less');
			}
			else
			{
				aModulesFiles.push('modules/' + sModuleName + '/styles/styles' + sPostfix + '.less');
			}
		}
		if (sModuleName !== sCoreModule && fs.existsSync('modules/' + sModuleName + '/styles/images' + sPostfix)) {
			MoveFiles('modules/' + sModuleName + '/styles/images' + sPostfix, 'static/styles/images' + sPostfix + '/modules/' + sModuleName);
		}
	});
	
	// try to find theme as a separate module
	const SpecialThemeModulePath = `modules/Theme${sTheme}/styles`
	if (fs.existsSync(`${SpecialThemeModulePath}/styles${sPostfix}.less`)) {
		aThemeSpecyficFiles.push(`${SpecialThemeModulePath}/styles${sPostfix}.less`)

		const sThemeImagesPath = `${SpecialThemeModulePath}/images${sPostfix}`
		if (fs.existsSync(sThemeImagesPath)) {
			MoveFiles(sThemeImagesPath, `static/styles/themes/${sTheme}/images`)
		}

		const sThemeFontsPath = `${SpecialThemeModulePath}/fonts${sPostfix}`
		if (fs.existsSync(sThemeFontsPath)) {
			MoveFiles(sThemeFontsPath, `static/styles/themes/${sTheme}/fonts`)
		}
	}

	//get theme specific files
	aModulesFiles.forEach(function (sFilePath) {
		var sThemePath = sFilePath.replace('styles' + sPostfix + '.less', 'themes/' + sTheme + '/styles' + sPostfix + '.less');
				
		if (fs.existsSync(sThemePath))
		{
			aThemeSpecyficFiles.push(sThemePath);
		
			var sThemeImagesPath = sFilePath.replace('styles' + sPostfix + '.less', 'themes/' + sTheme + '/images' + sPostfix);
			if (fs.existsSync(sThemeImagesPath))
			{
				var aPathParts = sThemeImagesPath.split('styles/themes');
				if (aPathParts.length > 1)
				{
					MoveFiles(sThemeImagesPath, 'static/styles/themes' + aPathParts[1]);
				}
			}

			var sThemeFontsPath = sFilePath.replace('styles' + sPostfix + '.less', 'themes/' + sTheme + '/fonts' + sPostfix);
			if (fs.existsSync(sThemeFontsPath))
			{
				var aPathParts = sThemeFontsPath.split('styles/themes');
				if (aPathParts.length > 1)
				{
					MoveFiles(sThemeFontsPath, 'static/styles/themes' + aPathParts[1]);
				}
			}
		}
	});
	
	aModulesFiles.forEach(function (sFilePath) {
		var sThemePath = sFilePath.replace('styles' + sPostfix + '.less', 'themes/_default' + sPostfix + '.less');
				
		if (fs.existsSync(sThemePath))
		{
			aThemeSpecyficDefaultFiles.push(sThemePath);
		}
	});
	
	aModulesFiles = aThemeSpecyficDefaultFiles.concat(aThemeSpecyficFiles.concat(aModulesFiles));
		
	let lessContent = '';
		
	aModulesFiles.forEach(file => {
		lessContent += '@import "' + file + '";' + crlf; 
	});

	fs.mkdirSync(sTenantPathPrefix + 'static/styles/themes/' + sTheme + '/', { recursive: true }, (msg) => { if (msg) { console.log(msg) } } );
		
	less.render(lessContent, {
			sourceMap: {sourceMapFileInline: false},
			sync: true,
			syncImport: true
		}, (error, output) => {
		if (error) {
			console.log(error);
		} else {
			console.log(sTheme + ' > styles' + sPostfix + '.css was build');
			fs.writeFileSync(sTenantPathPrefix + 'static/styles/themes/' + sTheme + '/styles' + sPostfix + '.css', output.css);
		}
	});

	return true;
}

function CheckFolderAndCallHandler(sDir, fHandler) {
  if (fs.existsSync(sDir)) {
    fHandler()
  } else {
    mkdirp(sDir, function (oErr) {
      if (!fs.existsSync(sDir)) {
        log(sDir + ' directory creating was failed: ', oErr)
      } else {
        fHandler()
      }
    })
  }
}

function MoveFiles(sFromDir, sToDir) {
  const fFilter = function (name) {
      console.log(name)
      return true
    },
    fCopyDir = function () {
      ncp(sFromDir, sToDir, fFilter, function (oErr) {
        if (oErr) {
          console.log(sFromDir + ' directory copying was failed: ', oErr)
        }
      })
    }
  if (fs.existsSync(sFromDir)) {
    CheckFolderAndCallHandler(sToDir, fCopyDir)
  }
}

function MoveSharingCss() {
  const fCopySharing = function () {
    ncp(sPathToCoreWebclient + '/styles/sharing.css', 'static/styles/sharing.css', function (oErr) {
      if (oErr) {
        console.log('static/styles/sharing.css file copying was failed: ', oErr)
      }
    })
  }

  CheckFolderAndCallHandler('static/styles', fCopySharing)
}

function build () {
	if (!sTenantName) { BuildLibsCss(); }
	
	MoveFiles(sPathToCoreWebclient + '/styles/vendors/jquery/images', 'static/styles/libs/images');
	MoveFiles(sPathToCoreWebclient + '/styles/fonts', sTenantPathPrefix + 'static/styles/fonts');
	MoveFiles(sPathToCoreWebclient + '/styles/images', sTenantPathPrefix + 'static/styles/images');
	MoveSharingCss();
	
	_.each(aThemes, function (sTheme) {
		BuildThemeCss(sTheme, false);
		BuildThemeCss(sTheme, true);
	});
};

function cssonly () {
	aThemes.forEach((sTheme) => {
		BuildThemeCss(sTheme, false);
		BuildThemeCss(sTheme, true);
	});
};

function watch () {
	const watcher = chokidar.watch(aModulesWatchPaths, {
		ignored: /node_modules/,
		persistent: true,
		interval: 500,
	});
	
	watcher.on('change', (path) => {
		log(`File ${path} has been changed`);
		_.each(aThemes, function (sTheme) {
			BuildThemeCss(sTheme, false);
			BuildThemeCss(sTheme, true);
		});
	});
} 

exports.default = {
	build,
	cssonly,
	watch
};