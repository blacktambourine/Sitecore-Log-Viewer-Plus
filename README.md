# BlackTambourine.LogViewerPlus v1.0.5
Enhanced Log Viewer for Sitecore

This is a Log Viewer for Sitecore websites.

Features:

- Filter by Status (i.e. Info, Warn, Error)
- Colour coding by Status
- Filter by Date and Time rather than looking for the relevant log file; i.e. select a Day Date, From Time and To Time. 
- Where there are multiple log files for a calendar day, these will be concatenated together.
- Filter by Log File Type; e.g. log.txt, Fxm.log.txt etc.
- Categorizes log entries; these Categories can be filtered on.
- Runs as a single page web app (using Angular JS / Web API) so is lightweight.
- Default search is for the last hour of log files.
- The Sitecore Package installer now adds a link to the LogViewer on the Sitecore Dashboard.

Dependencies:

Has a dependency on Web API 5.2.3, but also .Net Framework 4.5.2
i.e.
System.Web.Http v5.2.3
System.Web.WebHost v5.2.3

Sitecore 8.1 comes with this version out of the box, you will need to update the System.Web Dll's in your Sitecore websites bin folder for older versions of Sitecore. This has been tested with Sitecore 8.0, 8.1, 8.2 without issue.
The source code requires you to have the Sitecore official nuget feed setup i.e. https://sitecore.myget.org/F/sc-packages/

Installation:

There are two install options, both found in the Installers directory:

- Nuget Package (.nupkg) for use with Visual Studio, Build Server, or Deployment server.
- A Sitecore Installer (.zip) for installing in Sitecore through the Desktop -> Development Tools -> Installation Wizard.



To Access the logview enter this url:

http://hostname/logviewerplus/default.html

