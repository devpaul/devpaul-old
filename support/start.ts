import createServer from 'webserv/commands/createServer';
import { join } from 'path';

createServer({
	directory: join(__dirname, '..', 'packages', 'static-site', 'site'),
	start: true
});
