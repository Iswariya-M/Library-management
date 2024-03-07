import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  books: any[] = [];
  searchResults: any[] = [];
  searchPerformed: boolean = false;
  titleSearch: string = '';
  authorSearch: string = '';
  subjectSearch: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.http.get<any[]>('http://localhost:3000/api/books')
      .subscribe(books => {
        this.books = books;
      });
  }

  performSearch() {
    this.searchPerformed = true;
    this.searchResults = this.books.filter(book =>
      book.title.toLowerCase().includes(this.titleSearch.toLowerCase()) &&
      book.author.toLowerCase().includes(this.authorSearch.toLowerCase()) &&
      book.subject.toLowerCase().includes(this.subjectSearch.toLowerCase())
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  }
}
