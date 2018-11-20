import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import BookDetail from './components/BookDetail';
import BookList from './components/BookList';
import PatrickLogo from './patrick-logo.png';


interface IState {
	books: any[],
	currentBook: any,
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			books: [],
			currentBook: {"id":0, "title":"Loading ","url":"", "author":"Unknown", "synopsis":"Unavailable", "tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			open: false,
			uploadFileList: null
		}     
		
		this.fetchBooks("")
		this.selectNewBook = this.selectNewBook.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchBooks = this.fetchBooks.bind(this)
		this.uploadBook = this.uploadBook.bind(this)
		
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={PatrickLogo} height='40'/>&nbsp; My Book Database &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Book</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<BookDetail currentBook={this.state.currentBook} />
					</div>
					<div className="col-5">
						<BookList books={this.state.books} selectNewBook={this.selectNewBook} searchByTag={this.fetchBooks}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Book Title</label>
						<input type="text" className="form-control" id="book-title-input" placeholder="Enter Title" />
						<small className="form-text text-muted">You can edit any book later</small>
					</div>
					<div className="form-group">
						<label>Author</label>
						<input type="text" className="form-control" id="book-author-input" placeholder="Enter Author" />
						{/* <small className="form-text text-muted"></small> */}
					</div>
					<div className="form-group">
						<label>Synopsis</label>
						<input type="text" className="form-control" id="book-synopsis-input" placeholder="Enter Synopsis" />
						{/* <small className="form-text text-muted"></small> */}
					</div>
					<div className="form-group">
						<label>Tag</label>
						<input type="text" className="form-control" id="book-tag-input" placeholder="Enter Tag" />
						<small className="form-text text-muted">Tag is used for search</small>
					</div>
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="book-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadBook}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected book
	private selectNewBook(newBook: any) {
		this.setState({
			currentBook: newBook
		})
	}

	// GET books
	private fetchBooks(tag: any) {
		let url = "https://wybookdatabase.azurewebsites.net/api/Book"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
			let currentBook = json[0]
			if (currentBook === undefined) {
				currentBook = {"id":0, "title":"No books (╯°□°）╯︵ ┻━┻","url":"", "author":"Unknown", "synopsis":"Unavailable", "tags":"try a different tag","uploaded":"","width":"0","height":"0"}
			}
			this.setState({
				books: json,
				currentBook
			})
        });
	}

	// Sets file list
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	// POST book
	private uploadBook() {
		const titleInput = document.getElementById("book-title-input") as HTMLInputElement
		const authorInput = document.getElementById("book-author-input") as HTMLInputElement
		const synopsisInput = document.getElementById("book-synopsis-input") as HTMLInputElement
		const tagInput = document.getElementById("book-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || authorInput === null || synopsisInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const author = authorInput.value
		const synopsis = synopsisInput.value
		const tag = tagInput.value
		const url = "https://cors-anywhere.herokuapp.com/https://wybookdatabase.azurewebsites.net/api/Book/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Author", author)
		formData.append("Synopsis", synopsis)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		  })
	}
}

export default App;
