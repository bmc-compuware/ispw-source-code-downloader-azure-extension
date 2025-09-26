class RepositoryDownloadDTO {
    runtimeConfig : string | undefined = "";
    codePage: string = "";
    sourceDownloadLocation: string = "";
    componentTypes: string = "";
    levelOption: string = "";
    applicationRootFolders: string = "";
    downloadCompileOnly: string = "";
    downloadIncludes: string = "";
    downloadUnchangedSource: string = "";
    categorizeOnComponentType: string = "";
    categorizeOnSubAppl: string = "";
  
    constructor(runtimeConfig: string, codePage: string, sourceDownloadLocation: string, componentTypes: string, levelOption: string, applicationRootFolders: string, downloadCompileOnly: string, downloadIncludes: string, downloadUnchangedSource: string, categorizeOnComponentType: string, categorizeOnSubAppl: string) {
      this.runtimeConfig = runtimeConfig;
      this.codePage = codePage;
      this.sourceDownloadLocation = sourceDownloadLocation;
      this.componentTypes = componentTypes;
      this.levelOption = levelOption;
      this.applicationRootFolders = applicationRootFolders;
      this.downloadCompileOnly = downloadCompileOnly;
      this.downloadIncludes = downloadIncludes;
      this.downloadUnchangedSource = downloadUnchangedSource;
      this.categorizeOnComponentType = categorizeOnComponentType;
      this.categorizeOnSubAppl = categorizeOnSubAppl;
    }
  }
  
  module.exports = RepositoryDownloadDTO;