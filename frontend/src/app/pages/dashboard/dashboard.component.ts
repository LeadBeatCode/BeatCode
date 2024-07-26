import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GptService } from '../../services/gptService/gpt.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  userData: any;
  loadFriendList: boolean = true;
  loadUserPerformance: boolean = true;
  onlineFriends: any[] = [];
  socketId: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private socket: Socket,
    private gptService: GptService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    console.log('navigation', navigation);
    if (navigation && navigation.extras.state) {
      this.userData = navigation.extras.state['userData'];
      console.log('userData in dashboard', this.userData);
    }
  }

  ngOnInit() {
    // this.gptService.getResponse('hello').then((response) => {
    //   console.log('response', response);
    // });
    //console.log('response', response);
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    } else {
      this.socket.on('connect', () => {
        this.socketId = this.socket.ioSocket.id;
        console.log('socket id', this.socketId);
        this.api.setUserSocketId(token, this.socketId).subscribe({
          next: (data) => {
            console.log('socket id set');
          },
          error: (err) => {
            console.log(err);
          },
        });
      });
    }
    console.log('userData', this.userData.id);
    this.api.getFriends(token).subscribe({
      next: (friends) => {
        for (const friend of friends) {
          console.log('friend', friend);
          // Check if friend's socket is not null
          const token = localStorage.getItem('accessToken');
          if (token !== null) {
            this.api.getUserById(friend.id).subscribe({
              next: (data) => {
                console.log('friend data', data);
                const friendSocketId = data.socketId;
                if (friendSocketId) {
                  // Send online notification to friend
                  console.log('emit online', this.userData.sub, friendSocketId);
                  this.socket.emit('online', {
                    userId: this.userData.sub,
                    friendSocketId: friendSocketId,
                  });
                  this.onlineFriends.push(friend.id);
                  console.log('onlineFriends', this.onlineFriends);
                }
              },
            });
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeLoadFriendList() {
    this.loadFriendList = !this.loadFriendList;
  }

  changeLoadUserPerformance(value: boolean) {
    this.loadUserPerformance = value;
  }

  enterLobby() {
    console.log('enterLobby');
    this.router.navigate(['/matching-lobby']);
  }

  startPveGame() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    }
    this.api
      .createRoom('open', token, 'PveGame', this.socketId, '', true)
      .subscribe({
        next: (data) => {
          console.log('room created', data);
          this.router.navigate(['/game-room'], {
            queryParams: { roomId: data.roomId },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
