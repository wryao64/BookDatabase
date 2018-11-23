import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import BookList from './components/BookList';
import BookLogo from './bookIcon.png';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import BookGallery from './components/BookGallery';
import ChatBot from 'react-simple-chatbot';
import Button from '@material-ui/core/Button';
import ChatBubbleOutline from '@material-ui/icons/ChatBubbleOutline';

interface IState {
	authenticated: boolean,
	books: any[],
	currentBook: any,
	currentBookIndex: any,
	open: boolean,
	uploadFileList: any,
	chatbotOpen: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			authenticated: false,
			books: [],
			currentBook: {"id":0, "title":"Loading ","url":"", "author":"Unknown", "synopsis":"Unavailable", "tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			currentBookIndex: 0,
			open: false,
			uploadFileList: null,
			chatbotOpen: false,
		}     
		
		this.fetchBooks("")
		this.selectNewBook = this.selectNewBook.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchBooks = this.fetchBooks.bind(this)
		this.uploadBook = this.uploadBook.bind(this)
		this.responseFacebook = this.responseFacebook.bind(this)
		this.facebookLoginClicked = this.facebookLoginClicked.bind(this)
		this.responseGoogle = this.responseGoogle.bind(this)
		this.toggleChatbot = this.toggleChatbot.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			{/* If the user has not been authenticated */}
			{(!this.state.authenticated) ?
				<div>
					<div className="header-wrapper">
						<div className="container header">
							<img src={BookLogo} height='40'/>&nbsp; My Book Database &nbsp;
						</div>
					</div>
					<div>
						<Card className="card">
							<CardContent>
								<h3>Login with one of the following:</h3>
							</CardContent>
							<FacebookLogin 
								className="fb-login"
								id="facebook-login"
								appId="2196561480662008"
								autoLoad={true}
								fields="name,email,picture"
								onClick={this.facebookLoginClicked}
								// callback={this.responseFacebook}
								/>
							<GoogleLogin
								className="google-login"
								clientId="134185819144-0pg827n4l0hdi9vmj70roacbiik8hf0o.apps.googleusercontent.com"
								buttonText="Login"
								onSuccess={this.responseGoogle}
								onFailure={this.responseGoogle}
								/>
						</Card>
					</div>
				</div>
				: ""}

			{/* If the user has been authenticated */}
			{(this.state.authenticated) ?
			<div>
				<div className="header-wrapper">
					<div className="container header">
						<img src={BookLogo} height='40'/>&nbsp; My Book Database &nbsp;
						<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Book</div>
					</div>
				</div>

				<div className="container">
					<div className="row">
						<div className="col-12">
							<BookList books={this.state.books} selectNewBook={this.selectNewBook} searchByTag={this.fetchBooks}/>
						</div>
						<div className="col-12">
							<BookGallery books={this.state.books} currentBookIndex={this.state.currentBookIndex} />
						</div>
					</div>
					<div className="row chatbot-btn-container">
						<Button className="btn-chatbot" variant="fab" onClick={this.toggleChatbot} color="primary"><ChatBubbleOutline /></Button>
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
						</div>
						<div className="form-group">
							<label>Synopsis</label>
							<input type="text" className="form-control" id="book-synopsis-input" placeholder="Enter Synopsis" />
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

				{(this.state.chatbotOpen) &&
					<div className="chatbot-container">
						<ChatBot
							steps={[
								{
									id: 'help',
									message: 'What would like help with?',
									trigger: 'help-options',
								},
								{
									id: 'help-options',
									options: [
										{ value: 1, label: '#1', trigger: 'help-options' },
										{ value: 2, label: '#2', trigger: 'help-options' },
										{ value: 3, label: 'That\'s all', trigger: 'end' },
									],
								},
								{
									id: 'end',
									message: 'Good bye!',
									end: true,
								},
							]}
						/>
					</div>
				}
			</div>
			: ""}
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
	private selectNewBook(newBookIndex: any) {
		this.setState({
			currentBookIndex: newBookIndex,
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

	private responseFacebook = (response: any) => {
		console.log(response);
		if (!(response.name === "")) { // assumes user has logged in if there is a name
			this.setState({authenticated: true})
		}
	}

	private facebookLoginClicked(response: any) {
		this.responseFacebook(response);
	}

	private responseGoogle = (response: any) => {
		console.log(response);
	}

	private toggleChatbot() {
		this.setState({ chatbotOpen: !(this.state.chatbotOpen) })
	}
}

export default App;
