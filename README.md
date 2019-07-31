# Devpaul server deployment

## Deployment

### Remote deployment

```
> docker-machine env devpaul
```

Follow the directions on screen to switch docker environments

### Deploying

```
> npm run clean
> npm run build
> docker build -t devpaul-static:2.1.0 .
> docker stop devpaul.com
> docker rm devpaul.com
> docker run --name devpaul.com -d -p 8234:80 devpaul-static:2.1.0
```
