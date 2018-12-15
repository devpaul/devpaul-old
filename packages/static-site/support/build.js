const shell = require('shelljs');
const path = require('path');
const common = require('./common');

function init() {
	shell.cd(common.rootDirectory);
	shell.mkdir('-p', common.distDirectory);
}

function copyArtifacts() {
	shell.cd(common.siteDirectory);
	shell.cp('-R', '*', common.distDirectory);
}

function buildStylus() {
	const exec = path.join(common.modules, 'stylus');
	const source = path.join(common.stylusDirectory, 'main.styl');
	const target = path.join(common.distDirectory, 'resources');

	shell.cd(common.rootDirectory);
	shell.mkdir('-p', target);
	shell.exec(`${ exec } ${ source } -o ${ target }`);
}

init();
copyArtifacts();
buildStylus();
