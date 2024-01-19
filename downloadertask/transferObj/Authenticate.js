"use strict";
class Authenticate {
    constructor(pkcs, certificate, cesToken) {
        this.pkcs = pkcs;
        this.certificate = certificate;
        this.cesToken = cesToken;
    }
}
module.exports = Authenticate;
