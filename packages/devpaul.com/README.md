# Static Site for devpaul.com

## Deployment

From a cloned repo:

1. `npm i`
1. `npm run ci`
1. `npm run docker build`
1. `npm run docker run`

```
	docker run --name devpaul.com -p 8234:80 --restart always root-site
```

### Building without Node installed

If you are building from a system that has docker installed, but does not have node installed, Nodejs supplies
 a docker image:

```
	docker run -it --rm --name node6 -v `pwd`:/usr/src/app -w /usr/src/app node:6 npm i
```

This can be useful if different versions of node are required for building various projects on the server
