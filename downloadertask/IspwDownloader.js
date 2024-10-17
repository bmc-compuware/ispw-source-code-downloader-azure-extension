"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IspwDownloader = void 0;
const tl = require("azure-pipelines-task-lib/task");
const CommonService = require("./utils/CommonService");
const CertificateUtils = require("./utils/CertificateUtils");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
/*
   Class used ispw Azure downloader extension for downloading source from ispw repository
   and different container types (Assignment/Release/Set)
*/
class IspwDownloader {
    /*
    Function for building common parameters which we pass for
    downloading source from containers and ispw repositories.
    */
    buildHeadersToDownloadSource(header) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionId = tl.getInputRequired("connectionId");
            let connection = connectionId != undefined ? connectionId.split("#") : "";
            let codePage = connection[1].trim();
            let conStr = connection[0];
            let hostPortArr = conStr.split(":");
            header.cesUrl = tl.getInputRequired('cesUrl');
            header.codePage = codePage;
            header.host = hostPortArr[0];
            header.port = hostPortArr[1];
            const authenticationType = tl.getInputRequired('authenticationType');
            header.authType = authenticationType;
            header.trustAllCerts = tl.getBoolInput('trustAllCerts');
            const cesUrlObj = new URL(header.cesUrl);
            if (cesUrlObj.protocol == 'https:') {
                const connectedServiceName = tl.getInputRequired('connectedServiceName');
                const keyvaultName = tl.getInputRequired('keyvaultName');
                const certificateName = tl.getInputRequired('certificateName');
                const certUtils = new CertificateUtils();
                yield certUtils.getCertificate(authenticationType, connectedServiceName, keyvaultName, certificateName).then(function (authenticate) {
                    header.certContent = authenticate.certificate;
                    header.certKey = authenticate.pkcs;
                    header.cesToken = authenticate.cesToken;
                });
            }
            else {
                header.cesToken = tl.getInputRequired('cesSecretToken');
            }
            const downloadSourceType = tl.getInputRequired('downloadSourceType');
            if (downloadSourceType == 'Container') {
                header.containerId = tl.getInputRequired('containerId');
                header.containerType = tl.getInputRequired('containerType');
            }
            else if (downloadSourceType == 'Repository') {
                header.stream = tl.getInputRequired('stream');
                header.application = tl.getInputRequired('application');
                let subAppl = tl.getInput('subAppl');
                if (subAppl != undefined) {
                    header.subAppl = tl.getInput('subAppl');
                }
                header.level = tl.getInputRequired('repositoryLevel');
            }
        });
    }
    /*
    Function for building parameters which we pass for
    downloading source from containers.
    */
    buildArgumentsToDownloadContainer(containerDownloadDTO) {
        containerDownloadDTO.sourceDownloadLocation = tl.getInputRequired('sourceDownloadLocation');
        containerDownloadDTO.runtimeConfig = tl.getInput('runtimeConfig', false);
        const componentType = tl.getInput('componentType', false);
        if (componentType != undefined) {
            containerDownloadDTO.componentType = componentType;
        }
        const taskLevel = tl.getInput('taskLevel', false);
        if (taskLevel != undefined) {
            containerDownloadDTO.level = taskLevel;
        }
        const downloadIncludes = tl.getInput('downloadIncludes', false);
        if (downloadIncludes != undefined) {
            containerDownloadDTO.downloadIncludes = downloadIncludes;
        }
        const downloadUnchangedSource = tl.getInput('downloadUnchangedSource', false);
        if (downloadUnchangedSource != undefined) {
            containerDownloadDTO.downloadUnchangedSource = downloadUnchangedSource;
        }
    }
    /*
    Function for downloading source from different
    containers types(Assignment/Set/Release)
    */
    downloadContainerSource(containerDownloadDTO, header) {
        return __awaiter(this, void 0, void 0, function* () {
            containerDownloadDTO.codePage = header.codePage;
            const url = header.cesUrl + "/ispw/" + containerDownloadDTO.runtimeConfig + "/downloads/" + header.containerType + "/" + header.containerId;
            const cmnService = new CommonService();
            yield cmnService.doPostRequest(url, header.host, header.port, containerDownloadDTO, header.authType, header.cesToken, header.certContent, header.certKey, true, false).then(function (response) {
                if (response.status && response.status == 200) {
                    var fileName = response.headers['content-disposition'].split("=")[1].replace(/\"/g, "");
                    _processZIPFile(fileName, response.data);
                }
                else if (response instanceof Error) {
                    throw new Error(response.message);
                }
                else {
                    console.error("Error occurred while fetching the source for " + header.containerType + " container : " + header.containerId + " : " + response.data.message);
                    throw new Error(response.data.message);
                }
            });
        });
    }
    ;
    /*
    Function for building parameters which we pass for
    downloading source from ISPW Repository.
    */
    buildArgumentsToDownloadRepository(repositoryDownloadDTO) {
        repositoryDownloadDTO.sourceDownloadLocation = tl.getInputRequired('sourceDownloadLocation');
        repositoryDownloadDTO.runtimeConfig = tl.getInput('runtimeConfig', false);
        const levelOption = tl.getInput('levelOption', false);
        if (levelOption != undefined) {
            if (levelOption == 'SelectedLevelOnly') {
                repositoryDownloadDTO.levelOption = '0';
            }
            else if (levelOption == 'FirstFoundLevelAndAbove') {
                repositoryDownloadDTO.levelOption = '1';
            }
        }
        const componentTypes = tl.getInput('componentTypes', false);
        if (componentTypes != undefined) {
            repositoryDownloadDTO.componentTypes = componentTypes;
        }
        const applicationRootFolderNames = tl.getInput('applicationRootFolderNames', false);
        if (applicationRootFolderNames != undefined) {
            repositoryDownloadDTO.applicationRootFolders = applicationRootFolderNames;
        }
        const downloadCompileOnly = tl.getInput('downloadCompileOnly', false);
        if (downloadCompileOnly != undefined) {
            repositoryDownloadDTO.downloadCompileOnly = downloadCompileOnly;
        }
        const downloadIncludes = tl.getInput('downloadIncludes');
        if (downloadIncludes != undefined) {
            repositoryDownloadDTO.downloadIncludes = downloadIncludes;
        }
        const downloadUnchangedSource = tl.getInput('downloadUnchangedSource');
        if (downloadUnchangedSource != undefined) {
            repositoryDownloadDTO.downloadUnchangedSource = downloadUnchangedSource;
        }
    }
    /*
    Function for downloading source from
    ISPW Repository
    */
    downloadRepositorySource(repositoryDownloadDTO, header) {
        return __awaiter(this, void 0, void 0, function* () {
            repositoryDownloadDTO.codePage = header.codePage;
            let url = header.cesUrl + "/ispw/" + repositoryDownloadDTO.runtimeConfig + "/downloads/repository/" + header.stream + "/" + header.application;
            if (header.subAppl != undefined) {
                url += "/" + header.subAppl;
            }
            url += "/" + header.level;
            const cmnService = new CommonService();
            yield cmnService.doPostRequest(url, header.host, header.port, repositoryDownloadDTO, header.authType, header.cesToken, header.certContent, header.certKey, true, false).then(function (response) {
                if (response instanceof Error) {
                    console.log(response);
                }
                else {
                    if (response.status == 200) {
                        var fileName = response.headers['content-disposition'].split("=")[1].replace(/\"/g, "");
                        _processZIPFile(fileName, response.data);
                    }
                    else {
                        console.error("Error occurred while fetching the source for stream " + header.stream + ", application : " + header.application + ", subapplication " + header.subAppl + ", level : " + header.level + response.data.message);
                    }
                }
            });
        });
    }
}
exports.IspwDownloader = IspwDownloader;
function _processZIPFile(fileName, data) {
    var agentWorkFolder = tl.getVariable("Build_ArtifactStagingDirectory");
    var filePath = path.normalize(agentWorkFolder + path.sep + fileName);
    const writer = fs.createWriteStream(filePath);
    data.pipe(writer);
    writer.on('finish', function () {
        console.debug("Finished writing response data.");
        console.debug("Extracting source...");
        var zip = new AdmZip(filePath);
        var outputFolder = filePath.replace(".zip", "");
        zip.extractAllTo(outputFolder, true);
        console.debug("Source extracted to : " + agentWorkFolder);
        fs.unlink(filePath, function (err) {
            if (err) {
                console.debug("ZIP file delete failed : " + err);
            }
            console.debug("ZIP file deleted successfully.");
        });
    });
    writer.on('error', function (err) {
        console.error("Error thrown while creating ZIP on azure agent." + err);
        throw new Error(err.message);
    });
}
