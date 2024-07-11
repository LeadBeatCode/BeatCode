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
  found = true;
  
  constructor(
    private api: ApiService,
    private router: Router,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.loading();
    this.socket.emit('message', "hello");
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

  enterGame() {
    console.log('enterLobby');
    this.router.navigate(['/game-room']);
  }
}
