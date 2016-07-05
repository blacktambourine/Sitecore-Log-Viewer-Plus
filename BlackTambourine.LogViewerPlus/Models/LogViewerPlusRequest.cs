using System;
using System.ComponentModel.DataAnnotations;

namespace BlackTambourine.LogViewerPlus.Models
{
    public class LogViewerPlusRequest
    {
        [Required]
        public string LogFilePrefix { get; set; }

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        public string[] StatusFilters { get; set; }
        public string[] CategoryFilters { get; set; }
    }
}