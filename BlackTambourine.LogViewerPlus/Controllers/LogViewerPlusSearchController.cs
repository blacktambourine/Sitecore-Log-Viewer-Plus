using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using BlackTambourine.LogViewerPlus.Models;
using Sitecore.Configuration;
using Sitecore.IO;

namespace BlackTambourine.LogViewerPlus.Controllers
{
    public class LogViewerPlusSearchController : ApiController
    {
        #region Private Variables
        private DateTime _entryDateTimeCounter = DateTime.Now; //keeps track of the last valid entry date for when a row has no date
        private string _selectedLogDate;
        private DateTime _fromDateFilter;
        private DateTime _toDateFilter;

        private readonly List<string> _errMsgList = new List<string>();
        private readonly List<LogEntry> _logEntries = new List<LogEntry>();
        private IEnumerable<LogEntryStatus> _statusFilters;
        private IEnumerable<LogEntryCategory> _categoryFilters;
        private LogEntryCategory _previousEntrysCategory;

        //Sitecore Instance Info
        private static readonly List<string> _instanceInfoStrings = new List<string>
        {
            "Sitecore.NET",
            "Operating system",
            "Microsoft.NET version",
            "UTC offset:",
            "Machine name:",
            "App pool ID:",
            "Process ID:",
            "Windows identity used by the process:",
            "Managed pipeline mode:",
            "EventQueues enabled:",
            "Instance Name:",
            "Sitecore started"
        };

        private static readonly List<string> _stackTraceStrings = new List<string>
        {
            "Exception",
            "Message:",
            "Source:",
            "at",
            "Nested",
            "Exception:"
        };
        #endregion

