const shell = require('shelljs');
const common = require('./common');

shell.cd(common.rootDirectory);
shell.mkdir('-p', common.distDirectory);
shell.cd(common.siteDirectory);
shell.cp('-R', '*', common.distDirectory);
