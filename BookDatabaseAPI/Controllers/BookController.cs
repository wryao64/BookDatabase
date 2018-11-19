using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookDatabaseAPI.Models;

namespace BookDatabaseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDatabaseAPIContext _context;

        public BookController(BookDatabaseAPIContext context)
        {
            _context = context;
        }

        // GET: api/Book
        [HttpGet]
        public IEnumerable<BookItem> GetBookItem()
        {
            return _context.BookItem;
        }

        // GET: api/Book/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bookItem = await _context.BookItem.FindAsync(id);

            if (bookItem == null)
            {
                return NotFound();
            }

            return Ok(bookItem);
        }

        // PUT: api/Book/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookItem([FromRoute] int id, [FromBody] BookItem bookItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != bookItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(bookItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Book
        [HttpPost]
        public async Task<IActionResult> PostBookItem([FromBody] BookItem bookItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.BookItem.Add(bookItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBookItem", new { id = bookItem.Id }, bookItem);
        }

        // DELETE: api/Book/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookItem([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bookItem = await _context.BookItem.FindAsync(id);
            if (bookItem == null)
            {
                return NotFound();
            }

            _context.BookItem.Remove(bookItem);
            await _context.SaveChangesAsync();

            return Ok(bookItem);
        }

        private bool BookItemExists(int id)
        {
            return _context.BookItem.Any(e => e.Id == id);
        }

        // GET: api/Book/Tags
        [Route("tags")]
        [HttpGet]
        public async Task<List<string>> GetTags()
        {
            var memes = (from m in _context.BookItem
                         select m.Tags).Distinct();

            var returned = await memes.ToListAsync();

            return returned;
        }
    }
}