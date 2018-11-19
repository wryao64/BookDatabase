using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookDatabaseAPI.Models
{
    public class BookItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Synopsis { get; set; }
        public string Url { get; set; }
        public string Tags { get; set; }
        public string Uploaded { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }
    }
}
