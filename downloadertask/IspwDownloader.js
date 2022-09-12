"use strict";
exports.__esModule = true;
exports.IspwDownloader = void 0;
var tl = require("azure-pipelines-task-lib/task");
var child_process_1 = require("child_process");
/*
   Class used ispw Azure downloader extension for downloading source from ispw repository
   and different container types (Assignment/Release/Set)
*/
var IspwDownloader = /** @class */ (function () {
    function IspwDownloader() {
    }
    /*
    Function for building common parameters which we pass for
    downloading source from containers and ispw repositories.
    */
    IspwDownloader.prototype.buildCommonArgumentsToDownloadSource = function (cliArguments) {
        var connectionId = tl.getInput('connectionId', true);
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
        var windowsTopazWorkbenchCliHome = tl.getInput('windowsTopazWorkbenchCliHome', true);
        if (windowsTopazWorkbenchCliHome != undefined) {
            cliArguments.set("windowsTopazWorkbenchCliHome", windowsTopazWorkbenchCliHome);
        }
        var windowsSourceDownloadLocation = tl.getInput('windowsSourceDownloadLocation', true);
        if (windowsSourceDownloadLocation != undefined) {
            cliArguments.set("windowsSourceDownloadLocation", windowsSourceDownloadLocation);
        }
        var userId = tl.getInput('ispwUserId', true);
        if (userId != undefined) {
            cliArguments.set("userId", userId);
        }
        var password = tl.getInput('password', true);
        if (password != undefined) {
            cliArguments.set("password", password);
        }
        var runtimeConfig = tl.getInput('runtimeConfig', false);
        if (runtimeConfig != undefined) {
            cliArguments.set("runtimeConfig", runtimeConfig);
        }
        else {
            cliArguments.set("runtimeConfig", "");
        }
        var downloadIncludes = tl.getInput('downloadIncludes', false);
        if (downloadIncludes != undefined) {
            cliArguments.set("downloadIncludes", downloadIncludes);
        }
        var downloadUnchangedSource = tl.getInput('downloadUnchangedSource', false);
        if (downloadUnchangedSource != undefined) {
            cliArguments.set("downloadUnchangedSource", downloadUnchangedSource);
        }
    };
    /*
    Function for building parameters which we pass for
    downloading source from containers.
    */
    IspwDownloader.prototype.buildCLIArgumentsToDownloadContainer = function (cliArguments) {
        var containerType = tl.getInput('containerType', true);
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
        var containerId = tl.getInput('containerId', true);
        if (containerId != undefined) {
            cliArguments.set("containerId", containerId);
        }
        var componentType = tl.getInput('componentType', false);
        if (componentType != undefined) {
            cliArguments.set("componentType", componentType);
        }
        else {
            cliArguments.set("componentType", "");
        }
        var taskLevel = tl.getInput('taskLevel', false);
        if (taskLevel != undefined) {
            cliArguments.set("taskLevel", taskLevel);
        }
        else {
            cliArguments.set("taskLevel", "");
        }
    };
    /*
    Function for downloading source from different
    containers types(Assignment/Set/Release)
    */
    IspwDownloader.prototype.downloadContainerSource = function (cliArguments) {
        //Calling bat command
        var bat = require.resolve(cliArguments.get("windowsTopazWorkbenchCliHome") + '/SCMDownloaderCLI.bat');
        var ls = child_process_1.spawn(bat, ['-host', cliArguments.get("host"), '-port', cliArguments.get("port"), '-code', cliArguments.get("codePage"), '-id',
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
    };
    /*
    Function for building parameters which we pass for
    downloading source from ISPW Repository.
    */
    IspwDownloader.prototype.buildCLIArgumentsToDownloadRepository = function (cliArguments) {
        var stream = tl.getInput('stream', true);
        if (stream != undefined) {
            cliArguments.set("stream", stream);
        }
        var application = tl.getInput('application', true);
        if (stream != undefined) {
            cliArguments.set("application", application);
        }
        var subAppl = tl.getInput('subAppl', false);
        if (subAppl != undefined) {
            cliArguments.set("subAppl", subAppl);
        }
        else {
            cliArguments.set("subAppl", "");
        }
        var repositoryLevel = tl.getInput('repositoryLevel', false);
        if (repositoryLevel != undefined) {
            cliArguments.set("repositoryLevel", repositoryLevel);
        }
        var levelOption = tl.getInput('levelOption', false);
        if (levelOption != undefined) {
            if (levelOption == 'SelectedLevelOnly') {
                console.log("Downloading Selected Level Only");
                cliArguments.set("levelOption", '0');
            }
            else if (levelOption == 'FirstFoundLevelAndAbove') {
                console.log("Downloading First Found Level and Above");
                cliArguments.set("levelOption", '1');
            }
        }
        var componentTypes = tl.getInput('componentTypes', false);
        if (componentTypes != undefined) {
            cliArguments.set("componentTypes", componentTypes);
            if (componentTypes.length != 0) {
                cliArguments.set("ispwFilterFiles", true);
            }
        }
        else {
            cliArguments.set("componentTypes", "");
            cliArguments.set("ispwFilterFiles", false);
        }
        var applicationRootFolderNames = tl.getInput('applicationRootFolderNames', false);
        if (applicationRootFolderNames != undefined) {
            cliArguments.set("applicationRootFolderNames", applicationRootFolderNames);
            if (applicationRootFolderNames.length != 0) {
                cliArguments.set("ispwFilterFolders", true);
            }
        }
        else {
            cliArguments.set("applicationRootFolderNames", "");
            cliArguments.set("ispwFilterFolders", false);
        }
        var downloadCompileOnly = tl.getInput('downloadCompileOnly', false);
        if (downloadCompileOnly != undefined) {
            cliArguments.set("downloadCompileOnly", downloadCompileOnly);
        }
    };
    /*
    Function for downloading source from
    ISPW Repository
    */
    IspwDownloader.prototype.downloadRepositorySource = function (cliArguments) {
        //Calling bat command
        var bat = require.resolve(cliArguments.get("windowsTopazWorkbenchCliHome") + '/SCMDownloaderCLI.bat');
        var ls = child_process_1.spawn(bat, ['-host', cliArguments.get("host"), '-port', cliArguments.get("port"), '-code', cliArguments.get("codePage"), '-id',
            cliArguments.get("userId"), '-pass', cliArguments.get("password"), '-targetFolder', cliArguments.get("windowsSourceDownloadLocation"),
            '-scm', 'ISPW', '-ispwServerConfig', cliArguments.get("runtimeConfig"), '-ispwServerStream', cliArguments.get("stream"), '-ispwServerApp', cliArguments.get("application"),
            '-ispwServerLevel', cliArguments.get("repositoryLevel"), '-ispwDownloadAll', cliArguments.get("downloadUnchangedSource"),
            '-ispwDownloadIncl', cliArguments.get("downloadIncludes"), '-ispwLevelOption', cliArguments.get("levelOption"),
            '-ispwComponentType', cliArguments.get("componentTypes"), '-ispwFolderName', cliArguments.get("applicationRootFolderNames"),
            '-ispwDownloadWithCompileOnly', cliArguments.get("downloadCompileOnly"), '-ispwFilterFiles',
            cliArguments.get("ispwFilterFiles"), '-ispwFilterFolders', cliArguments.get("ispwFilterFolders")
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
            if (code != null && code != 0) {
                tl.setResult(tl.TaskResult.Failed, " An error may have occurred. Please see task logs or see the log file: " + cliArguments.get("windowsTopazWorkbenchCliHome") + "\\TopazBatchWkspc\\.metadata\\.log.");
            }
        });
    };
    return IspwDownloader;
}());
exports.IspwDownloader = IspwDownloader;
