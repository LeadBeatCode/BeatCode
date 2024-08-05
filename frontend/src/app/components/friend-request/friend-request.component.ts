import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrl: './friend-request.component.css',
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
  ) {}

  acceptRequest() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.router.navigate(['/']);
      return;
    } else {
      this.api.acceptFriendRequest(accessToken, this.requesterId).subscribe({
        next: (data) => {
          const { friend, reverseFriend } = data;
          if (friend) {
            this.api.getUserById(friend.user1).subscribe({
              next: (data) => {
                const friendSocketId = data.socketId;
                if (friendSocketId !== null) {
                  this.socket.emit('new friend', {
                    friendId: friend.user1,
                    friendSocketId: friendSocketId,
                  });
                }
              },
            });
          }
        },
        error: (err) => {},
      });
    }
  }
}
