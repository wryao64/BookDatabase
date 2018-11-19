using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BookDatabaseAPI.Models
{
    public class BookDatabaseAPIContext : DbContext
    {
        public BookDatabaseAPIContext (DbContextOptions<BookDatabaseAPIContext> options)
            : base(options)
        {
        }

        public DbSet<BookDatabaseAPI.Models.BookItem> BookItem { get; set; }
    }
}
