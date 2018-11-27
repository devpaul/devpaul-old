const shell = require('shelljs');
const common = require('./common');

shell.rm('-rf', common.distDirectory);
