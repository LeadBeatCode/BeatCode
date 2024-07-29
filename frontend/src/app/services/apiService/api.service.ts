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

  leetcodeApiEndpoint = environment.leetcodeApiEndpoint;

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
    return this.http.post(
      `${this.judege0Url}/submissions/?base64_encoded=true&wait=false`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key': this.judege0Token,
        },
      },
    );
  }

  getSubmission(submissionId: string): Observable<any> {
    return this.http.get(
      `${this.judege0Url}/submissions/${submissionId}?base64_encoded=true`,
      {
        headers: {
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key': this.judege0Token,
        },
      },
    );
  }
  getRoomSocketIds(roomId: string): Observable<any> {
    return this.http.get(this.endpoint + '/api/rooms/' + roomId + '/sockets');
  }

  createRoom(
    status: string,
    userId1: string,
    userId2: string,
    token: string,
    isPve: boolean,
    // questionTitleSlug: string,
    gameType: string,
  ): Observable<any> {
    return this.http.post(
      this.endpoint + '/api/rooms',
      {
        status,
        isPve,
        userId1,
        userId2,
        // questionTitleSlug,
        gameType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  runCode(gameType: string, id: string, titleSlug: any, questionId: string, language: string, code: string): Observable<any> {
    if (gameType === 'leetcode') {
      console.log("running leetcode test");
      return this.http.post(this.leetcodeApiEndpoint + `/problems/submit`, {
        id,
        titleSlug,
        questionId,
        language,
        code
      });
    } else {
      console.log(titleSlug);
      
      return this.http.post(this.endpoint + '/api/problems/test', {
        titleSlug,
        language,
        code,
      });
    }
  }

  checkSubmission(gameType: string, id: string, submissionId: string): Observable<any> {
    if (gameType === 'leetcode') {
      return this.http.post(this.leetcodeApiEndpoint + '/submission/check/', {
        submissionId,
        id
      });
    }
    return this.http.get(this.endpoint + '/api/problems/check/' + submissionId);
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

  connect(
    userData: JSON,
    socketId: string,
    accessToken: string,
  ): Observable<any> {
    return this.http.post(this.endpoint + '/api/users/connect', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      userData,
      socketId,
    });
  }

  logOut(accessToken: string, userId: string): Observable<any> {
    return this.http.post(this.endpoint + '/api/users/logout/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      userId,
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

  roomGameOver(roomId: number, accessToken: string, winner: string): Observable<any> {
    return this.http.put(this.endpoint + '/api/rooms/gameover', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      roomId,
      winner,
    });
  }

  getPerformance(userId: string): Observable<any> {
    return this.http.get(this.endpoint + '/api/users/performance/' + userId);
  }

  setUserSocketId(
    accessToken: string,
    socketId: string,
    userId: string,
  ): Observable<any> {
    console.log( socketId, userId)
    return this.http.put(this.endpoint + '/api/users/socket/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      socketId,
      userId,
    });
  }

  getRandomPveProblem(): Observable<any> {
    return this.http.get(this.endpoint + '/api/problems/random');
  }

  getPveProblem(problemId: number): Observable<any> {
    return this.http.get(this.endpoint + '/api/problems/' + problemId);
  }

  getLeetcodeProblem(problemId: number): Observable<any> {
    return this.http.get(this.endpoint + '/api/problems/' + problemId);
  }

  updateRoomAttempt(roomId: number, accessToken: string, attempt: number): Observable<any> {
    return this.http.put(this.endpoint + `/api/rooms/${roomId}/attempt`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      attempt,
    });
  }

  updateRoomResult(roomId: number, accessToken: string, result: number): Observable<any> {
    return this.http.put(this.endpoint + `/api/rooms/${roomId}/result`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      result,
    });
  }

  updateRoomTimeElapsed(roomId: number, accessToken: string, time: string): Observable<any> {
    return this.http.put(this.endpoint + `/api/rooms/${roomId}/time`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      time,
    });
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

  getProblem(titleSlug: string): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + `/problems/${titleSlug}`);
  }

  getProblemStartCode(titleSlug: string): Observable<any> {
    return this.http.get(this.leetcodeApiEndpoint + `/startcode/${titleSlug}`);
  }

  checkUserLeetcodeCookie(cookie: string): Observable<any> {
    return this.http.post(this.leetcodeApiEndpoint + '/checkCookie', {
      cookie
    });
  }

  updateUserLeetcodeCookie(accessToken: string, cookie: string): Observable<any> {
    return this.http.put(this.endpoint + '/api/users/leetcodecookie', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cookie
    });
  }
}
