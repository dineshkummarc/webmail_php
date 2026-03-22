'use strict';

const
	_ = require('underscore'),
	fs = require('fs'),
	log = require('fancy-log'),
	webpack = require('webpack'),
	{ VueLoaderPlugin } = require('vue-loader'),
	WebpackDevServer = require('webpack-dev-server'),
	WebpackBar = require('webpackbar'),
	path = require('path'),
	sTenantName = process.env.npm_config_tenant,
	sOutputName = process.env.npm_config_output ?? 'app', // app, app-mobile, app-message-newtab, app-adminpanel, app-files-pub, app-calendar-pub, app-helpdesk
	sBuild = process.env.npm_config_build,
	sPath = sTenantName ? './tenants/' + sTenantName + '/static/js/' : './static/js/',
	crlf = '\n'
;

const aModulesNames = fs.readdirSync('./modules/');

function GetModuleName(sFilePath) {
	return sFilePath.replace(/.*modules[\\/](.*?)[\\/]js.*/, "$1");
}

var 
	aModules = _.compact(_.map(aModulesNames, function (sModuleName) {
		var
			sFilePath = './modules/' + sModuleName + '/js/manager.js',
			sTenantFilePath = './tenants/' + sTenantName + '/modules/' + sModuleName + '/js/manager.js',
			sFoundedFilePath = ''
		;

		if (fs.existsSync(sTenantFilePath))
		{
			sFoundedFilePath = sTenantFilePath;
		}
		else if (fs.existsSync(sFilePath))
		{
			sFoundedFilePath = sFilePath;
		}

		return sFoundedFilePath;
	})),
	oWebPackConfig = {
		mode: 'none', //none,production,development
		target: "web",
		stats: {
			source: false
		},
		devServer: {
			static: './static/js/',
		   	hot: true,
		},
		resolveLoader: {
			alias: {
				"replace-module-names-loader": path.join(__dirname, "replace-module-names-loader.js")
			}
		},
		resolve: {
			modules: [
				path.resolve(__dirname, '../../../'),
				"node_modules"
			]
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /[\\\/]modernizr\.js$/,
					use: [
						{
							loader: "imports-loader",
							options: { wrapper: "window" },
						},
						// 'imports-loader?this=>window',
						'exports-loader?window.Modernizr'
					]
				},
				{
					test: /\.js$/,
					use: [{ loader: 'replace-module-names-loader' }],
				},
				{
					// test: /(OpenPgpWebclient|OpenPgpFilesWebclient|CoreParanoidEncryptionWebclientPlugin|ComposeWordCounterPlugin|TwoFactorAuth).*\.js$/,
					test: /\.js$/,
					exclude: /node_modules/,
					use: [{
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{ useBuiltIns: 'entry', corejs: 'core-js@3' }
								]
							],
							compact: false
						}
					}],
				},
				{
					test: /\.css$/,
					use: [ 'style-loader', 'css-loader' ]
				},
				{
					test: /\.(png|jpe?g|gif)$/,
					use: [ 'file-loader' ]
				}
			]
		},
		plugins: [
			new webpack.ids.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
			new VueLoaderPlugin(),
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"window.jQuery": "jquery"
			}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
			}),
			// new webpack.ProgressPlugin((percentage, message, ...args) => {
			// 	console.info(percentage, message, ...args);
			// }),
			new WebpackBar({
				// name: "My App",
				color: '#2598d6',
				compiledIn: false,
				fancy: true,
			}),
			// new webpack.HotModuleReplacementPlugin()
		]
	},
	updateVersion = function () {
		var sVersionFilesName = './VERSION';
		
		if (fs.existsSync(sVersionFilesName))
		{
			var 
				// sBuildPrefix = aParsedVersion[2] ? sRawVersions.replace(/^([\d\.]+)(?:-build-)([a-z]+)(\d+)$/, ''), : 'o',
				sRawVersions = fs.readFileSync(sVersionFilesName, {'encoding':'utf8'}),
				aParsedVersion = sRawVersions.trim().split('-'),
				sVersion = aParsedVersion[0] ? aParsedVersion[0] : '1.0.0',
				sBuildPrefix = aParsedVersion[2] ? aParsedVersion[2].replace(/^([a-z]+)(\d+)$/, '$1') : 'o',
				iBuild = aParsedVersion[2] ? aParsedVersion[2].replace(/^([a-z]+)(\d+)$/, '$2') : 1
			;
			
			if (sBuild)
			{
				sBuildPrefix = sBuild;
			}
			
			iBuild++;
			
			fs.writeFileSync(sVersionFilesName, sVersion+'-build-'+sBuildPrefix+iBuild);
		}
	},
	removeObsoleteChanks = function (stats) {
		const newlyCreatedAssets = stats.compilation.assets;
		const unlinked = [];
		const bMin = stats.compilation.outputOptions.chunkFilename.substr(-6) === 'min.js';

		fs.readdir(path.resolve(stats.compilation.outputOptions.publicPath), function(err, files) {
			files
				.filter(function(file) { return file.substr(0, 1) !== '_'; })
				.filter(function(file) { return bMin ? file.substr(-6) === 'min.js' : file.substr(-6) !== 'min.js'; })
				.forEach(function(file) {
					if (!newlyCreatedAssets[file]) {
						fs.unlinkSync(path.resolve(stats.compilation.outputOptions.publicPath + file));
						unlinked.push(file);
					}
				});
			if (unlinked.length > 0) {
				console.log('Removed old assets: ', unlinked);
			}
		})
	},
	compileCallback = function (err, stats) {
		if (err) {
			log.error(err);
			log.error(stats);
		}

		log.info(stats.toString({
			colors: true,
			//context: true,
			hash: false,
			version: false,
			timings: false,
			assets: false,
			chunks: false,
			chunkModules: false,
			modules: false,
			children: false,
			cached: false,
			reasons: false,
			source: false,
			errorDetails: false,
			chunkOrigins: false
		}));
		
		updateVersion();
		removeObsoleteChanks(stats);
	}
