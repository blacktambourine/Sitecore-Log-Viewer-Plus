# BlackTambourine.LogViewerPlus v1.0
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


Dependencies:

Has a dependency on Web API 2.2
i.e.
System.Web.Http v5.2.3
System.Web.WebHost v5.2.3

Sitecore 8.1 comes with this version out of the box, you will need to update the System.Web Dll's in your Sitecore websites bin folder for older versions of Sitecore. This has been tested with Sitecore 8.0 and 8.1 without issue.


Installation:

There are two install options, both found in the Installers directory:

- Nuget Package (.nupkg) for use with Visual Studio, Build Server, or Deployment server.
- A Sitecore Installer (.zip) for installing in Sitecore through the Desktop -> Development Tools -> Installation Wizard.



