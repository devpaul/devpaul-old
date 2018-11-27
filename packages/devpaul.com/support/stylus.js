const shell = require('shelljs');
const common = require('./common');
const path = require('path');

const exec = path.join(common.modules, 'stylus');
const source = path.join(common.stylusDirectory, 'main.styl');
const target = path.join(common.distDirectory, 'resources');

shell.cd(common.rootDirectory);
shell.mkdir('-p', target);
shell.exec(`${ exec } ${ source } -o ${ target }`);
