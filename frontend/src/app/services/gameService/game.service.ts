import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  status: boolean = false; 
  constructor() { }

  updateStatus(status: boolean) {
    this.status = status;
  }
}
