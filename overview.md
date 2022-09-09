# Compuware Source Code Download for ISPW

![](images/bmc-icon.png)

## Overview

The Compuware Source Code Download for ISPW plugin allows users to download ISPW members from the mainframe to the PC. Source can then be accessed on the PC, for example, for SonarQube analysis and reporting.

## Prerequisites

The following are required to use this plugin:
- Azure Devops
- Topaz Workbench CLI. Refer to the [Topaz Workbench Install Guide](https://docs.compuware.com/kb/KB2001/PDF/TopazWorkbench_Install.pdf) for instructions.

## Configuring for Topaz Workbench CLI & Host Connections

In order to download ISPW members you will need to point to an installed Topaz Workbench Command Line Interface (CLI). The Topaz Workbench CLI will work with host connection(s) to download ISPW members.

- See [Configuring for Topaz Workbench CLI & Host Connections](https://github.com/jenkinsci/compuware-common-configuration-plugin/blob/master/README.md#user-content-configuring-for-topaz-workbench-cli--host-connections)


### Downloading ISPW Container members

This integration allows downloading of ISPW Container members from the mainframe to the PC.

On the **Configuration** page of the job or project, select **ISPW Container** from the **Source Code Management** section.

This source code management action has following parameters:

- **Host connection** : Select the host connection to be used to connect to the z/OS host.


- **Runtime configuration** : Enter the host runtime configuration. To use the default configuration, leave the field blank.

- **Login credentials** : Select the stored credentials to use for logging onto the z/OS host.

Do the following in the **Filter** section to identify ISPW members to be downloaded:

- **Container name** : Enter the name of the container to target for the download.

- **Container type** list (do one of the following):

     - **Assignment** : Select if the specified **Container name** is an assignment.
     - **Release** : Select if the specified **Container name** is a release.
     - **Set** : Select if the specified **Container name** is a set.

- **Level** : Optionally use to identify components at a specific level in the life cycle to download (such as DEV1, STG1, or PRD).
- **Component type** : Optionally use to identify components of a specific type to download (such as COB, COPY, or JOB).
- **Force download of unchanged source** : Optionally use to indicate that all source matching the current filter should be downloaded, regardless of whether it has been changed recently or not. If this box is left unchecked, it will delete any files in the workspace that no longer match the filter specified above. Leaving it unchecked will also only download source that has been changed since the last time the job was run.

Click **Save**.

Run the job, which by default the following occurs:
- Mainframe source is downloaded to the project's or job's workspace into an <ISPW Application name>/MF_Source folder.
- Folder components are downloaded into an <ISPW Application name> folder.


### Downloading ISPW Repository members

This integration allows downloading of ISPW Repository members from the mainframe to the PC.

On the Configuration page of the job or project, select ISPW Repository from the Source Code Management section.

This source code management action has following parameters:

- **Host connection** : Select the host connection to be used to connect to the z/OS host.

Do the following in the **Filter** section to identify ISPW members to be downloaded:

- **Stream** : Enter the two- to eight-character code that defines the application structure with which the application is associated.
- ** Application** : Enter the container's primary application code. Containers may include components from multiple applications.
- ** Level** : Enter the life cycle level.
- **Level option** list (do one of the following):
     - **Selected level only** : Select to display only components at the selected life cycle level in the view.
     - **First found in level and above** : Select to display the first version found of each component at the selected level and above. In other words, if there are multiple versions in the life cycle, display one version of the component that is the first one found at the selected level and any levels in the path above it.
- **Component types** and/or **Application root folder names** : Optionally use to identify components and application root folders to download.
      - To download a folder that matches the name specified (and all of its contents) and download all components outside of a folder that match the specified type, enter values in both the **Component types** and **Application root folder names** fields. Enter in the **Component types** field the component type (such as COB, COPY, or JOB) on which to filter. Enter in the **Application root folder names** field the name of the folder on which to filter. For example, entering **COB** in the Component types field and **FolderX** in the **Application root folder names** field will download FolderX and all of its contents, as well as all of the COB files that exist outside of folders.
      - To download all components of a specified type regardless of whether they are within folders, use only the **Component types** field by entering the component type (such as COB, COPY, or JOB) on which to filter.
      - To download a folder that matches the name specified (and all of its contents), as well as all components that are not within a folder, use only the **Application root folder names** field by entering the name of the folder on which to filter.
      - To download all components and folders in the application and level selected, leave both fields empty.
      - **Force download of unchanged source** : Optionally use to indicate that all source matching the current filter should be downloaded, regardless of whether it has been changed recently or not. If this box is left unchecked, it will delete any files in the workspace that no longer match the filter specified above. Leaving it unchecked will also only download source that has been changed since the last time the job was run.

Click **Save**.

Run the job, which by default the following occurs:
- Mainframe source is downloaded to the project's or job's workspace into an <ISPW Application name>/MF_Source folder.
- Folder components are downloaded into an <ISPW Application name> folder.


## Using Pipeline Syntax to Generate Pipeline Script

- Do one of the following:

    - When working with an existing Pipeline job, click the **Pipeline Syntax** link in the left panel. The **Snippet Generator** appears.

    - When configuring a Pipeline job, click the **Pipeline Syntax** link at the bottom of the **Pipeline **configuration section. The **Snippet Generator** appears.

- **Sample Step** : Select **checkout: General SCM** .

- **SCM** : Select **Endevor**, **ISPW Container**, **ISPW Repository**, or **PDS** as the version control system from which to get the code.

- Complete the remaining fields for the selected SCM.

- Click **Generate Pipeline Script**. The Groovy script to invoke the Compuware Source Code Download for Endevor, PDS, and ISPW plugin appears. The script can be added to the Pipeline section when configuring a Pipeline job. A sample script is shown below:

~~~
stage("Download PDS") {
    node {
        checkout([$class: 'PdsConfiguration',
        connectionId: 'f5264789-8b54-6522-al25-ag54gh85re42',
        credentialsId: 'f4393474-9b86-4155-ae2c-ac11ab71ae47',
        fileExtension: 'cbl',
        filterPattern: 'abc.def'])
    }
}
~~~


## Product Assistance

Compuware provides assistance for customers with its documentation, the Compuware Support Center web site, and telephone customer support.

### Compuware Support Center

You can access online information for Compuware products via our Support Center site at [https://support.compuware.com](https://support.compuware.com/). Support Center provides access to critical information about your Compuware products. You can review frequently asked questions, read or download documentation, access product fixes, or e-mail your questions or comments. The first time you access Support Center, you must register and obtain a password. Registration is free.

### Contacting Customer Support

At Compuware, we strive to make our products and documentation the best in the industry. Feedback from our customers helps us maintain our quality standards. If you need support services, please obtain the following information before calling Compuware\'s 24-hour telephone support:

- The Jenkins job console output that contains any error messages or pertinent information.

- The name, release number, and build number of your product. This information is displayed in the Jenkins / Plugin Manager and go to the Installed tab. Apply filter: Compuware in order to display all of the installed Compuware plugins.

- Job information, whether the job uses Pipeline script or Freestyle project.

- Environment information, such as the operating system and release on which the Topaz CLI is installed.

You can contact Compuware in one of the following ways:

#### Phone

- USA and Canada: 1-800-538-7822 or 1-313-227-5444.

- All other countries: Contact your local Compuware office. Contact information is available at [https://support.compuware.com](https://support.compuware.com/).

#### Web

You can report issues via Compuware Support Center: [https://support.compuware.com](https://support.compuware.com/).

Note: Please report all high-priority issues by phone.

### Corporate Web Site

To access Compuware\'s site on the Web, go to [https://www.compuware.com](https://www.compuware.com/). The Compuware site provides a variety of product and support information.

## Change Log
See [Change Log](https://github.com/jenkinsci/compuware-scm-downloader-plugin/blob/master/CHANGELOG.md)