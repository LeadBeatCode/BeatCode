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
  showCredits: boolean = false;

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
    this.socketId = this.socket.ioSocket.id;
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData, accessToken }) => {
        this.isAuthenticated = isAuthenticated;
        this.userData = userData;
        if (isAuthenticated) {
          this.api.connect(userData, this.socketId, accessToken).subscribe({
            next: () => {
              localStorage.setItem('accessToken', accessToken);
              this.router.navigate(['/dashboard'], {
                state: { userData: userData, socketId: this.socketId },
              });
            },
            error: (err) => {
              if (err.status === 404) {
                this.api
                  .signUp(userData, this.socketId, accessToken)
                  .subscribe({
                    next: (data) => {
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
      });
  }

  loginUser() {
    this.oidcSecurityService.checkAuth().subscribe((auth) => {
    });

    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }

  toggleCredits() {
    this.showCredits = !this.showCredits;
  }
}
