using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookDatabaseAPI.Models
{
    public class BookImageItem
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string Synopsis { get; set; }
        public string Tags { get; set; }
        public IFormFile Image { get; set; }
    }
}
