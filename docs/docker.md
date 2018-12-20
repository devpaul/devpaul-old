# Setting up Docker

These are instructions for setting up Docker on a vanilla Ubuntu system and securing the connection with tls.

## Installing Docker

Instructions: https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-repository

## Securing the Remote

Instructions: https://docs.docker.com/engine/security/https/

Once certificates have been created there are two ways to start the docker daemon with the certificates in place.

* A JSON file (preferred)
* Command line

Instructions: https://docs.docker.com/config/daemon/#configure-the-docker-daemon

### Docker daemon.json

Docker's configurations files are kept in `/etc/docker/daemon.json`

```json
{
  "debug": false,
  "tls": true,
  "tlscert": "/var/docker/server.pem",
  "tlskey": "/var/docker/serverkey.pem",
  "hosts": [ "tcp://devpaul.com:2376", "tcp://localhost:2376", "tcp://127.0.0.1:2376" ]
}
```

### Command line

```cmd
dockerd --tlsverify --tlscacert=ca.pem --tlscert=server-cert.pem --tlskey=server-key.pem \
  -H=0.0.0.0:2376
  ```

## Using Docker Clients

### Docker client

```cmd
docker --tlsverify --tlscacert=ca.pem --tlscert=cert.pem --tlskey=key.pem \
  -H=$HOST:2376 version
```

Docker will use environment variables as default values. The following exports may be used to automatically connect to the new environment.

```cmd
  export DOCKER_HOST=tcp://$HOST:2376 DOCKER_TLS_VERIFY=1 DOCKER_CERT_PATH=~/.docker/devpaul/
```

Now docker will use the DOCKER_HOST by default with the provided DOCKER_CERT_PATH.

`docker-machine` can help us manage multiple environments. The next section will go into setting up and using docker-machine.

### Docker-machine

Docker-machine is used to create and manage multiple docker hosts, often using a specific driver that interfaces with a service like Amazon or Digital Ocean.

Devpaul.com runs the docker daemon directly on a VPS. This is why we needed to create our own certificate authority and secure the docker daemon with tls. Now we'll [create a docker-machine][docker-machine create] that points to our already running instance and provide the certificates we created so docker-machine can connect to our host.

First we'll create a docker machine:

```cmd
docker-machine create --driver none --url=tcp://devpaul.com:2376 devpaul
```

This will create a file in `%HOMEPATH%\.docker\machine\machines\devpaul\config.json` with configuration information. We'll want to `scp` the `ca.pem`, `cert.pem`, and `key.pem` files from our docker host machine and add them as siblings to the `config.json` file.

Next, we'll edit the `config.json` file to point to our certificates. `docker-machine` creates some certificates we might use if we were creating a machine on our localhost, but since we've already done the work above, we'll want to use those certs. The `config.json` should look something like this:

```json
AuthOptions": {
		"CertDir": "C:\\Users\\user\\.docker\\devpaul\\certs",
		"CaCertPath": "C:\\Users\\user\\.docker\\devpaul\\ca.pem",
		"CaPrivateKeyPath": "C:\\Users\\user\\.docker\\machine\\certs\\ca-key.pem",
		"CaCertRemotePath": "",
		"ServerCertPath": "C:\\Users\\user\\.docker\\machine\\machines\\devpaul\\server.pem",
		"ServerKeyPath": "C:\\Users\\user\\.docker\\machine\\machines\\devpaul\\server-key.pem",
		"ClientKeyPath": "C:\\Users\\user\\.docker\\devpaul\\key.pem",
		"ServerCertRemotePath": "",
		"ServerKeyRemotePath": "",
		"ClientCertPath": "C:\\Users\\user\\.docker\\devpaul\\cert.pem",
		"ServerCertSANs": [],
		"StorePath": "C:\\Users\\user\\.docker\\machine\\machines\\devpaul"
}
```

We should now be able to verify our connection by using `docker-machine ls`.

To start sending docker command to our remote host we need to set our environment. `docker-machine env devpaul` will provide a list of these environment variables as well as a command that can be copy-pasted into your console.

### Using Curl

```cmd
curl https://$HOST:2376/images/json \
  --cert ~/.docker/cert.pem \
  --key ~/.docker/key.pem \
  --cacert ~/.docker/ca.pem
```

[Daemon Config]: https://docs.docker.com/config/daemon/#configure-the-docker-daemon
[Docker Certificates]: https://docs.docker.com/engine/security/certificates/
[Mac self-signed certs]: https://container-solutions.com/adding-self-signed-registry-certs-docker-mac/
[docker-machine create]: https://docs.docker.com/machine/get-started-cloud/#add-a-host-without-a-driver
