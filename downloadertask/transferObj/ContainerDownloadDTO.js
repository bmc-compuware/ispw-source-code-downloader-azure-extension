"use strict";
class ContainerDownloadDTO {
    constructor(sourceDownloadLocation, componentType, level, downloadIncludes, downloadUnchangedSource, runtimeConfig, codePage) {
        this.componentType = "";
        this.level = "";
        this.downloadIncludes = "";
        this.downloadUnchangedSource = "";
        this.runtimeConfig = "";
        this.codePage = "";
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