;

function generateEntryTask(sName) {
	const modulesJs = [];

	modulesJs.push(
`'use strict';
import Promise from 'bluebird';
Promise.config({
	warnings: {
		wForgottenReturn: false
	}
});
if (!window.Promise) { window.Promise = Promise; }
import $ from 'jquery';
import _ from 'underscore';
import "core-js";
import "regenerator-runtime/runtime";

$('body').ready(function () {
	var oAvailableModules = {};
	if (window.aAvailableModules) {
`
	);

	_.each(aModules, (sFilePath) => {
		const sModuleName = GetModuleName(sFilePath);

		modulesJs.push(`
		if (window.aAvailableModules.indexOf('${sModuleName}') >= 0) {
			oAvailableModules['${sModuleName}'] = import(/* webpackChunkName: "${sModuleName}" */ 'modules/${sModuleName}/js/manager.js').then(function (module) { return module.default});
		}`);
	});

	modulesJs.push(`
}

Promise.all(_.values(oAvailableModules))
	.then(function(aModules){
		var
			ModulesManager = require('modules/CoreWebclient/js/ModulesManager.js'),
			App = require('modules/CoreWebclient/js/App.js'),
			bSwitchingToMobile = App.checkMobile()
		;
		if (!bSwitchingToMobile) {
			if (window.isPublic) {
				App.setPublic();
			}
			if (window.isNewTab) {
				App.setNewTab();
			}
			ModulesManager.init(_.object(_.keys(oAvailableModules), aModules), window.auroraAppData);
			App.init();
		}
	})
	.catch(function (oError) { console.error('An error occurred while loading the component:'); console.error(oError); });
});
`);
	fs.mkdir(sPath, { recursive: true }, (err) => {
		if (err) {
			throw err;
		} else {
			fs.writeFileSync( sPath + '_' + sName + '-entry.js', modulesJs.join(crlf), (err) => {
				if (err) throw err;
			});
		}
	});
};

function build () {
	const config = _.defaults({
		mode: 'none',
		entry: sPath + '_' + sOutputName + '-entry.js',
		output: {
			path: path.resolve(__dirname, '../../../' + sPath),
			filename: sOutputName + '.js',
			chunkFilename: '[name].' + sOutputName + '.[chunkhash].js',
			publicPath: sPath,
			pathinfo: true,
		}
	}, oWebPackConfig);

	generateEntryTask(sOutputName);
	webpack(config, compileCallback);
}

function watch () {
	const config = _.defaults({
		mode: 'development',
		watch: true,
		entry: sPath + '_' + sOutputName + '-entry.js',
		output: {
			path: path.resolve(__dirname, '../../../' + sPath),
			filename: sOutputName + '.js',
			chunkFilename: '[name].' + sOutputName + '.[chunkhash].js',
			publicPath: sPath,
			pathinfo: true,
		},
	}, oWebPackConfig);

	generateEntryTask(sOutputName);
	webpack(config, compileCallback);
};

function min () {
	const config = _.defaults({
		mode: 'production',
		entry: sPath + '_' + sOutputName + '-entry.js',
		output:  {
			path: path.resolve(__dirname, '../../../' + sPath),
			filename: sOutputName + '.min.js',
			chunkFilename: '[name].' + sOutputName + '.[chunkhash].min.js',
			publicPath: sPath
		}
	}, oWebPackConfig);

	generateEntryTask(sOutputName);
	webpack(config, compileCallback);
};

exports.default = {
	build,
	min,
	watch,
	serve: async () => {
		const config = _.defaults({
			mode: 'development',
			watch: true,
			entry: sPath + '_' + sOutputName + '-entry.js',
			output: {
				path: path.resolve(__dirname, '../../../' + sPath),
				filename: sOutputName + '.js',
				chunkFilename: '[name].' + sOutputName + '.[chunkhash].js',
				publicPath: sPath,
				pathinfo: true,
			},
		}, oWebPackConfig);

		const compiler = webpack(config);
		const devServerOptions = { ...config.devServer, open: true };
		const server = new WebpackDevServer(devServerOptions, compiler);

		console.log('Starting server...');
		await server.start();
	}
};
