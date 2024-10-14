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
const tl = require("azure-pipelines-task-lib/task");
const IspwDownloader_1 = require("./IspwDownloader");
const ContainerDownloadDTO = require("./transferObj/ContainerDownloadDTO");
const RepositoryDownloadDTO = require("./transferObj/RepositoryDownloadDTO");
const Header = require("./transferObj/Header");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("PlanUri:" + "user:$($System.AccessToken)");
            let ispwDownloader = new IspwDownloader_1.IspwDownloader();
            let header = new Header();
            yield ispwDownloader.buildHeadersToDownloadSource(header).then(function () {
                const downloadSourceType = tl.getInput('downloadSourceType', true);
                if (downloadSourceType != undefined) {
                    if (downloadSourceType == 'Container') {
                        //Download source from different ISPW container types
                        console.log("Downloading Container");
                        let containerDownloadDTO = new ContainerDownloadDTO();
                        ispwDownloader.buildArgumentsToDownloadContainer(containerDownloadDTO);
                        ispwDownloader.downloadContainerSource(containerDownloadDTO, header);
                    }
                    else if (downloadSourceType == 'Repository') {
                        //Download source from ISPW Repository
                        console.log("Downloading Repository");
                        let repositoryDownloadDTO = new RepositoryDownloadDTO();
                        ispwDownloader.buildArgumentsToDownloadRepository(repositoryDownloadDTO);
                        ispwDownloader.downloadRepositorySource(repositoryDownloadDTO, header);
                    }
                }
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
