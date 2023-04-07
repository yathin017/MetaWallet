const speakeasy = require('speakeasy')

// Generate key
var key = speakeasy.generateSecret({
    name: "Meta Wallet"
})
console.log(key);

// Output
// {
//     ascii: '(i7F^?/maxBQI5TrX/q1JP9i(c]OXy{}',
//     hex: '286937465e3f2f6d6178425149355472582f71314a50396928635d4f58797b7d',
//     base32: 'FBUTORS6H4XW2YLYIJIUSNKUOJMC64JRJJIDS2JIMNOU6WDZPN6Q',
//     otpauth_url: 'otpauth://totp/Meta%20Wallet?secret=FBUTORS6H4XW2YLYIJIUSNKUOJMC64JRJJIDS2JIMNOU6WDZPN6Q'
// }

// Verify
const verify = speakeasy.totp.verify({
    secret: '(i7F^?/maxBQI5TrX/q1JP9i(c]OXy{}',
    encoding: 'ascii',
    token: '608253'
})

// Output
// true or false

console.log(verify);