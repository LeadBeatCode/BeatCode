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

  enterLobby() {
    console.log('enterLobby');
    this.router.navigate(['/matching-lobby']);
  }
}
