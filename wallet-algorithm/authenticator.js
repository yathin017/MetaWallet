const speakeasy = require('speakeasy')

// Generate key
var key = speakeasy.generateSecret({
    name: "wallet.eth"
})
console.log(key);

// Verify
const verify = speakeasy.totp.verify({
    secret: '',
    encoding: 'ascii',
    token: ''
})

console.log(verify);