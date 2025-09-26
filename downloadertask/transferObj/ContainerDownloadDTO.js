"use strict";
class ContainerDownloadDTO {
    constructor(sourceDownloadLocation, componentType, level, downloadIncludes, downloadUnchangedSource, runtimeConfig, codePage, categorizeOnComponentType, categorizeOnSubAppl) {
        this.componentType = "";
        this.level = "";
        this.downloadIncludes = "";
        this.downloadUnchangedSource = "";
        this.runtimeConfig = "";
        this.codePage = "";
        this.categorizeOnComponentType = "";
        this.categorizeOnSubAppl = "";
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
