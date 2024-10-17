class ContainerDownloadDTO {
    sourceDownloadLocation: string;
    componentType: string = "";
    level: string = "";
    downloadIncludes: string = "";
    downloadUnchangedSource: string = "";
    runtimeConfig: string | undefined = "";
    codePage: string | undefined = "";
  
    constructor(sourceDownloadLocation: string, componentType: string, level: string, downloadIncludes: string, downloadUnchangedSource: string, runtimeConfig: string, codePage: string) {
      this.sourceDownloadLocation = sourceDownloadLocation;
      this.componentType = componentType;
      this.level = level;
      this.downloadIncludes = downloadIncludes;
      this.downloadUnchangedSource = downloadUnchangedSource;
      this.runtimeConfig = runtimeConfig;
      this.codePage = codePage;
    }
  }
  
  module.exports = ContainerDownloadDTO;