const auth = require('./index');

auth.registerWithEmailAndPassword({ email: 'blah12@blah.blh', password: 'test123'})
    .then(res => console.log('register res', res))
    .catch(err => console.log('errored', err.message))