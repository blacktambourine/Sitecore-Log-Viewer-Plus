using System.Collections.Generic;

namespace BlackTambourine.LogViewerPlus.Models
{ 
    public class LogViewerPlusResponse
    {
        //Log Entries
        public IEnumerable<LogEntry> Logs { get; set; }
        //error handling
        public IEnumerable<string> ResponseErrorMsgs { get; set; }
        public bool HasResponseErrors { get; set; }
    }
}