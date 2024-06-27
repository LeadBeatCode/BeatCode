import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // endpoint = 'http://localhost:3000';
  endpoint = environment.apiEndpoint;
  judege0Token = environment.judge0Token;
  judege0Url = environment.judge0Url;

  constructor(private http: HttpClient) {}
  /**
   * HttpClient has methods for all the CRUD actions: get, post, put, patch, delete, and head.
   * First parameter is the URL, and the second parameter is the body.
   * You can use this as a reference for how to use HttpClient.
   * @param content The content of the message
   * @returns
   */

  submitCode(content: string): Observable<any> {
    const languageId = 71;
    const data = {
      source_code: content,
      language_id: languageId,
    };
    return this.http.post(`${this.judege0Url}/submissions`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'x-rapidapi-key': this.judege0Token,
      },
    });
  }

  getSubmission(submissionId: string): Observable<any> {
    return this.http.get(`${this.judege0Url}/submissions/${submissionId}`, {
      headers: {
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'x-rapidapi-key': this.judege0Token,
      },
    });
  }
}
