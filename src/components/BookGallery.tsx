import * as React from 'react';

interface IProps {
    books: any[]
}

interface IState {
    index: number
}

export default class BookGallery extends React.Component<IProps,IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            index: 0
        }
    }

    public render() {
        const bookList = this.props.books
        const { index } = this.state;
        return (
            <div className="container book-gallery-wrapper">
                {/* <div className="row book-gallery-heading">
                    <div className="input-group">
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button">Search</div>
                        </div>
                        <div className="btn"><i className="fa fa-microphone" /></div>
                    </div>  
                </div> */}
                <div className="container book-wrapper">
                    <div className="row book-heading">
                        <b>{bookList[index].title}</b>&nbsp; ({bookList[index].tags})
                    </div>
                    <div className="row book-img">
                        <img id="book-img" src={bookList[index].url}/>
                    </div>
                    <div className="row buttons">
						<div className="btn btn-primary btn-action" onClick={this.changeBook.bind(this, -1)}>Previous</div>&nbsp;
						<div className="btn btn-primary btn-action" onClick={this.changeBook.bind(this, 1)}>Next</div>
                        {/* <button onClick={this.changeBook.bind(this, -1)}>Previous</button>
                        <button onClick={this.changeBook.bind(this, 1)}>Next</button> */}
                    </div>
                </div>
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
    }
}