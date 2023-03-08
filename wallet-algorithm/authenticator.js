const speakeasy = require('speakeasy')

// Generate key
// var key = speakeasy.generateSecret({
//     name: "wallet.eth"
// })
// console.log(key);

// Verify
const verify = speakeasy.totp.verify({
    secret: 'KRQW6XSHGZTVEMSXPV4HAQ2WNM7VGPCNJE2VUKBIENFW442RPI4Q',
    encoding: 'ascii',
    token: '608253'
})

console.log(verify);