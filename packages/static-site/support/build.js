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

init();
copyArtifacts();
