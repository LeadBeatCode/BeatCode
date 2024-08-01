import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
  userDetails: any = { rank: '', subrank: '', bp: 0 };

  constructor(
    private api: ApiService,
    private router: Router,
    private socket: Socket,
    private oidcSecurityService: OidcSecurityService,
    private fb: FormBuilder,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.userData = navigation.extras.state['userData'];
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/']);
      return;
    } else {
      this.socket.on('connect', () => {
        this.socketId = this.socket.ioSocket.id;
        this.api
          .setUserSocketId(token, this.socketId, this.userData.sub)
          .subscribe({
            next: (data) => {
            },
            error: (err) => {
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
    const token = localStorage.getItem('accessToken');

    this.api.getUserById(this.userData.sub).subscribe({
      next: (data) => {
        this.userDetails.rank = data.rank;
        this.userDetails.subrank = data.subrank;
        this.userDetails.bp = data.bp;
      },
      error: (err) => {
      },
    });
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
    this.api.getFriends(token).subscribe({
      next: (friends) => {
        for (const friend of friends) {
          // Check if friend's socket is not null
          const token = localStorage.getItem('accessToken');
          if (token !== null) {
            this.api.getUserById(friend.id).subscribe({
              next: (data) => {
                const friendSocketId = data.socketId;
                if (friendSocketId) {
                  // Send online notification to friend
                  this.socket.emit('online', {
                    userId: this.userData.sub,
                    friendSocketId: friendSocketId,
                  });
                  this.onlineFriends.push(friend.id);
                }
              },
            });
          }
        }
      },
      error: (err) => {
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
    this.router.navigate(['/matching-lobby'], {
      state: { userId: this.userData.sub },
    });
  }

  enterLeetcodeLobby() {
    this.router.navigate(['/leetcode-matching-lobby'], {
      state: { userId: this.userData.sub },
    });
  }

  checkLeetcodeSession() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
    this.api
      .checkUserLeetcodeCookie(this.leetcodeCookieForm.value.cookie)
      .subscribe({
        next: (res) => {
          this.api
            .updateUserLeetcodeCookie(
              token,
              this.leetcodeCookieForm.value.cookie,
            )
            .subscribe({
              next: (data) => {
                if (data) {
                  this.enterLeetcodeLobby();
                }
              },
              error: (err) => {
                this.showLeetcodeSessionFormError =
                  'You have a valid cookie but we could not update it';
              },
            });
        },
        error: (err) => {
          this.showLeetcodeSessionFormError = 'Invalid cookie';
        },
      });
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
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }

    this.api.logOut(token, this.userData.sub).subscribe({
      next: (data) => {
        localStorage.removeItem('accessToken');
        this.oidcSecurityService.logoff().subscribe((result) => {
          this.router.navigate(['/']);
        });
        this.socket.emit('logout', this.userData.sub);
      },
      error: (err) => {
      },
    });
  }
  startPveGame() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
    this.api.getUserById(this.userData.sub).subscribe({
      next: (data) => {
        this.api
          .createRoom('live', this.userData.sub, 'Gpt', token, true, 'pve')
          .subscribe({
            next: (data) => {
              this.router.navigate(['/game-room'], {
                queryParams: { roomId: data.id },
              });
            },
            error: (err) => {
            },
          });
      },
      error: (err) => {
      },
    });
  }
}
