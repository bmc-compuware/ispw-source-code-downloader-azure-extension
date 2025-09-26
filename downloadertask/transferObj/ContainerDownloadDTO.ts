class ContainerDownloadDTO {
    sourceDownloadLocation: string;
    componentType: string = "";
    level: string = "";
    downloadIncludes: string = "";
    downloadUnchangedSource: string = "";
    runtimeConfig: string | undefined = "";
    codePage: string | undefined = "";
    categorizeOnComponentType: string = "";
    categorizeOnSubAppl: string = "";
  
    constructor(sourceDownloadLocation: string, componentType: string, level: string, downloadIncludes: string, downloadUnchangedSource: string, runtimeConfig: string, codePage: string, categorizeOnComponentType: string, categorizeOnSubAppl: string) {
      this.sourceDownloadLocation = sourceDownloadLocation;
      this.componentType = componentType;
      this.level = level;
      this.downloadIncludes = downloadIncludes;
      this.downloadUnchangedSource = downloadUnchangedSource;
      this.runtimeConfig = runtimeConfig;
      this.codePage = codePage;
      this.categorizeOnComponentType = categorizeOnComponentType;
      this.categorizeOnSubAppl = categorizeOnSubAppl;
    }
  }
  
  module.exports = ContainerDownloadDTO;