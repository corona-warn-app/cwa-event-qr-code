# cwa-event-qr-code

Utility to generate QR codes for Event Registration (incl. from the CLI)

## CLI Usage

```shell
# Print QR code to the terminal
$ cwa-event-qr-code \
  --description hello-world \
  --address hello \
  --type 1 \
  --default-check-in-length-in-minutes 30

# Write QR code to file
$ cwa-event-qr-code \
  --description hello-world \
  --address hello \
  --type 1 \
  --default-check-in-length-in-minutes 30 \
  --filepath hello-world.png #.svg also works
```

## Usage in Node.js

```javascript
const cwa = require('cwa-event-qr-code')

// Create a PNG
await cwa.createQRCodeAsPNG({
  locationData: {
    description: 'hello-world',
    address: 'hello'
  },
  vendorData: {
    type: 1,
    defaultCheckInLengthInMinutes: 30
  },
  filepath: 'hello-world.png'
})

// Create just the url
const url = await cwa.generateQRCodeContent({
  locationData: {
    description: 'hello-world',
    address: 'hello'
  },
  vendorData: {
    type: 1,
    defaultCheckInLengthInMinutes: 30
  }
})
// then proceed to create your own QR code with it...
```