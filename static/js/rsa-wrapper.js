(function () {

    'use strict';

    var crypto = window.crypto.subtle;
    var rsaParams =  {name:"RSA-OAEP", hash: {name: "SHA-1"}};

    function importPublicKey(keyInPemFormat){
        return new Promise(function(resolve, reject){
            var key = converterWrapper.convertPemToBinary2(keyInPemFormat);
            key = converterWrapper.base64StringToArrayBuffer(key);

            crypto.importKey('spki', key, rsaParams, false, ["encrypt"])
                .then(function(cryptokey) {
                    resolve(cryptokey);
                });
        });
    }

    function importPrivateKey(keyInPemFormat){

        var key = converterWrapper.convertPemToBinary2(keyInPemFormat);
        key = converterWrapper.base64StringToArrayBuffer(key);

        return new Promise(function(resolve, reject){
            crypto.importKey('pkcs8', key, rsaParams, false, ["decrypt"])
                .then(function(cryptokey) {
                    resolve(cryptokey);
                });
        });
    }

    function publicEncrypt(keyInPemFormat, message) {
        return new Promise(function(resolve, reject){
            importPublicKey(keyInPemFormat).then(function (key) {
                crypto.encrypt(rsaParams, key, converterWrapper.str2abUtf8(message))
                    .then(function(encrypted){
                        resolve(converterWrapper.arrayBufferToBase64String(encrypted));
                    });
            })
        });
    }

    function privateDecrypt(keyInPemFormat, encryptedBase64Message) {
        return new Promise(function(resolve, reject){
            importPrivateKey(keyInPemFormat).then(function (key) {
                crypto.decrypt(rsaParams, key, converterWrapper.base64StringToArrayBuffer(encryptedBase64Message))
                    .then(function(decrypted){
                        resolve(converterWrapper.arrayBufferToUtf8(decrypted));
                    });
            });
        });
    }

    window.rsaWrapper = {
        importPrivateKey: importPrivateKey,
        importPublicKey: importPublicKey,
        privateDecrypt: privateDecrypt,
        publicEncrypt: publicEncrypt
    }

}());
