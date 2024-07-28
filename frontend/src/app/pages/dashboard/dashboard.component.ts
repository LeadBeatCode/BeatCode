import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  userData: any;
  loadFriendList: boolean = true;
  loadMenu: string = 'performance'; //performance, history, rankers
  onlineFriends: any[] = [];
  socketId: string = '';
  showLobbyValue: boolean = false;
  showLeetcodeSessionValue: boolean = false;
  leetcodeCookieForm: any = '';
  showLeetcodeSessionFormError: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private socket: Socket,
    private oidcSecurityService: OidcSecurityService,
    private fb: FormBuilder
  ) {
    const navigation = this.router.getCurrentNavigation();
    console.log('navigation', navigation);
    if (navigation && navigation.extras.state) {
      this.userData = navigation.extras.state['userData'];
      console.log('userData in dashboard', this.userData);
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    } else {
      this.socket.on('connect', () => {
        this.socketId = this.socket.ioSocket.id;
        console.log('socket id', this.socketId);
        this.api
          .setUserSocketId(token, this.socketId, this.userData.sub)
          .subscribe({
            next: (data) => {
              console.log('socket id set');
            },
            error: (err) => {
              console.log(err);
            },
          });
      });
    }

    this.leetcodeCookieForm = this.fb.group({
      /**
       * In Angular we can easily define a form field with validators, without installing 9 billion more
       * packages.
       */
      cookie: ['', Validators.required],
    });
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
    }
    console.log('userData', this.userData.sub);
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

  get changeLoadMenuFunc() {
      return this.changeLoadMenu.bind(this);
  }

  changeLoadMenu(value: string) {
    this.loadMenu = value;
  }

  enterLobby() {
    console.log('enterLobby');
    console.log('userData', this.userData);
    this.router.navigate(['/matching-lobby'], {
      state: { userId: this.userData.sub },
    });
  }

  enterLeetcodeLobby() {
    console.log('enterLobby');
    this.router.navigate(['/leetcode-matching-lobby'], 
      {
        state: { userId: this.userData.sub },
      }
    );
  }

  checkLeetcodeSession() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    }
    this.api.checkUserLeetcodeCookie(this.leetcodeCookieForm.value.cookie).subscribe({
      next: (res) => {
        this.api.updateUserLeetcodeCookie(token, this.leetcodeCookieForm.value.cookie).subscribe({
          next: (data) => {
            console.log('checkLeetcodeSession', data);
            if (data) {
              this.enterLeetcodeLobby();
            }
          },
          error: (err) => {
            this.showLeetcodeSessionFormError = 'You have a valid cookie but we could not update it';
          },
        });
      },
      error: (err) => {
            this.showLeetcodeSessionFormError = 'Invalid cookie';
      },
    });
    console.log('checkLeetcodeSession');
  }

  closeLeetcodeSession() {
    this.showLeetcodeSessionValue = false;
    this.showLeetcodeSessionFormError = '';
  }

  showLeetcodeSession() {
    this.showLobbyValue = false;
    this.showLeetcodeSessionValue = !this.showLeetcodeSessionValue;
  }

  showLobby() {
    this.showLobbyValue = !this.showLobbyValue;
  }

  logOut() {
    console.log('log out', this.userData.sub);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    }

    this.api.logOut(token, this.userData.sub).subscribe({
      next: (data) => {
        console.log('log out', data);
        localStorage.removeItem('accessToken');
        this.oidcSecurityService.logoff().subscribe((result) => {
          console.log(result);
          this.router.navigate(['/']);
        });
        this.socket.emit('logout', this.userData.sub);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  startPveGame() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    }
    this.api.getUserById(this.userData.sub).subscribe({
      next: (data) => {
        console.log('user data', data);
        this.api
          .createRoom('live', this.userData.sub, 'Gpt', token, true, 'pve')
          .subscribe({
            next: (data) => {
              console.log('room created', data);
              this.router.navigate(['/game-room'], {
                queryParams: { roomId: data.id },
              });
            },
            error: (err) => {
              console.log(err);
            },
          });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
