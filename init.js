const rsaWrapper = require('./components/rsa-wrapper');

rsaWrapper.generate('server');
rsaWrapper.generate('client');

console.log('Keys generated ...');