import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
// import BookDetail from './components/BookDetail';
import BookList from './components/BookList';
import BookLogo from './bookIcon.png';
// import * as Webcam from 'react-webcam';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import BookGallery from './components/BookGallery';

interface IState {
	authenticated: boolean,
	books: any[],
	currentBook: any,
	open: boolean,
	refCamera: any
	uploadFileList: any,
	predictionResult: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			authenticated: false,
			books: [],
			currentBook: {"id":0, "title":"Loading ","url":"", "author":"Unknown", "synopsis":"Unavailable", "tags":"⚆ _ ⚆","uploaded":"","width":"0","height":"0"},
			open: false,
			refCamera: React.createRef(),
			uploadFileList: null,
			predictionResult: null,
		}     
		
		this.fetchBooks("")
		this.selectNewBook = this.selectNewBook.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchBooks = this.fetchBooks.bind(this)
		this.uploadBook = this.uploadBook.bind(this)
		this.authenticate = this.authenticate.bind(this)	
		this.responseFacebook = this.responseFacebook.bind(this)
		this.facebookLoginClicked = this.facebookLoginClicked.bind(this)
		this.responseGoogle = this.responseGoogle.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			{/* {(!this.state.authenticated) ?
				<Modal open={!this.state.authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
					<Webcam
						audio={false}
						screenshotFormat="image/jpeg"
						ref={this.state.refCamera}
					/>
					<div className="row nav-row">
						<div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
					</div>
				</Modal> : ""} */}

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
						{/* <div className="col-7">
							<BookDetail currentBook={this.state.currentBook} />
						</div> */}
						<div className="col-12">
							<BookList books={this.state.books} selectNewBook={this.selectNewBook} searchByTag={this.fetchBooks}/>
						</div>
						<div className="col-12">
							<BookGallery books={this.state.books}/>
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

	// Authenticate
	private authenticate() { 
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
	}

	// Call custom vision model
	private getFaceRecognitionResult(image: string) {
		const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/fd849982-e2f2-4fe7-a8d9-94c0d78fed33/image?iterationId=e6b960fa-4ea5-42dc-9f7d-df3b64bb8c2e"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				'cache-control': 'no-cache', 'Prediction-Key': '238994037e3e4ebabe32c0093e59d168', 'Content-Type': 'application/octet-stream'
			},
			method: 'POST'
		})
		.then((response: any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				response.json().then((json: any) => {
					console.log(json.predictions[0])
					this.setState({predictionResult: json.predictions[0] })
					if (this.state.predictionResult.probability > 0.7) {
						this.setState({authenticated: true})
					} else {
						this.setState({authenticated: false})
					}
				})
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
}

export default App;
