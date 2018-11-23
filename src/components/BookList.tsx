import * as React from 'react';
import MediaStreamRecorder from 'msr';

interface IProps {
    books: any[],
    selectNewBook: any,
    searchByTag: any
}

export default class BookList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
        this.postAudio = this.postAudio.bind(this)
        this.searchTagByVoice = this.searchTagByVoice.bind(this)
    }

	public render() {
		return (
			<div className="container book-list-wrapper">
                <div className="row book-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                        </div>
                        <div className="btn" onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></div>
                    </div>  
                </div>
                <div className="row book-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
		);
    }

    // Construct table using book list
	private createTable() {
        const table:any[] = []
        const bookList = this.props.books
        if (bookList == null) {
            return table
        }

        for (let i = 0; i < bookList.length; i++) {
            const children = []
            const book = bookList[i]
            children.push(<td key={"id" + i}>{book.id}</td>)
            children.push(<td key={"name" + i}>{book.title}</td>)
            children.push(<td key={"tags" + i}>{book.tags}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }
    
    // Book selection handler to display selected book in details component
    private selectRow(index: any) {
        const selectedBook = this.props.books[index]
        if (selectedBook != null) {
            this.props.selectNewBook(index)
        }
    }

    // Search book by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

    private searchTagByVoice() {
        const mediaConstraints = {
            audio: true
        }
        const env = this;
        function onMediaSuccess(stream: any) {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob:any) => {
                env.postAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(3000);
        }
 
        function onMediaError(e: any) {
            console.error('media error', e);
        }
 
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
    }

    private postAudio(blob: any) {
        let accessToken: any;
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': 'ac4a5739b2fa4d749b080822e01c167a'
            },
            method: 'POST'
        }).then((response) => {
            console.log(response.text())
            return response
        }).then((response) => {
            console.log(response)
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });

        // posting audio
        fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': 'ac4a5739b2fa4d749b080822e01c167a'
            },    
            method: 'POST'
        }).then((res) => {
            return res.json()
        }).then((res: any) => {
            console.log(res)
            const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
            textBox.value = (res.DisplayText as string).slice(0, -1)
        }).catch((error) => {
            console.log("Error", error)
        });
    }
}