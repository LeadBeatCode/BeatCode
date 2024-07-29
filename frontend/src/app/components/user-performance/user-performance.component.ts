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
  @Input() rank: string = '';
  @Input() subrank: string = '';
  @Input() bp: number = 0;
  quickHistory: any[] = [];
  quickHistoryGames: any[] = [];
  quickHistoryDates: any[] = [];
  nickname: string = '';
  rankImage: any = {
    Silver: '../../../assets/rank1.png',
    Emerald: '../../../assets/rank2.png',
    Diamond: '../../../assets/rank3.png',
    Ruby: '../../../assets/rank4.png',
    Master: '../../../assets/rank5.png',
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    console.log('userId in user performance', this.userId);
    this.api.getPerformance(this.userId).subscribe({
      next: (data) => {
        console.log('data from user performance', data);
        this.wins = data['wins'];
        this.losses = data['losses'];

        const historyData = data['history'];

        this.quickHistory = historyData.map((game: any) => {
          console.log('game', game);
          return game;
        });

        const groups = historyData.reduce((groups: any, game: any) => {
          const date = game.createdAt.split('T')[0];
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(game);
          return groups;
        }, {});

        // Edit: to add it in the array format instead
        this.quickHistory = Object.keys(groups).map((date) => {
          return {
            date,
            games: groups[date],
          };
        });

        console.log(this.quickHistory);

        this.quickHistoryGames = this.quickHistory.map((group: any) => {
          console.log('sdfsdf', group.games);
          return group.games;
        });

        this.quickHistoryDates = this.quickHistory.map((group: any) => {
          return group.date;
        });

        console.log('history', this.quickHistoryGames);
        this.nickname = data['nickName'];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showResults(game: any) {
    if (game.winner === 'p1' && game.userId1 === this.userId) {
      return 'win';
    }
    if (game.winner === 'p2' && game.userId2 === this.userId) {
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
