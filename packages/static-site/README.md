# Static Site for devpaul.com

## Development

1. `npm i`
2. `npm run build`

Contents are built into the `_dist` directory

## Deployment

Deployment uses 2 containers and 1 volume to completely contain the project in minimal containers (minimal referring to number of dependencies).

Scripts for running the docker containers are locatued under `support/docker`. A complete build using scripts looks like this:

1. `create-volume.bat`
2. `create-build-container.bat`
3. `build.bat`
4. `start.bat`

In brief, the process creates a volume that can be mounted in the build and start containers; creates a build container with Node.js and npm dependencies installed; mount local files from `site` and `stylus` and mount the volume as `_dist` and run `npm run build` to create the site; host the site by mounting the volume in an nginx container.

As long as npm dependencies do not change, only `build.bat` is necessary to build when changes are made. Because the volumes are shared between the build container and nginx container, the nginx container does not need to be restarted. Changes will show up immediately.
