import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentBook: any
}

interface IState {
    open: boolean
}

export default class BookDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }
        this.updateBook = this.updateBook.bind(this)
    }

	public render() {
        const currentBook = this.props.currentBook
        const { open } = this.state;
		return (
			<div className="container book-wrapper">
                <div className="row book-heading">
                    <b>{currentBook.title}</b>&nbsp; ({currentBook.tags})
                </div>
                <div className="row book-author">
                    <b>{currentBook.author}</b>
                </div>
                <div className="row book-synopsis">
                    <b>{currentBook.synopsis}</b>
                </div>
                <div className="row book-date">
                    {currentBook.uploaded}
                </div>
                <div className="row book-img">
                    <img src={currentBook.url}/>
                </div>
                
                <div className="row book-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadBook.bind(this, currentBook.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteBook.bind(this, currentBook.id)}>Delete </div>
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

        console.log(titleInput)
        console.log(authorInput)
        console.log(synopsisInput)
        console.log(tagInput)

        if (titleInput === null || authorInput === null || synopsisInput === null || tagInput === null) {
            console.log("Null")
            return;
		}

        const currentBook = this.props.currentBook
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
            console.log("updateBook response?")
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
				location.reload()
			}
		  })
    }
}