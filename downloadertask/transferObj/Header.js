"use strict";
class Header {
    constructor() {
        this.cesUrl = "";
        this.authType = "";
        this.cesToken = "";
        this.codePage = "";
        this.host = "";
        this.port = "";
        this.trustAllCerts = false;
        //path params to download container source
        this.containerType = "";
        this.containerId = "";
        //path params to download repository source
        this.stream = "";
        this.application = "";
        this.subAppl = "";
        this.level = "";
    }
    Header(cesUrl, authType, cesToken, containerType, containerId, stream, application, subAppl, level, codePage) {
        this.cesUrl = cesUrl;
        this.authType = authType;
        this.cesToken = cesToken;
        this.containerType = containerType;
        this.containerId = containerId;
        this.stream = stream;
        this.application = application;
        this.subAppl = subAppl;
        this.level = level;
        this.codePage = codePage;
    }
}
module.exports = Header;
