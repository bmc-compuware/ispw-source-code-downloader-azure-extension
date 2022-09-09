import tl = require('azure-pipelines-task-lib/task');
import { spawn } from 'child_process';

/*  
   Class used ispw Azure downloader extension for downloading source from ispw repository 
   and different container types (Assignment/Release/Set)
*/
export class IspwDownloader {

    /*  
    Function for building common parameters which we pass for 
    downloading source from containers and ispw repositories.
    */
    buildCommonArgumentsToDownloadSource(cliArguments: any): void {
        const connectionId: string | undefined = tl.getInput('connectionId', true);
        if (connectionId !== undefined) {
            var connection = connectionId.split('#');
            var codePageWithSpaces = connection[1];
            var codePage = codePageWithSpaces.split(' ')[0];
            cliArguments.set("codePage", codePage);

            var hostPort = connection[0].split(':');
            var host = hostPort[0];
            cliArguments.set("host", host);

            var port = hostPort[1];
            cliArguments.set("port", port);
        }

        const windowsTopazWorkbenchCliHome: string | undefined = tl.getInput('windowsTopazWorkbenchCliHome', true);
        if (windowsTopazWorkbenchCliHome != undefined) {
            cliArguments.set("windowsTopazWorkbenchCliHome", windowsTopazWorkbenchCliHome);
        }

        const windowsSourceDownloadLocation: string | undefined = tl.getInput('windowsSourceDownloadLocation', true);
        if (windowsSourceDownloadLocation != undefined) {
            cliArguments.set("windowsSourceDownloadLocation", windowsSourceDownloadLocation);
        }

        const userId: string | undefined = tl.getInput('ispwUserId', true);
        if (userId != undefined) {
            cliArguments.set("userId", userId);
        }

        const password: string | undefined = tl.getInput('password', true);
        if (password != undefined) {
            cliArguments.set("password", password);
        }

        const runtimeConfig: string | undefined = tl.getInput('runtimeConfig', false);
        if (runtimeConfig != undefined) {
            cliArguments.set("runtimeConfig", runtimeConfig);
        }
        else{
            cliArguments.set("runtimeConfig", "");
        }

        const downloadIncludes: string | undefined = tl.getInput('downloadIncludes', false);
        if (downloadIncludes != undefined) {
            cliArguments.set("downloadIncludes", downloadIncludes);
        }

        const downloadUnchangedSource: string | undefined = tl.getInput('downloadUnchangedSource', false);
        if (downloadUnchangedSource != undefined) {
            cliArguments.set("downloadUnchangedSource", downloadUnchangedSource);
        }
    }

    /*  
    Function for building parameters which we pass for 
    downloading source from containers.
    */
    buildCLIArgumentsToDownloadContainer(cliArguments: any): void {
        const containerType: string | undefined = tl.getInput('containerType', true);
        if (containerType !== undefined) {
            var container = "";
            if (containerType == 'Set') {
                console.log("Downloading Set");
                container = '2';
            }
            else if (containerType == 'Release') {
                console.log("Downloading Release");
                container = '1';
            }
            else {
                console.log("Downloading Assignment");
                container = '0';
            }
            cliArguments.set("container", container);
        }

        const containerId: string | undefined = tl.getInput('containerId', true);
        if (containerId != undefined) {
            cliArguments.set("containerId", containerId);
        }

        const componentType: string | undefined = tl.getInput('componentType', false);
        if (componentType != undefined) {
            cliArguments.set("componentType", componentType);
        }
        else{
            cliArguments.set("componentType", "");
        }

        const taskLevel: string | undefined = tl.getInput('taskLevel', false);
        if (taskLevel != undefined) {
            cliArguments.set("taskLevel", taskLevel);
        }
        else{
            cliArguments.set("taskLevel", "");
        }
    }

