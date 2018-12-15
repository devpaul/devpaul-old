import { rootDirectory, siteDirectory, stylusDirectory } from './common';
const Docker = require('dockerode');
const packageJson = require('../package.json');

const IMAGE_NAME = `devpaul-static-build:${ packageJson.version }`;
const CONTAINER_NAME = 'devpaul.com';
const DOCKER_VOLUME = 'devpaul-code';

const docker = Docker();

async function volumeExists() {
	const volumes = await docker.listVolumes();
	for (let volume of volumes.Volumes) {
		if (volume.Name === DOCKER_VOLUME) {
			return true;
		}
	}
	return false;
}

async function ensureVolume() {
	if (!(await volumeExists())) {
		console.log(`Create missing volume ${ DOCKER_VOLUME }`);
		await docker.createVolume({
			Name: DOCKER_VOLUME
		});
	}
}

// docker build .
async function buildImage() {
	console.log(`building image ${ IMAGE_NAME } from ${ rootDirectory }`);
	const stream = await docker.buildImage({
		context: rootDirectory,
		src: [ 'Dockerfile.build', 'site/index.html' ]
	}, {
		t: IMAGE_NAME
	});
	stream.pipe(process.stdout);
	const result = await new Promise((resolve, reject) => {
		docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
	});
	console.log(result);
}

async function buildSite() {
	console.log('building site');
	const command = `node ./support/build`.split(' ');
	const stream = await docker.run(IMAGE_NAME, command, process.stdout);
	return;
	const container = await docker.createContainer({
		Image: IMAGE_NAME,
		AttachStdout: true,
		AttachStderr: true,
		Tty: true,
		Cmd: ['which node'],
		HostConfig: {
			Binds: [
				`${ siteDirectory }:/srv/site:ro`,
				`${ stylusDirectory }:/srv/stylus:ro`
			]
		}
	});
	container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
		stream.pipe(process.stdout);
	});
	await container.start();
}

function help() {
	console.log('To get a shell run: \n');
	console.log(`docker run -it --rm ${ IMAGE_NAME } /bin/bash`);
	console.log('');
}

async function clean() {
	const containers = await docker.listContainers({ all: true });
	// const container = docker.getContainer(descriptor.Id);
}

async function superClean() {
	const containers = await docker.listContainers({ all: true });
	for (const descriptor of containers) {
		console.log(`Removing container ${ descriptor.Id }`);
		const container = docker.getContainer(descriptor.Id);
		if (descriptor.State == 'running') {
			await container.stop();
		}
		await container.remove();

	}

	const images = await docker.listImages();
	for (const descriptor of images) {
		console.log(`Removing image ${ descriptor.Id }`);
		const image = docker.getImage(descriptor.Id);
		await image.remove();
	}
}

async function run() {
	if (process.argv[2] == 'help') {
		return help();
	}
	if (process.argv[2] == 'clean') {
		return await clean();
	}
	if (process.argv[2] !== '--quick') {
		await ensureVolume();
		await buildImage();
	}
	await buildSite();
}

run();
