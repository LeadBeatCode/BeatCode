import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.css'
})
export class FriendListComponent implements OnInit {
    @Input() onlineFriends: any[] = [];

    friends: any[] = [];
    
    constructor(private router: Router, private api: ApiService, private socket: Socket) { }
  
    ngOnInit(): void {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('Please sign in');
        this.router.navigate(['/']);
      } else {
        this.api.getFriends(accessToken).subscribe({
          next: (friends) => {
            console.log(friends);
            this.friends = friends;
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
      this.socket.on('friend online', (friendId: any) => {
        console.log('friend online', friendId);
        this.onlineFriends.push(friendId.id);
      });
      this.socket.on('new friend added', (friendId: any) => {
        console.log('new friend added', friendId);
        this.friends.push(friendId.id);
        this.onlineFriends.push(friendId.id);
      });
    }


    isFriendOnline(friendId: any) : boolean {
      console.log('is friend online', this.onlineFriends.includes(friendId), friendId, this.onlineFriends);
      return this.onlineFriends.includes(friendId);
    }
  
    removeFriend() {
      console.log('remove friend');
      // Call the API to remove the friend
      // You can use fetch or any other HTTP library to make the API call
    }

}
