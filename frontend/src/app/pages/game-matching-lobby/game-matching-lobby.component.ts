import { Component } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-game-matching-lobby',
  templateUrl: './game-matching-lobby.component.html',
  styleUrl: './game-matching-lobby.component.css'
})
export class GameMatchingLobbyComponent {
  loadingText: string = "Matching A Game...";
  foundText: string = "Found A Match!";
  loadingInnerHTML: string = '';
  found = false;
  pair: any;
  userId: any;
  
  constructor(
    private api: ApiService,
    private router: Router,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.loading();

    this.socket.emit('matching', localStorage.getItem('userId'));
    this.socket.on('matched', (matchedPair: any, userId: any) => {
      console.log('matched')
      this.foundMatch();
      this.pair = matchedPair;
      this.userId = userId;
    })
  }

  foundMatch() {
    this.found = true;
  }

  loading() {
    const lim = this.loadingText.length;
    const interval = setInterval(() => {
      if (this.found) {
        this.loadingInnerHTML = this.foundText;
        clearInterval(interval);
      } else if (this.loadingInnerHTML.length < lim) {
          this.loadingInnerHTML += this.loadingText[this.loadingInnerHTML.length];
      } else {
        this.loadingInnerHTML = '';
      }
    }, 200);
  }

  waitForAccept() {
    this.socket.emit('accepted', this.pair, this.userId);
    this.socket.on('start', (roomId:number, userId:number) => {
      this.router.navigate(['/game-room'], { queryParams: { roomId: roomId, userId: userId } });
    });
    
  }
}
