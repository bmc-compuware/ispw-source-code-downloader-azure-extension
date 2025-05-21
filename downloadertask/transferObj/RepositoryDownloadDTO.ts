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
    cpCategorizeOnComponentType: string = "";
  
    constructor(runtimeConfig: string, codePage: string, sourceDownloadLocation: string, componentTypes: string, levelOption: string, applicationRootFolders: string, downloadCompileOnly: string, downloadIncludes: string,cpCategorizeOnComponentType: string, downloadUnchangedSource: string) {
      this.runtimeConfig = runtimeConfig;
      this.codePage = codePage;
      this.sourceDownloadLocation = sourceDownloadLocation;
      this.componentTypes = componentTypes;
      this.levelOption = levelOption;
      this.applicationRootFolders = applicationRootFolders;
      this.downloadCompileOnly = downloadCompileOnly;
      this.downloadIncludes = downloadIncludes;
      this.cpCategorizeOnComponentType = cpCategorizeOnComponentType;
      this.downloadUnchangedSource = downloadUnchangedSource;
    }
  }
  
  module.exports = RepositoryDownloadDTO;