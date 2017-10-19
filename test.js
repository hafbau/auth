const auth = require('./index');
const test = require('tape-promise/tape');

// Unfortunately, this test currently makes a real call to the authServer
// so ensure that the server is up and increment the number
// on the 'blah...' email before running the test.
// TODO: stub/mock the ajax part out
const credential = { email: 'blah555@blah.blh', password: 'test123' };

test('Auth#register should register given email and passwords', function(t) {
    return auth.registerWithEmailAndPassword(credential)
        .then(async (user) => {
            t.equal(user.email, credential.email)
            t.ok(auth.currentUser)
            t.equal(auth.currentUser.email, credential.email)
        })
});

test('Auth#isLoggedIn should be return current user after register', function(t) {
    return auth.isLoggedIn()
        .then((loggedIn) => {
            t.ok(loggedIn)
            t.equal(loggedIn.email, credential.email)
        })
});

test('Auth#logout should logout current user', function(t) {
    return auth.logout()
        .then(response => {
            t.ok(response.sucess, 'Logged out sucessfully.')
            t.notOk(response.loggedIn, 'LoggedIn is now falsy')
            t.equal(auth.currentUser, null, 'Current User is null')
            t.equal(auth.token, undefined, 'Token now is undefined')
        })
});