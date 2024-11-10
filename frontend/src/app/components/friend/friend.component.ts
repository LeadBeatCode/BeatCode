import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.css',
})
export class FriendComponent {
  @Input() isOnline: boolean = false;
  @Input() name: string = '';
  @Input() rank: string = '';
  @Input() image: string = '';
}
