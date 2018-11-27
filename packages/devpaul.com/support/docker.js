const shell = require('shelljs');
const common = require('./common');
const package = require('../package.json');

const directive = process.argv[process.argv.length - 1];
const imageName = `devpaul-static:${ package.version }`;
const containerName = 'devpaul.com';
const port = 8234;

const handlers = {
	build() {
		shell.exec(`docker build -t ${ imageName } .`);
	},

	clean() {
		shell.exec(`docker stop ${ containerName }`);
		shell.exec(`docker rm ${ containerName }`);
		shell.exec(`docker rmi ${ imageName }`);
	},

	run() {
		shell.exec(`docker run --name ${ containerName } -p ${ port }:80 ${ imageName }`);
	},

	live() {
		shell.echo('Docker: live reloadable server');
		shell.exec(`docker run --rm --name ${ containerName } -p ${ port }:80 -v \`pwd\`/_dist:/usr/share/nginx/html ${ imageName }`);
	},

	version() {
		const result = shell.exec(`docker inspect ${ imageName }`, { silent: true });
		if (result.code === 0) {
			const parsed = JSON.parse(result.stdout)[0];
			console.log(`Image "${ imageName }" created: "${ parsed.Created }"`);
		}
		else {
			console.error(result.stderr);
		}
	}
};

const method = handlers[directive];

if (method) {
	shell.cd(common.rootDirectory);
	method();
}
else {
	var commands = [];
	for (let name in handlers) {
		commands.push(`"${ name }"`);
	}
	commands.sort();
	console.log(`Hi. Commands are: ${ commands.join(', ') }`);
}
