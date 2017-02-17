const rsaWrapper = require('./components');

rsaWrapper.generate('server');
rsaWrapper.generate('client');

console.log('Keys generated ...');