import * as React from 'react';
import Modal from 'react-responsive-modal';

interface IProps {
    books: any[]
    currentBookIndex: any
}

interface IState {
    index: number
    open: boolean
}

export default class BookGallery extends React.Component<IProps,IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            index: 0,
            open: false,
        }
        this.updateBook = this.updateBook.bind(this)
    }

    public render() {
		const { open } = this.state
        const bookList = this.props.books
        const { index } = this.state

        return (
            <div className="container book-gallery-wrapper">
                <div className="row buttons">
                    <div className="btn btn-primary btn-action btn-previous" onClick={this.changeBook.bind(this, -1)}>Previous</div>
                    <div className="row book-done-button">
                        <div className="btn btn-primary btn-action" onClick={this.downloadBook.bind(this, bookList[index].url)}>Download </div>
                        <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                        <div className="btn btn-primary btn-action" onClick={this.deleteBook.bind(this, bookList[index].id)}>Delete </div>
                    </div>
                    <div className="btn btn-primary btn-action btn-next" onClick={this.changeBook.bind(this, 1)}>Next</div>
                </div>

                <div className="container book-wrapper">
                    <div className="row book-heading">
                        <b>{bookList[index].title}</b>&nbsp; ({bookList[index].tags})
                    </div>
                    <div className="row book-author">
                        {bookList[index].author}
                    </div>
                    <div className="row book-date">
                        {bookList[index].uploaded}
                    </div>
                    <div className="row book-img">
                        <img id="book-img" src={bookList[index].url}/>
                    </div>
                    <div className="row book-synopsis">
                        {bookList[index].synopsis}
                    </div>
                </div>

                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Book Title</label>
                            <input type="text" className="form-control" id="book-edit-title-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any book later</small>
                        </div>
                        <div className="form-group">
                            <label>Author</label>
                            <input type="text" className="form-control" id="book-edit-author-input" placeholder="Enter Author"/>
                        </div>
                        <div className="form-group">
                            <label>Synopsis</label>
                            <input type="text" className="form-control" id="book-edit-synopsis-input" placeholder="Enter Synopsis"/>
                        </div>
                        <div className="form-group">
                            <label>Tag</label>
                            <input type="text" className="form-control" id="book-edit-tag-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Tag is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateBook}>Save</button>
                    </form>
                </Modal>
            </div>
        );
    }

    private changeBook(inc: any) {
        const bookList = this.props.books
        const { index } = this.state

        if (index > bookList.length - 2 && inc === 1) {
            this.setState({ index: 0 })
        } else if (index < 1 && inc === -1) {
            this.setState({ index: bookList.length - 1 })
        } else {
            this.setState({ index: index + inc })
        }
        // this.setState({ currentBook: bookList[index]})
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
	};

    // Open book image in new tab
    private downloadBook(url: any) {
        window.open(url);
    }

    // DELETE book
    private deleteBook(id: any) {
        const url = "https://cors-anywhere.herokuapp.com/http://wybookdatabase.azurewebsites.net/api/Book/" + id

		fetch(url, {
			method: 'DELETE'
		})
        .then((response : any) => {
			if (!response.ok) {
                // Error Response
				alert(response.statusText)
			}
			else {
              location.reload()
			}
		  })
    }

    // PUT book
    private updateBook(){
        const titleInput = document.getElementById("book-edit-title-input") as HTMLInputElement
        const authorInput = document.getElementById("book-edit-author-input") as HTMLInputElement
		const synopsisInput = document.getElementById("book-edit-synopsis-input") as HTMLInputElement
        const tagInput = document.getElementById("book-edit-tag-input") as HTMLInputElement

        if (titleInput === null || authorInput === null || synopsisInput === null || tagInput === null) {
            return;
		}

        const currentBook = this.props.books[this.state.index]
        const url = "https://cors-anywhere.herokuapp.com/http://wybookdatabase.azurewebsites.net/api/Book/" + currentBook.id
        const updatedTitle = titleInput.value
        const updatedAuthor = authorInput.value
        const updatedSynopsis = synopsisInput.value
        const updatedTag = tagInput.value
		fetch(url, {
			body: JSON.stringify({
                "author": updatedAuthor,
                "height": currentBook.height,
                "id": currentBook.id,
                "synopsis": updatedSynopsis,
                "tags": updatedTag,
                "title": updatedTitle,
                "uploaded": currentBook.uploaded,
                "url": currentBook.url,
                "width": currentBook.width
            }),
			headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
			method: 'PUT'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
				location.reload()
			}
        })
    }
}