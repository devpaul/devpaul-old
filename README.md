# Devpaul server deployment

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