    /*  
    Function for downloading source from different
    containers types(Assignment/Set/Release)
    */
    downloadContainerSource(cliArguments: any): void {
        //Calling bat command
        var bat = require.resolve(cliArguments.get("windowsTopazWorkbenchCliHome") + '/SCMDownloaderCLI.bat');
        var ls = spawn(bat, ['-host', cliArguments.get("host"), '-port', cliArguments.get("port"), '-code', cliArguments.get("codePage"), '-id',
            cliArguments.get("userId"), '-pass', cliArguments.get("password"), '-targetFolder', cliArguments.get("windowsSourceDownloadLocation"),
            '-scm', 'ispwc', '-ispwContainerName', cliArguments.get("containerId"), '-ispwContainerType', cliArguments.get("container"),
            '-ispwComponentType', cliArguments.get("componentType"), '-ispwDownloadAll', cliArguments.get("downloadUnchangedSource"),
            '-ispwDownloadIncl', cliArguments.get("downloadIncludes"), '-ispwServerLevel', cliArguments.get("taskLevel"),
            '-ispwServerConfig', cliArguments.get("runtimeConfig")
        ]);
        console.log(ls);

        ls.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            console.log('child process exited with code ' + code);
        });
    }

    /*  
    Function for building parameters which we pass for 
    downloading source from ISPW Repository.
    */
    buildCLIArgumentsToDownloadRepository(cliArguments: any):void{
        const stream: string | undefined = tl.getInput('stream', true);
        if (stream != undefined) {
            cliArguments.set("stream", stream);
        }

        const application: string | undefined = tl.getInput('application', true);
        if (stream != undefined) {
            cliArguments.set("application", application);
        }

        const subAppl: string | undefined = tl.getInput('subAppl', false);
        if (subAppl != undefined) {
            cliArguments.set("subAppl", subAppl);
        }
        else{
            cliArguments.set("subAppl", "");
        }

        const repositoryLevel: string | undefined = tl.getInput('repositoryLevel', false);
        if (repositoryLevel != undefined) {
            cliArguments.set("repositoryLevel", repositoryLevel);
        }

        const levelOption: string | undefined = tl.getInput('levelOption', false);
        if (levelOption != undefined) {
            if(levelOption == 'SelectedLevelOnly')
            {
                console.log("Downloading Selected Level Only");
                cliArguments.set("levelOption", '0');
            }
            else if(levelOption == 'FirstFoundLevelAndAbove')
            {
                console.log("Downloading First Found Level and Above");
                cliArguments.set("levelOption", '1');
            }
        }

        const componentTypes: string | undefined = tl.getInput('componentTypes', false);
        if (componentTypes != undefined) {
            cliArguments.set("componentTypes", componentTypes);
        }
        else{
            cliArguments.set("componentTypes", "");
        }

        const applicationRootFolderNames: string | undefined = tl.getInput('applicationRootFolderNames', false);
        if (applicationRootFolderNames != undefined) {
            cliArguments.set("applicationRootFolderNames", applicationRootFolderNames);
        }
        else{
            cliArguments.set("applicationRootFolderNames", "");
        }

        const downloadCompileOnly: string | undefined = tl.getInput('downloadCompileOnly', false);
        if (downloadCompileOnly != undefined) {
            cliArguments.set("downloadCompileOnly", downloadCompileOnly);
        }
    }

    /*  
    Function for downloading source from 
    ISPW Repository
    */
    downloadRepositorySource(cliArguments: any): void {
        //Calling bat command
        var bat = require.resolve(cliArguments.get("windowsTopazWorkbenchCliHome") + '/SCMDownloaderCLI.bat');
        var ls = spawn(bat, ['-host', cliArguments.get("host"), '-port', cliArguments.get("port"), '-code', cliArguments.get("codePage"), '-id',
            cliArguments.get("userId"), '-pass', cliArguments.get("password"), '-targetFolder', cliArguments.get("windowsSourceDownloadLocation"),
            '-scm', 'ISPW', '-ispwServerConfig', cliArguments.get("runtimeConfig"),'-ispwServerStream', cliArguments.get("stream"), '-ispwServerApp', cliArguments.get("application"),
            '-ispwServerLevel', cliArguments.get("repositoryLevel"), '-ispwDownloadAll', cliArguments.get("downloadUnchangedSource"),
            '-ispwDownloadIncl', cliArguments.get("downloadIncludes"), '-ispwLevelOption', cliArguments.get("levelOption"),
            '-ispwComponentType',cliArguments.get("componentTypes"),'-ispwFolderName',cliArguments.get("applicationRootFolderNames"),
            '-ispwDownloadWithCompileOnly',cliArguments.get("downloadCompileOnly")
        ]);
        console.log(ls);

        ls.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        ls.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        ls.on('exit', function (code) {
            console.log('child process exited with code ' + code);
        });
    }
}