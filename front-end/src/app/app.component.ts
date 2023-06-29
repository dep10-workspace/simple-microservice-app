import { Component } from '@angular/core';
import {Book} from './dto/book'
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-end';
  flag: 'Save' | 'Update' = 'Save';
  bookList: Array<Book> = [];

  constructor(private http: HttpClient) {
    http.get<Array<Book>>('http://localhost:8080/api/v1/books')
      .subscribe(bookList => this.bookList = bookList);
  }
  saveBook(txtIsbn: HTMLInputElement, txtTitle: HTMLInputElement) {
    const isbn = txtIsbn.value;
    const title = txtTitle.value;

    if (!isbn.trim()){
      alert("ISBN can't be empty");
      txtIsbn.select();
      return;
    }else if(!title.trim()){
      alert("Title can't be empty");
      txtTitle.select();
      return;
    }

    const newBook = new Book(isbn, title);

    if (this.flag === 'Save'){
      this.http.post('http://localhost:8080/api/v1/books', newBook)
        .subscribe(result => {
          this.bookList.push(newBook);
          txtIsbn.value = '';
          txtTitle.value = '';
          txtIsbn.focus();
        });
    }else{
      this.http.patch(`http://localhost:8081/api/v1/books/${newBook.isbn}`, newBook)
        .subscribe(result => {
          const index = this.bookList.findIndex(book => book.isbn === isbn);
          this.bookList[index].title = newBook.title;
          txtIsbn.value = '';
          txtTitle.value = '';
          txtIsbn.focus();
        });
    }

  }

  deleteBook(isbn: string) {
    this.http.delete(`http://localhost:8081/api/v1/books/${isbn}`)
      .subscribe(result => {
        const index = this.bookList.findIndex(book => book.isbn === isbn);
        this.bookList.splice(index, 1);
      });
  }
}
