# Auth0 Demonstration Client

Thanks for your interest in my demonstration client of [Auth0's](https://auth0.com/) robust authentication and authorization platform. This is one half of a project demonstrating how one might go about implimenting Auth0's authentication API to interact with a custom backend.

This repo houses the JavaScript-based frontend server. [The accompanying PHP-based backend server can be found here.](https://github.com/evansims/auth0-example-server)

![Screenshot](https://imgur.com/aNMfWKJ.png)

## Requirements

- [Docker](https://www.docker.com/)
- [docker-sync](http://docker-sync.io/)
- The paired [example server](https://github.com/evansims/auth0-example-server) cloned and running on your machine

## Getting Started

You should clone and configure [the backend counterpart to this project first](https://github.com/evansims/auth0-example-server).

Next, clone this repository to your local machine.

```
git clone https://github.com/evansims/auth0-example-client.git
```

### Configure Auth0 Application

1. [Sign up for an Auth0 account](https://manage.auth0.com/dashboard), if you don't already have one, and sign in.
2. Create a new Single Page Web Application from the [Applications dashboard](https://manage.auth0.com/dashboard/us/dev-evansims/applications).
3. In your Application's settings page, make note of your Client ID and Domain. You will need this later.
4. Update the 'Allowed Callback URLs' endpoint to `http://localhost:3000/callback`.
5. Save your changes.

### Configure your Auth0 credentials

1. Open config/environment.js
2. Find the `auth0` group
3. Set your `clientId` and `domain` to the values you copied from the previous step.
4. Set your `audience` to match the Audience of the Auth0 API you setup for the [backend server](https://github.com/evansims/auth0-example-server)
5. Save the file.

### Build the frontend

This project makes use of [Docker](https://www.docker.com/) to simplify getting started, although if you already have a working Ember CLI installation on your native machine you can build the project using the standard command line tools as well.

This project uses docker-sync to provide efficient file watching services across all platforms, to pick up changes and rebuild the frontend as you make modifications. Once you have [docker-sync installed](https://docker-sync.readthedocs.io/en/latest/getting-started/installation.html) simply run:

```
$ docker-sync-stack start
```

This will engage the sync and build process, and may take a few minutes to become available. Once ready, your frontend will be accessible at [http://localhost:3000](http://localhost:3000) on your local machine.

To terminate the build process, simply close the shell, usually accomplished by pressing CTRL+C.
