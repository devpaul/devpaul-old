# Static Site for devpaul.com

The static site is comprised of all pre-compiled html, JavaScript, images, and assets for devpaul.com. The site is hosted as static content by nginx.

## Quick Start

1. `npm i`
2. `npm run build`

Contents are built into the `_dist` directory

## Deployment

### Remote deployment

```
> docker-machine env devpaul
```

### Deploying

```
> npm run clean
> npm run build
> docker build -t devpaul-static:2.0.1 .
> docker stop devpaul.com
> docker rm devpaul.com
> docker run --name devpaul.com -d -p 8234:80 devpaul-static:2.0.1
```
