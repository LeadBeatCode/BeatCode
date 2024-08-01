import { Component } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friend-action',
  templateUrl: './friend-action.component.html',
  styleUrl: './friend-action.component.css',
})
export class FriendActionComponent {
  friends: any[] = [];
  pendingRequests: any[] = [];
  constructor(
    private api: ApiService,
    private router: Router,
  ) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.router.navigate(['/']);
    } else {
      this.api.getPendingFriendRequests(accessToken).subscribe({
        next: (requests) => {
          this.pendingRequests = requests;
        },
        error: (err) => {
        },
      });
      this.api.getFriends(accessToken).subscribe({
        next: (friends) => {
          this.friends = friends;
        },
        error: (err) => {
        },
      });
    }
  }

  ngOnInit(): void {}

  sendFriendRequest() {
    const friendId = (
      document.querySelector('.friend-search') as HTMLInputElement
    ).value;
    if (friendId) {
      // Call the API to check if the user with the given friendId exists
      // You can use fetch or any other HTTP library to make the API call
      this.api.getUserById(friendId).subscribe({
        next: (data) => {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            this.router.navigate(['/']);
            return;
          }
          this.api.sendFriendRequest(accessToken, friendId).subscribe({
            next: (data) => {
            },
            error: (err) => {
            },
          });
        },
        error: (err) => {
        },
      });
    } else {
    }
  }
}
