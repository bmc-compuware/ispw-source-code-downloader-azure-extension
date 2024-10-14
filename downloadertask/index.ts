import tl = require('azure-pipelines-task-lib/task');
import { IspwDownloader } from './IspwDownloader';
const ContainerDownloadDTO = require("./transferObj/ContainerDownloadDTO");
const RepositoryDownloadDTO = require("./transferObj/RepositoryDownloadDTO");
const Header = require("./transferObj/Header");

async function run() {
    try {
        console.log("PlanUri:"+ "user:$($System.AccessToken)");
        let ispwDownloader: IspwDownloader = new IspwDownloader();
        let header: Header = new Header(); 
        await ispwDownloader.buildHeadersToDownloadSource(header).then(function () {
            const downloadSourceType: string | undefined = tl.getInput('downloadSourceType', true);
            if (downloadSourceType != undefined) {
                if (downloadSourceType == 'Container') {
                    //Download source from different ISPW container types
                    console.log("Downloading Container");
                    let containerDownloadDTO: ContainerDownloadDTO = new ContainerDownloadDTO();
                    ispwDownloader.buildArgumentsToDownloadContainer(containerDownloadDTO);
                    ispwDownloader.downloadContainerSource(containerDownloadDTO, header);
                }
                else if (downloadSourceType == 'Repository') {
                    //Download source from ISPW Repository
                    console.log("Downloading Repository");
                    let repositoryDownloadDTO: RepositoryDownloadDTO = new RepositoryDownloadDTO();
                    ispwDownloader.buildArgumentsToDownloadRepository(repositoryDownloadDTO);
                    ispwDownloader.downloadRepositorySource(repositoryDownloadDTO, header);
                }
            }
        });
    }
    catch (err: any) 
    {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();