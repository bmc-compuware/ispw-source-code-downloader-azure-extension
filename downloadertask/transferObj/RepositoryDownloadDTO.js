"use strict";
class RepositoryDownloadDTO {
    constructor(runtimeConfig, codePage, sourceDownloadLocation, componentTypes, levelOption, applicationRootFolders, downloadCompileOnly, downloadIncludes, downloadUnchangedSource) {
        this.runtimeConfig = "";
        this.codePage = "";
        this.sourceDownloadLocation = "";
        this.componentTypes = "";
        this.levelOption = "";
        this.applicationRootFolders = "";
        this.downloadCompileOnly = "";
        this.downloadIncludes = "";
        this.downloadUnchangedSource = "";
        this.runtimeConfig = runtimeConfig;
        this.codePage = codePage;
        this.sourceDownloadLocation = sourceDownloadLocation;
        this.componentTypes = componentTypes;
        this.levelOption = levelOption;
        this.applicationRootFolders = applicationRootFolders;
        this.downloadCompileOnly = downloadCompileOnly;
        this.downloadIncludes = downloadIncludes;
        this.downloadUnchangedSource = downloadUnchangedSource;
    }
}
module.exports = RepositoryDownloadDTO;
