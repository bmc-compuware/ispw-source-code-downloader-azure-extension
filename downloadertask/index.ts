import tl = require('azure-pipelines-task-lib/task');
import { IspwDownloader } from './IspwDownloader';

async function run() {
    try {
        let cliArguments = new Map<string, string>();
        let ispwDownloader: IspwDownloader = new IspwDownloader();
        ispwDownloader.buildCommonArgumentsToDownloadSource(cliArguments);
        const downloadSourceType: string | undefined = tl.getInput('downloadSourceType', true);
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
    catch (err: any) 
    {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();