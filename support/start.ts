import createServer from 'webserv/commands/createServer';
import route from 'webserv/handlers/route';
import ServePath from 'webserv/middleware/ServePath';
import { join } from 'path';

const base = join(__dirname, '..', 'packages');

createServer({
	directory: join(base, 'static-site', 'site'),
	start: true,
	middleware: [
		route('/packages/app/*').wrap(new ServePath(join(base, 'app', 'dist'))),
		route('/service-worker.js').wrap(new ServePath(join(base, 'service-worker', 'dist', 'service-worker.js')))
	]
}).then(() => {
	console.log('server started on port 8888');
})
