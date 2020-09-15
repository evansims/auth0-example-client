# Auth0 Demonstration Client

Thanks for your interest in my demonstration client of [Auth0's](https://auth0.com/) APIs. This is one half of a project demonstrating how one might go about implementing Auth0's authentication API to interact with a custom backend.

This repository houses the JavaScript-based frontend server, using the [Ember.js framework](https://emberjs.com/). [The accompanying PHP-based backend server can be found here.](https://github.com/evansims/auth0-example-server)

![Screenshot](https://imgur.com/aNMfWKJ.png)

## Requirements

- An [Auth0 account](https://manage.auth0.com/dashboard)
- [Docker](https://www.docker.com/)
- [docker-sync](http://docker-sync.io/)
- The counterpart [backend server](https://github.com/evansims/auth0-example-server)

## Getting Started

You should begin by cloning and configuring [the backend counterpart to this project first](https://github.com/evansims/auth0-example-server). Instructions for that can be found in it's repository.

Next, clone this repository to your local machine:

```
git clone https://github.com/evansims/auth0-example-client.git
```

### Configure Auth0 application

1. [Sign up for an Auth0 account](https://manage.auth0.com/dashboard), if you don't already have one, and sign in.
2. Open Auth0's [Applications dashboard](https://manage.auth0.com/dashboard/us/dev-evansims/applications) and create a new Single Page Web Application.
3. In your new Application's settings, make note of your unique Client ID and Domain. You will need these later.
4. Set the 'Allowed Callback URLs' endpoint to `http://localhost:3000/callback`.
5. Save your Application settings changes.

### Configure our client

1. One your machine, within the cloned directory of this repository, open the `config/environment.js` file.
2. Find the `auth0` section.
3. Set your `clientId` and `domain` to the values you made note of when you set up your Auth0 Application (above.)
4. Set your `audience` to match the Audience of the Auth0 API you setup while configuring the [backend server](https://github.com/evansims/auth0-example-server).
5. Save the file.

### Build the client

This project assumes you have an existing [Docker](https://www.docker.com/) installation to simplify getting started. However, if you already have a working [Ember CLI](https://ember-cli.com/) installation on your local machine you can build the project using the standard command line tools if you prefer.

We'll be using [docker-sync](http://docker-sync.io/) to help streamline the build process across platforms. Once you have [docker-sync installed](https://docker-sync.readthedocs.io/en/latest/getting-started/installation.html), open your shell to the cloned repository on your local machine and run:

```
$ docker-sync-stack start
```

This will begin a file sync to the Docker container and start the build process. This may take a few minutes to complete.

Once the build is done, your frontend will be accessible at [http://localhost:3000](http://localhost:3000) on your local machine.

To terminate the build process at any time, simply close the shell process, which on most platforms is usually accomplished by pressing CTRL+C.

### Using the client

Open [http://localhost:3000](http://localhost:3000) on your local machine to use the client.

This client demonstrates a few simple aspects:

- Authenticating users using [Auth0's SPA JS SDK](https://github.com/auth0/auth0-spa-js) with an Ember.js app
- Communicating with a custom [backend server](https://github.com/evansims/auth0-example-server) to proxy calls to [Auth0's Management API](https://auth0.com/docs/api/management/v2), transforming our requests and enabling the following:
  - Using Ember Data to store Auth0 user objects
  - Rendering paginated results from the Management AP, using [ember-concurrency](http://ember-concurrency.com/docs/introduction/)
  - Searching users with the Management API

After signing into the demonstration client with your Auth0 account, you will see a list of other users in your application.

You can paginate and view more users by selecting the 'more users' button at the bottom of the results.

At the top of the page you can use the search field to filter your results.

## Auth0 Documentation

- Documentation for Auth0's APIs can be found [here](https://auth0.com/docs/api/info).
- Quickstarts for a variety of use cases, languages and respective frameworks can be found [here](https://auth0.com/docs/quickstarts).

## Contributing

Pull requests are welcome!

## Security Vulnerabilities

If you discover a security vulnerability within this project, please send an e-mail to Evan Sims at hello@evansims.com. All security vulnerabilities will be promptly addressed.

## License

This demonstration project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
