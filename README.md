<p align="center">
 <a href="https://www.coronawarn.app/en/"><img src="https://raw.githubusercontent.com/corona-warn-app/cwa-documentation/master/images/CWA_title.png" width="400"></a>
</p>

<hr />

<p align="center">
    <a href="https://github.com/corona-warn-app/cwa-event-qr-code/actions/workflows/build.yml" title="Latest Results"><img src="https://img.shields.io/github/workflow/status/corona-warn-app/cwa-event-qr-code/Node.js%20CI/main" alt="Build Status" /></a>
</p>
<p align="center">
    <a href="#about-this-repository">About this Repository</a> •
    <a href="#requirements">Requirements</a> •
    <a href="#cli-usage">CLI Usage</a> •
    <a href="#usage-in-nodejs">Usage in Node.js</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#support-and-feedback">Support and Feedback</a> •
    <a href="#how-to-contribute">How to contribute</a> •
    <a href="#licensing">Licensing</a> •
    <a href="https://www.coronawarn.app/en/">Web Site</a>
</p>
<hr />

# Corona-Warn-App: cwa-event-qr-code

## About this Repository

Utility to generate QR codes for Event Registration (incl. from the CLI). For information about the project, please see our [documentation repository](https://github.com/corona-warn-app/cwa-documentation).

Remark: This utility is in early stages of development and should help you to create multiple QR codes at once. If you find this useful or you identified a bug, feel free to create an issue.

## Requirements

You need version 14 (LTS) or higher of [Node.js](https://nodejs.org/en/) (which includes npm) to use this utility.

## Usage Guide

A step by step explanation on how to use this tool is available [here](https://coronawarn.app/en/event-qr-code-guide/), on our website.

## CLI Usage

#### Installation and Basics

```shell
# Option a) Install globally to make executable available
$ npm install cwa-event-qr-code --global
$ cwa-event-qr-code --help
$ cwa-event-qr-code --version

# Option b) Use npx and skip the installation
$ npx cwa-event-qr-code --help
$ npx cwa-event-qr-code --version
```

#### Create Posters

```shell
# Multiple posters from CSV
$ cwa-event-qr-code poster \
  --csv examples/sample-data.csv \
  --dest posters

# Single poster from arguments
$ cwa-event-qr-code poster \
  --description "Some Bakery" \
  --address "Some Street, Some City" \
  --type 4 \
  --default-check-in-length-in-minutes 15 \
  --filepath bakery.pdf
```

#### Create QR codes only

```shell
# Multiple QR codes from CSV
$ cwa-event-qr-code file \
  --csv examples/sample-data.csv \
  --dest qr-codes

# Single QR code from arguments (as PNG)
$ cwa-event-qr-code file \
  --description "Some Bakery" \
  --address "Some Street, Some City" \
  --type 4 \
  --default-check-in-length-in-minutes 15 \
  --filepath bakery.png

# Single QR code from arguments (as SVG)
$ cwa-event-qr-code file \
  --description "Some Bakery" \
  --address "Some Street, Some City" \
  --type 4 \
  --default-check-in-length-in-minutes 15 \
  --filepath bakery.svg
```

## Usage in Node.js

Install as a dependency:

```shell
$ npm install cwa-event-qr-code
```

Then use it in your script:

```javascript
const { createEventQRCode } = require('cwa-event-qr-code')

const eventQRCode = createEventQRCode({
  locationData: {
    description: 'hello-world',
    address: 'hello'
  },
  vendorData: {
    type: 1,
    defaultCheckInLengthInMinutes: 30
  }
})

// Create a PNG
await eventQRCode.toPNG('hello-world.png')

// Get just the url
const url = await eventQRCode.toURL()
```

### Debug local changes

```shell
# Run the CLI-Tool locally
$ node bin/cli file \
  --description "Some Bakery" \
  --address "Some Street, Some City" \
  --type 4 \
  --default-check-in-length-in-minutes 15 \
  --filepath bakery.png
```

## Documentation

The full documentation for the Corona-Warn-App can be found in the [cwa-documentation](https://github.com/corona-warn-app/cwa-documentation) repository. The documentation repository contains technical documents, architecture information, and white papers related to this implementation.

## Support and Feedback

The following channels are available for discussions, feedback, and support requests:

| Type                     | Channel                                                |
| ------------------------ | ------------------------------------------------------ |
| **General discussion, issues, bugs**   | <a href="https://github.com/corona-warn-app/cwa-event-qr-code/issues/new/choose" title="General Discussion"><img src="https://img.shields.io/github/issues/corona-warn-app/cwa-event-qr-code/question.svg?style=flat-square"></a> </a>   |
| **Other requests**    | <a href="mailto:corona-warn-app.opensource@sap.com" title="Email CWA Team"><img src="https://img.shields.io/badge/email-CWA%20team-green?logo=mail.ru&style=flat-square&logoColor=white"></a> |

## How to contribute

The German government has asked SAP and Deutsche Telekom AG to develop the Corona-Warn-App for Germany as open source software. Deutsche Telekom is providing the network and mobile technology and will operate and run the backend for the app in a safe, scalable and stable manner. SAP is responsible for the app development, its framework and the underlying platform. Therefore, development teams of SAP and Deutsche Telekom are contributing to this project. At the same time our commitment to open source means that we are enabling -in fact encouraging- all interested parties to contribute and become part of its developer community.

For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](./CONTRIBUTING.md). By participating in this project, you agree to abide by its [Code of Conduct](./CODE_OF_CONDUCT.md) at all times.

## Repositories

A list of all public repositories from the Corona-Warn-App can be found [here](https://github.com/corona-warn-app/cwa-documentation/blob/master/README.md#repositories).

## Licensing

Copyright (c) 2020-2023 Deutsche Telekom AG and SAP SE or an SAP affiliate company.

Licensed under the **Apache License, Version 2.0** (the "License"); you may not use this file except in compliance with the License.

You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the [LICENSE](./LICENSE) for the specific language governing permissions and limitations under the License.

The "Corona-Warn-App" logo is a registered trademark of The Press and Information Office of the Federal Government. For more information please see [bundesregierung.de](https://www.bundesregierung.de/breg-en/federal-government/federal-press-office).
