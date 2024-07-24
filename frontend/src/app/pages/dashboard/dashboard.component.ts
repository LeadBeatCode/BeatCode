import { Component } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  loadFriendList: boolean = true;
  loadUserPerformance: boolean = true;

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
}
