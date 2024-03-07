import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  title!: string;
  author!: string;
  subject!: string;
  publishDate!: string;
  books!: any[];

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

  addBook() {
    const currentDate = new Date();
    const enteredDate = new Date(this.publishDate);

    if (enteredDate > currentDate) {
      alert('Publish date cannot be in the future.');
      return; // Stop further execution
    }

    if (!/^[a-zA-Z ]+$/.test(this.author)) {
      alert('Author name must contain only letters.');
      return; // Stop further execution
    }

    if (!/^[a-zA-Z ]+$/.test(this.subject)) {
      alert('Subject name must contain only letters.');
      return; // Stop further execution
    }

    const newBook = {
      title: this.title,
      author: this.author,
      subject: this.subject,
      publish_date: this.publishDate
    };

    this.http.post<any>('http://localhost:3000/api/books', newBook)
      .subscribe(response => {
        console.log(response.message);
        this.fetchBooks(); // Fetch updated list of books after adding a new one
        this.clearForm(); // Optionally, you can reset the form here
      });
  }

  clearForm() {
    this.title = '';
    this.author = '';
    this.subject = '';
    this.publishDate = '';
  }

  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
  }
  
}