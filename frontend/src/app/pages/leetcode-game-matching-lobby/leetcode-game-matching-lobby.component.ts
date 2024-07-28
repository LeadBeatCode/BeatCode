import { Component } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../services/gameService/game.service';

@Component({
  selector: 'app-leetcode-game-matching-lobby',
  templateUrl: './leetcode-game-matching-lobby.component.html',
  styleUrl: './leetcode-game-matching-lobby.component.css'
})
export class LeetcodeGameMatchingLobbyComponent {
  loadingText: string = 'Matching A Game...';
  foundText: string = 'Found A Match!';
  loadingInnerHTML: string = '';
  found = false;
  pair: any;
  accepted = false;
  timer = '';
  lobbyTimer = '';
  errorCode = {
    unaccepted:
      'The player matched left because you did not accept. <br>Returning to lobby...',
    unmatched:
      'The other player did not accept the match. <br>Returning to lobby...',
  };
  error = '';
  timerInterval: number | ReturnType<typeof setTimeout> = 0;
  userId: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private socket: Socket,
    private game: GameService,
  ) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    }
    this.loading();
    const navigation = this.router.getCurrentNavigation();
    console.log('navigation', navigation);
    //console.log('navigation.extras.state', navigation.extras.state);
    if (navigation && navigation.extras.state) {
      this.userId = navigation.extras.state['userId'];
    }
    this.socket.emit(
      'matching',
      this.userId,
      localStorage.getItem('accessToken'),
    );
    this.socket.on('matched', (matchedPair: any, accessToken: any) => {
      this.foundMatch();
      this.pair = matchedPair;
    });
  }

  ngOnInit(): void {}

  foundMatch() {
    this.found = true;
    this.startAcceptTimer();
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

  startAcceptTimer = () => {
    var timeLeft = 10;
    this.timer = '' + timeLeft;
    this.timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        this.timer = '';
        clearInterval(this.timerInterval);
        this.updateOnFailAccept();
        if (!this.game.status || !this.accepted) {
          this.found = false;
          var t = 5;
          this.lobbyTimer = '' + t;
          const lobbyInterval = setInterval(() => {
            if (t <= 0) {
              this.error = '';
              if (!this.game.status) {
                this.router.navigate(['/']);
              }
              clearInterval(lobbyInterval);
            } else {
              this.lobbyTimer = '' + t--;
            }
          }, 1000);
        }
        if (!this.game.status && this.accepted) {
          this.error = this.errorCode.unmatched;
        } else {
          this.error = this.errorCode.unaccepted;
        }
      } else {
        this.timer = '' + timeLeft--;
      }
    }, 1000);
  };

  updateOnFailAccept = () => {
    this.socket.emit('failedAccept', this.pair);
    this.game.updateStatus(false);
  };

  waitForAccept() {
    this.accepted = true;
    this.socket.emit(
      'accepted',
      this.pair,
      this.userId,
      localStorage.getItem('accessToken'),
    );

    this.socket.on('start', (roomId: number, accessToken: string, playerTitle: string) => {
      this.game.updateStatus(true);
      clearInterval(this.timerInterval);
      console.log('start game', playerTitle);
      this.api.getRandomProblem()
      this.router.navigate(['/game-room'], { queryParams: { roomId: roomId } , state: {playerTitle: playerTitle}} );
    });
  }
}
