using System;

namespace BlackTambourine.LogViewerPlus.Models
{
    //Abbreviated field names as Firefox struggles with long ones
    public class LogEntry
    {
        //Category
        public LogEntryCategory C { get; set; }
        //Entry DateTime
        public DateTime E { get; set; }
        //Status
        public LogEntryStatus S { get; set; }
        //Log Entry Content Text
        public string T { get; set; }
    }

    public enum LogEntryStatus
    {
        Info = 0,
        Warn = 1,
        Error = 2,
        Stacktrace = 3,
        None = 4
    }
    public enum LogEntryCategory
    {
        ErrorOutput = 0,
        Cache = 1,
        MediaRequestProtect = 2,
        Dll = 3,
        Dianoga = 4,
        Scheduler = 5,
        TdsPackageDeployer = 6,
        Analytics = 7,
        PathAnalyzer = 8,
        Indexing = 9,
        Heartbeat = 11,
        Audit = 12,
        ManagedPoolThread = 13,
        SitecoreInstanceInfo = 14,
        Miscellaneous = 15
    }
}