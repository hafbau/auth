const auth = require('./index');
const test = require('tape-promise/tape');

const credential = { email: 'blah495@blah.blh', password: 'test123' };

test('Auth should register given email and passwords', function(t) {
    return auth.registerWithEmailAndPassword(credential)
        .then(async (user) => {
            t.equal(user.email, credential.email)
            t.ok(auth.currentUser)
            t.equal(auth.currentUser.email, credential.email)
        })
});

test('Auth should be logged in after register', function(t) {
    return auth.isLoggedIn()
        .then(async (loggedIn) => {
            t.ok(loggedIn)
            t.equal(loggedIn.email, credential.email)
        })
});