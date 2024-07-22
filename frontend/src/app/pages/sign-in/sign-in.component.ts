import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent implements OnInit  {

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}
  private readonly oidcSecurityService = inject(OidcSecurityService);

  isAuthenticated = false;
  userData: any;

  ngOnInit(){
    this.oidcSecurityService
    .checkAuth()
    .subscribe(({ isAuthenticated, userData}) => {
      console.log('app authenticated', isAuthenticated);
      this.isAuthenticated = isAuthenticated;
      this.userData = userData;
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

  randomString(length: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  enterLobby() {
    console.log('enterLobby');
    const username = this.randomString(8);
    const password = this.randomString(8);
    this.api.signUp(username, password).subscribe({
      next:(data) => {
        console.log(data);
        const userId = data.id;
        localStorage.setItem('userId', userId);
        this.router.navigate(['/matching-lobby']);
      },
      error: (err) => {
        console.log(err);
      }

    });
  }
}