        #region Controllers
        [ResponseType(typeof(LogViewerPlusResponse))]
        [HttpGet]
        public IHttpActionResult Get([FromUri] LogViewerPlusRequest request)
        {            
            try
            {
                var result = new LogViewerPlusResponse();

                _statusFilters = ParseLogEntryFiltersToStatus(request.StatusFilters);
                _categoryFilters = ParseLogEntryFiltersToCategory(request.CategoryFilters);
                _fromDateFilter = request.FromDate;
                _toDateFilter = request.ToDate;
                
                var logFolderPath = FileUtil.MapPath(Settings.LogFolder);
                _selectedLogDate = _fromDateFilter.ToString("yyyy-MM-dd");

                //get the first log file for the day, without a time stamp suffix
                var logFirstFileWildcard = request.LogFilePrefix + _fromDateFilter.ToString("yyyyMMdd") + ".txt";
                var firstLogFile = Directory.GetFiles(logFolderPath, logFirstFileWildcard).FirstOrDefault();
                ParseLogFileToEntries(firstLogFile); //update _logEntries collection

                //all subsequent logs with a time stamp suffix
                var logFileWildcard = request.LogFilePrefix + _fromDateFilter.ToString("yyyyMMdd") + ".*.txt";
                var logFiles = Directory.GetFiles(logFolderPath, logFileWildcard).OrderBy(x => x);
                foreach (var f in logFiles)
                {
                    ParseLogFileToEntries(f); //update _logEntries collection
                }

                result.Logs =_logEntries;

                if (_errMsgList.Any())
                {
                    result.ResponseErrorMsgs = _errMsgList;
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _errMsgList.Add(string.Format("Err Msg: {0} ", ex.Message));
                _errMsgList.Add(string.Format("Stack Trace: {0} ", ex.StackTrace));                
                return Ok(new LogViewerPlusResponse { HasResponseErrors = true, ResponseErrorMsgs = _errMsgList });
            }
        }
        #endregion

        #region Parse Methods
        private void ParseLogFileToEntries(string filename)
        {
            if (!File.Exists(filename))
            {
                return;                
            }
            
            //read text file to string; allow other processes to read and write as Sitecore may be writing to the log file.
            Stream stream = File.Open(filename, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            var streamReader = new StreamReader(stream);
            var file = streamReader.ReadToEnd();
            streamReader.Close();
            stream.Close();
            
            var logFileLines = file.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            
            foreach (var entry in logFileLines)
            {
                var cols = LogEntryToArray(entry);
                var newLogEntry = ParseLogEntry(cols);
                if (newLogEntry != null)
                {
                    _logEntries.Add(newLogEntry);
                }
            }
        }

        private LogEntry ParseLogEntry(IReadOnlyList<string> cols)
        {
            try
            {
                var result = new LogEntry();                

                var currentEntryDate = ParseLogEntryDateTime(cols);
                result.E = currentEntryDate;

                //limit to datetime range specified by request
                if (currentEntryDate < _fromDateFilter || currentEntryDate > _toDateFilter)
                {
                    return null;
                }

                var currentEntryStatus = ParseLogEntryStatus(cols);
                result.S = currentEntryStatus;

                //if any filters have been specified, skip this log entry if it's status is not being filtered on
                if (_statusFilters.Any() && !_statusFilters.Contains(currentEntryStatus))
                {
                    return null;
                }
                
                if (currentEntryStatus == LogEntryStatus.Stacktrace)
                {
                    result.C =  _previousEntrysCategory;
                    result.S = LogEntryStatus.Stacktrace;
                    result.T = cols[0] + " " + cols[1] + " " + cols[2] + " " + cols[3] + " " + cols[4];
                }
                else if (cols[3].Trim().StartsWith("Cache"))
                {
                    result.C = LogEntryCategory.Cache;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[4].Trim().StartsWith("Cache"))
                {
                    result.C = LogEntryCategory.Cache;
                    result.T = cols[4];
                }
                else if ((cols[3] + cols[4]).Trim().StartsWith("MediaRequestProtection:"))
                {
                    result.C = LogEntryCategory.MediaRequestProtect;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[3].Trim().ToLower().Contains(@"\bin\") && cols[3].Trim().ToLower().Contains(@".dll") && currentEntryStatus == LogEntryStatus.Info)
                {
                    result.C = LogEntryCategory.Dll;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[4].Trim().StartsWith("Dianoga"))
                {
                    result.C = LogEntryCategory.Dianoga;
                    result.T = cols[4];
                }
                else if (cols[3].ToLower().Trim().Contains("index"))
                {
                    result.C = LogEntryCategory.Indexing;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[4].ToLower().Trim().Contains("index"))
                {
                    result.C = LogEntryCategory.Indexing;
                    result.T = cols[4];
                }
                else if (cols[3].ToLower().Trim().Contains("schedul"))
                {
                    result.C = LogEntryCategory.Scheduler;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[4].ToLower().Trim().Contains("schedul"))
                {
                    result.C = LogEntryCategory.Scheduler;
                    result.T = cols[4];
                }
                else if (cols[4].Trim().Contains("Hhogdev.SitecorePackageDeployer"))
                {
                    result.C = LogEntryCategory.TdsPackageDeployer;
                    result.T = cols[4];
                }
                else if (cols[3].Trim().Contains("Analytics]:") ||
                            cols[3].Trim().Contains("xDB") ||
                            cols[3].Trim().Contains("Sitecore.Analytics."))
                {
                    result.C = LogEntryCategory.Analytics;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[4].Trim().Contains("Analytics]:") ||
                            cols[4].Trim().Contains("xDB") ||
                            cols[4].Trim().Contains("Sitecore.Analytics."))
                {
                    result.C = LogEntryCategory.Analytics;
                    result.T = cols[4];
                }
                else if (cols[3].Trim().Contains("aggregation/"))
                {
                    result.C = LogEntryCategory.Analytics;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[4].Trim().Contains("aggregation/"))
                {
                    result.C = LogEntryCategory.Analytics;
                    result.T = cols[4];
                }
                else if (cols[3].Trim().StartsWith("[Path"))
                {
                    result.C = LogEntryCategory.PathAnalyzer;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[0].Trim() == "Heartbeat" || cols[3].Trim().Contains("Heartbeat"))
                {
                    result.C = LogEntryCategory.Heartbeat;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[3].Trim()=="AUDIT")
                {
                    result.C = LogEntryCategory.Audit;
                    result.T = cols[3] + " " + cols[4];
                }
                else if (cols[0].Trim() == "ManagedPoolThread")
                {
                    result.C = LogEntryCategory.ManagedPoolThread;
                    result.T = cols[4];
                }
                else
                {
                    //handle strange line breaks in log files
                    if (currentEntryStatus == LogEntryStatus.None)
                    {                       
                        result.T = cols[2] + " " + cols[3] + " " + cols[4];
                    }
                    else
                    {
                        result.T = cols[3] + " " + cols[4];
                    }

                    result.C = _instanceInfoStrings.Any(result.T.StartsWith) ? LogEntryCategory.SitecoreInstanceInfo : LogEntryCategory.Miscellaneous;  //todo: check this                                                          
                }

                if (result.S == LogEntryStatus.Error)
                {
                    _previousEntrysCategory = result.C;
                }

                //if any filters have been specified, skip this log entry if it's category is not being filtered on
                if (_categoryFilters.Any() && !_categoryFilters.Contains(result.C))
                {
                    return null;
                }
                
                return result;                
            }
            catch (Exception ex)
            {
                _errMsgList.Add(string.Format("Err Msg: {0} ", ex.Message));
                _errMsgList.Add(string.Format("Stack Trace: {0} ", ex.StackTrace));
                return null;
            }
        }

        private static string[] LogEntryToArray(string entry)
        {
            const int columnCount = 5;
            var cols = new string[columnCount];
            var splitValue = entry.Split(new[] { ' ' }, columnCount, StringSplitOptions.RemoveEmptyEntries);
            for (var i = 0; i < splitValue.Length; i++)
            {
                cols[i] = splitValue[i]; //handle rows with less than 5 columns
            }

            //handle null
            if (cols.Any(x => x == null))
            {
                for (var i = 0; i < columnCount; i++)
                {
                    if (cols[i] == null)
                    {
                        cols[i] = string.Empty;
                    }
                }
            }
            return cols;
        }

        private DateTime ParseLogEntryDateTime(IReadOnlyList<string> cols)
        {
            DateTime entryDate;
            var entryDateOk = DateTime.TryParse(cols[1], out entryDate);
            if (entryDateOk)
            {
                _entryDateTimeCounter = entryDate;
            }
            else
            {
                entryDateOk = DateTime.TryParse(cols[2], out entryDate);
                if (entryDateOk)
                {
                    _entryDateTimeCounter = entryDate;
                }
            }

            var result = entryDateOk ? entryDate : _entryDateTimeCounter;
            return result;
        }

        private static LogEntryStatus ParseLogEntryStatus(IReadOnlyList<string> cols)
        {
            var textInfo = new CultureInfo("en-US", false).TextInfo;
            LogEntryStatus currentEntryStatus;
            var hasLogEntryStatus = Enum.TryParse(textInfo.ToTitleCase(cols[2].ToLower()), out currentEntryStatus);
            if (!hasLogEntryStatus)
            {
                hasLogEntryStatus = Enum.TryParse(textInfo.ToTitleCase(cols[3].ToLower()), out currentEntryStatus);
                if (!hasLogEntryStatus && (_stackTraceStrings.Contains(cols[0].Trim()) || _stackTraceStrings.Contains(cols[1].Trim())))
                {
                    //stack trace
                    return LogEntryStatus.Stacktrace;                    
                }
            }
            return !hasLogEntryStatus ? LogEntryStatus.None : currentEntryStatus;
        }

        private static IEnumerable<LogEntryStatus> ParseLogEntryFiltersToStatus(IEnumerable<string> statusFilters)
        {
            var result = new List<LogEntryStatus>();
            if (statusFilters == null)
            {
                return result;
            }

            foreach (var status in statusFilters)
            {
                LogEntryStatus filterEntryStatus;
                var hasLogEntryStatus = Enum.TryParse(status, out filterEntryStatus);
                result.Add(!hasLogEntryStatus ? LogEntryStatus.None : filterEntryStatus);
            }

            if (result.Contains(LogEntryStatus.Error))
            {
                result.Add(LogEntryStatus.Stacktrace);
            }

            return result;
        }

        private static IEnumerable<LogEntryCategory> ParseLogEntryFiltersToCategory(IEnumerable<string> categoryFilters)
        {
            var result = new List<LogEntryCategory>();
            if (categoryFilters == null)
            {
                return result;
            }

            foreach (var cat in categoryFilters)
            {
                LogEntryCategory filterEntryCat;
                var hasLogEntryCat = Enum.TryParse(cat, out filterEntryCat);
                result.Add(!hasLogEntryCat ? LogEntryCategory.Miscellaneous : filterEntryCat);
            }

            return result;
        }
        #endregion
    }
}
