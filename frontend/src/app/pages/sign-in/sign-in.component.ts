import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  isAuthenticated = false;
  userData: any;
  socketId: string = '';
  constructor(
    private api: ApiService,
    private router: Router,
    private socket: Socket,
  ) {
    socket.on('connect', () => {
      this.socketId = socket.ioSocket.id;
    });
  }
  private readonly oidcSecurityService = inject(OidcSecurityService);

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData, accessToken }) => {
        //console.log('app authenticated', isAuthenticated);
        //console.log(userData.access_token);
        this.isAuthenticated = isAuthenticated;
        this.userData = userData;
        if (isAuthenticated) {
          this.api.signIn(userData, this.socketId, accessToken).subscribe({
            next: () => {
              localStorage.setItem('accessToken', accessToken);
              this.router.navigate(['/dashboard'], {
                state: { userData: userData, socketId: this.socketId },
              });
            },
            error: (err) => {
              if (err.status === 404) {
                console.log('User not found, creating user');
                this.api
                  .signUp(userData, this.socketId, accessToken)
                  .subscribe({
                    next: (data) => {
                      console.log(data);
                      localStorage.setItem('accessToken', accessToken);
                      this.router.navigate(['/dashboard'], {
                        state: { userData: userData, socketId: this.socketId },
                      });
                    },
                    error: (err) => {
                      console.log(err);
                    },
                  });
              }
            },
          });
        }
        console.log(userData);

        this.oidcSecurityService.getAccessToken().subscribe((token) => {
          console.log(token);
        });
      });
  }

  afterSignIn(userId: string, accessToken: string) {
    // Loop through friends list
    this.api.getFriends(this.userData.id).subscribe({
      next: (friends) => {
        for (const friend of friends) {
          // Check if friend's socket is not null
          this.api.getUserById(friend.id).subscribe({
            next: (data) => {
              const friendSocketId = data.socketId;
              if (friend.socketId !== null) {
                // Send online notification to friend
                this.socket.emit('online', userId, friend.socket);
              }
            },
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loginUser() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }

}
