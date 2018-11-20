import * as React from "react";

interface IProps {
    books: any[],
    selectNewBook: any,
    searchByTag: any
}

export default class BookList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
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
            this.props.selectNewBook(selectedBook)
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

}