import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // endpoint = 'http://localhost:3000';
  endpoint = environment.apiEndpoint;
  judege0Token = environment.judge0Token;
  judege0Url = environment.judge0Url;

  leetcodeApiEndpoint = 'http://localhost:3000/api/leetcode';

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
  getRoomSocketIds(roomId: string): Observable<any> {
    return this.http.get(this.endpoint + '/api/rooms/' + roomId + '/sockets');
  }
    
  enterQueue(token: number, socketId: number): Observable<any> {
    return this.http.post(this.endpoint + '/api/queues/enqueue', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      socketId,
    });
  }

  leaveQueue(socketId: number): Observable<any> {
    return this.http.post(this.endpoint + '/api/queues/dequeue', {
      socketId,
    });
  }

  getQueue(): Observable<any> {
    return this.http.get(this.endpoint + '/api/queue');
  }

  pairUser(userId1: number, userId2: number, socketId1: string, socketId2: string): Observable<any> {
    return this.http.post(this.endpoint + '/api/pairs', {
      userId1,
      userId2,
      status: 'paired',
      socketId1,
      socketId2,
    });
  }

  getPairedUser(pairId: number): Observable<any> {
    return this.http.get(this.endpoint + '/api/pairs/' + pairId);
  }

  deletePair(pairId: number): Observable<any> {
    return this.http.delete(this.endpoint + '/api/pairs/' + pairId);
  }

  createRoom(userId1: number, userId2: number): Observable<any> {
    return this.http.post(this.endpoint + '/api/rooms', {
      status: 'live',
      userId1,
      userId2,
    });
  }

  getRoom(roomId: number): Observable<any> {
    return this.http.get(this.endpoint + '/api/rooms/' + roomId);
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(this.endpoint + '/api/rooms/' + roomId);
  }

  getUser(): Observable<any> {
    return this.http.get(this.endpoint + '/api/users/me');
  }

  signUp(username: string, password: string): Observable<any> {
    return this.http.post(this.endpoint + '/api/users/signup', {
      username,
      password,
    });
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http.post(this.endpoint + '/api/users/login', {
      username,
      password,
    });
  }

  /* Leetcode API */
  getLeetcodeProblems(): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + '/problems');
  }

  getLeetcodeOfficialSolution(): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + '/official-solution/two-sum');
  }

  getRandomProblem(): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + '/random-problem');
  }

  getProblemStartCode(): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + '/startcode/two-sum');
  }
}
