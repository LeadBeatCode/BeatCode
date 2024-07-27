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

  submitCode(content: string, language: string): Observable<any> {
    let languageId = 71;
    if (language === 'python3') {
      languageId = 71;
    } else if (language === 'C') {
      languageId = 50;
    } else if (language === 'C++') {
      languageId = 54;
    } else if (language === 'Java') {
      languageId = 62;
    } else if (language === 'python') {
      languageId = 70;
    }
    const base64Content = btoa(content);
    console.log('languageId', languageId);
    console.log('content', content);
    console.log('base64Content', base64Content);
    const data = {
      source_code: base64Content,
      language_id: languageId,
    };
    return this.http.post(`${this.judege0Url}/submissions/?base64_encoded=true&wait=false`, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'x-rapidapi-key': this.judege0Token,
      },
    });
  }

  getSubmission(submissionId: string): Observable<any> {
    return this.http.get(`${this.judege0Url}/submissions/${submissionId}?base64_encoded=true`, {
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
        Authorization: `Bearer ${token}`,
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

  pairUser(
    userId1: number,
    userId2: number,
    socketId1: string,
    socketId2: string,
  ): Observable<any> {
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

  // createRoom(userId1: number, userId2: number): Observable<any> {
  //   return this.http.post(this.endpoint + '/api/rooms', {
  //     status: 'live',
  //     userId1,
  //     userId2,
  //   });
  // }

  createRoom(
    status: string,
    token1: string,
    token2: string,
    socketId1: string,
    socketId2: string,
    isPve: boolean,
  ): Observable<any> {
    return this.http.post(this.endpoint + '/api/rooms', {
      status,
      socketId1,
      socketId2,
      isPve,
    },
    {
      headers: {
        Authorization1: `Bearer ${token1}`,
        Authorization2: `Bearer ${token2}`,
      },
    }
  );
  }


  getRoom(roomId: number, accessToken: string): Observable<any> {
    return this.http.get(this.endpoint + '/api/rooms/' + roomId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(this.endpoint + '/api/rooms/' + roomId);
  }

  getUser(): Observable<any> {
    return this.http.get(this.endpoint + '/api/users/me');
  }

  signUp(
    userData: JSON,
    socketId: string,
    accessToken: string,
  ): Observable<any> {
    return this.http.post(this.endpoint + '/api/users/signup', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      userData,
      socketId,
    });
  }

  signIn(
    userData: JSON,
    socketId: string,
    accessToken: string,
  ): Observable<any> {
    return this.http.post(this.endpoint + '/api/users/login', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      userData,
      socketId,
    });
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(this.endpoint + '/api/users/' + userId);
  }

  sendFriendRequest(accessToken: string, receiverId: string): Observable<any> {
    return this.http.post(this.endpoint + '/api/friends/request', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      receiverId,
    });
  }

  acceptFriendRequest(accessToken: string, senderId: string): Observable<any> {
    return this.http.post(this.endpoint + '/api/friends/accept', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      senderId,
    });
  }

  getFriends(accessToken: string): Observable<any> {
    return this.http.get(this.endpoint + '/api/friends/list', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  getPendingFriendRequests(accessToken: string): Observable<any> {
    return this.http.get(this.endpoint + '/api/friends/pending', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  setUserSocketId(accessToken: string, socketId: string): Observable<any> {
    return this.http.put(this.endpoint + '/api/users/socket/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      socketId,
    });
  }

  getRandomPveProblem(): Observable<any> {
    return this.http.get(this.endpoint + '/api/problems/random');
  }

  getPveProblem(problemId: number): Observable<any> {
    return this.http.get(this.endpoint + '/api/problems/' + problemId);
  }

  /* Leetcode API */
  getLeetcodeProblems(): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + '/problems');
  }

  getLeetcodeOfficialSolution(): Observable<any> {
    return this.http.get(
      this.leetcodeApiEndpoint + '/official-solution/two-sum',
    );
  }

  

  getRandomProblem(): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + '/random-problem');
  }

  getProblemStartCode(): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + '/startcode/two-sum');
  }
}
