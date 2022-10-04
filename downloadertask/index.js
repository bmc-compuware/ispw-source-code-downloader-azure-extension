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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let cliArguments = new Map();
            let ispwDownloader = new IspwDownloader_1.IspwDownloader();
            ispwDownloader.buildCommonArgumentsToDownloadSource(cliArguments);
            const downloadSourceType = tl.getInput('downloadSourceType', true);
            if (downloadSourceType != undefined) {
                if (downloadSourceType == 'Container') {
                    //Download source from different ISPW container types
                    console.log("Downloading Container");
                    ispwDownloader.buildCLIArgumentsToDownloadContainer(cliArguments);
                    ispwDownloader.downloadContainerSource(cliArguments);
                }
                else if (downloadSourceType == 'Repository') {
                    //Download source from ISPW Repository
                    console.log("Downloading Repository");
                    ispwDownloader.buildCLIArgumentsToDownloadRepository(cliArguments);
                    ispwDownloader.downloadRepositorySource(cliArguments);
                }
            }
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
