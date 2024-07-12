import { Component } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

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
