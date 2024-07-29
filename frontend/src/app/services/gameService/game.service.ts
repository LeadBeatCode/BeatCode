import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  status: boolean = false;
  constructor(private http: HttpClient) {}
  endpoint = environment.apiEndpoint;

  updateStatus(status: boolean) {
    this.status = status;
  }

  getUserSocket(uID: string): Observable<any> {
    return this.http.get(this.endpoint + `/api/users/${uID}/socket`);
  }
}
