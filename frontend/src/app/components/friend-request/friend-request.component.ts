import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrl: './friend-request.component.css'
})
export class FriendRequestComponent {

  @Input() requesterId: string = '';
  @Input() requesterName: string = '';
  @Input() requesterProfilePic: string = '';
  @Input() requesterRank: string = '';
  constructor(
    private api: ApiService, 
    private router: Router,
    private socket: Socket,
  ) { }

  acceptRequest() {
    console.log('accept friend request');
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    } else {
      this.api.acceptFriendRequest(accessToken, this.requesterId).subscribe({
        next: (data) => {
          const { friend, reverseFriend } = data;
          if (friend) {
            // Send online notification to friend
            console.log('friend', friend);
            this.api.getUserById(friend.user1).subscribe({
              next: (data) => {
                const friendSocketId = data.socketId;
                if (friendSocketId !== null) {
                  console.log('friendSocketId', friendSocketId);
                  console.log('friend.friendID', friend.user1);
                  this.socket.emit('new friend', {friendId: friend.user1, friendSocketId: friendSocketId});
                }
              }
            });
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    // Call the API to accept the friend request
    // You can use fetch or any other HTTP library to make the API call
  }
}
