using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookDatabaseAPI.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new BookDatabaseAPIContext(
                serviceProvider.GetRequiredService<DbContextOptions<BookDatabaseAPIContext>>()))
            {
                // Look for any books
                if (context.BookItem.Count() > 0)
                {
                    return;   // DB has been seeded
                }

                context.BookItem.AddRange(
                    new BookItem
                    {
                        Title = "The Lightning Thief",
                        Author = "Rick Riordan",
                        Synopsis = "Percy Jackson is a good kid, but he can't seem to focus on his schoolwork " +
                        "or control his temper. And lately, being away at boarding school is only getting worse - " +
                        "Percy could have sworn his pre-algebra teacher turned into a monster and tried to kill him. " +
                        "When Percy's mom finds out, she knows it's time that he knew the truth about where he came " +
                        "from, and that he go to the one place he'll be safe. She sends Percy to Camp Half Blood, a " +
                        "summer camp for demigods (on Long Island), where he learns that the father he never knew is " +
                        "Poseidon, God of the Sea. Soon a mystery unfolds and together with his friends—one a satyr " +
                        "and the other the demigod daughter of Athena - Percy sets out on a quest across the United " +
                        "States to reach the gates of the Underworld (located in a recording studio in Hollywood) and " +
                        "prevent a catastrophic war between the gods.",
                        Url = "https://i.kym-cdn.com/photos/images/original/001/371/723/be6.jpg",
                        Tags = "percyjackson",
                        Uploaded = "19-11-18 2:51T18:25:43.511Z",
                        Width = "768",
                        Height = "432"
                    }


                );
                context.SaveChanges();
            }
        }
    }
}
