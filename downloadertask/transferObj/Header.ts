class Header {
    cesUrl: string = "";
    authType: string = "";
    cesToken: string = "";
    codePage: string = "";
    certKey: string | undefined;
    certContent: string | undefined;
    host: string = "";
    port: string = "";
    trustAllCerts: boolean = false;

    //path params to download container source
    containerType: string = "";
    containerId: string = "";

    //path params to download repository source
    stream: string = "";
    application: string = "";
    subAppl: string | undefined = "";
    level: string = "";

    Header(cesUrl: string, authType: string, cesToken: string, containerType: string, containerId: string, stream: string, application: string, subAppl: string, level: string, codePage: string) {
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