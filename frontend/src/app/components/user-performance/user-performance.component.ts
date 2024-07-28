import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';

@Component({
  selector: 'app-user-performance',
  templateUrl: './user-performance.component.html',
  styleUrl: './user-performance.component.css',
})
export class UserPerformanceComponent implements OnInit {
  wins: number = 7;
  losses: number = 3;
  @Input() changeLoadMenu: Function = () => {};
  @Input() userId: string = '';
  history: any[] = [];
  nickname: string = '';

  constructor(private api:ApiService) {
    
  }

  ngOnInit(): void {
    console.log('userId in user performance', this.userId);
    this.api.getPerformance(this.userId).subscribe({
      next: (data) => {
        console.log('data from user performance', data);
        this.wins = data['wins'];
        this.losses = data['losses'];
        this.history = data['history'];
        
        console.log('history', this.history);
        this.nickname = data['nickName'];
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  showResults(game: any) {
    if (game.winner === "p1" && game.userId1 === this.userId) {
      return 'win';
    }
    if (game.winner === "p2" && game.userId2 === this.userId) {
      return 'win';
    }
    return 'lose';
  }

  showOpponent(game: any) {
    if (game.userId1 === this.userId) {
      return game.user2Nickname;
    }
    return game.user1Nickname;
  }

  showImage(game: any, isCurrentUSer: boolean) {
    if (game.userId1 === this.userId && isCurrentUSer) {
      return game.user1ProfilePicture;
    }
    if (game.userId2 === this.userId && isCurrentUSer) {
      return game.user2ProfilePicture;
    }
    if (game.userId1 === this.userId) {
      return game.user2ProfilePicture;
    }
    return game.user1ProfilePicture;
  }


}
