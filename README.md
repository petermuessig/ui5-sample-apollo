# ui5-sample-apollo

**Mission Apollo: Bring UI5 to the Moon**

The UI5 framework is on a mission to the moon using an Apollo rocket!

## Overview

This project show-cases the usage of Apollo GraphQL for UI5 applications. The first basic step is theintegration OSS libraries from npm into UI5 by using the new CLI tooling. With Rollup the Apollo GraphQL library can be transpiled into a UI5 AMD-like module. The other part of the project is the integration of Apollo GraphQL into the UI5 programming model.

The content of the repository is structured like that:

```text
packages
├── ui5-apollo-lib     // the UI5 library containing the Apollo client and a base controller for UI5 MVC applications
├── ui5-apollo-server  // the Apollo GraphQL server
└── ui5-todoapp        // the UI5 todo applications
```

## Getting Started

The `ui5-sample-apollo` repository is a monorepo based on `yarn` workspaces. Instead of `npm` you need yarn to run the project.

```bash
# Install yarn (if not done already)
npm i -g yarn
```

To get started with the project, please ensure to run `yarn` once to install all required dependencies in your `node_modules` folder.

```bash

# install dependencies
yarn

# start the watch mode for development
yarn watch

# start the productive mode
yarn start

```

## License

This work is [dual-licensed](LICENSE) under Apache 2.0 and the *Derived Beer-ware License*. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@DamianMaring](https://twitter.com/DamianMaring) a beer or buy [@pmuessig](https://twitter.com/pmuessig) a coke.
