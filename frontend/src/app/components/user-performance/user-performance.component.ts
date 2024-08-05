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
  radarCategories: string[] = ['Graphs', 'SQL', 'Python', 'Heap', 'Recursions', 'Shell'];
  radarData: number[] = [80, 50, 30, 40, 100, 20];
  tags: Map<string, number> = new Map<string, number>([
    ['#dynamic programming', 12],
    ['#mathematics', 30],
    ['backtracking', 5],
    ['implementation', 10],
    ['bruteforcing', 3],
    ['data structures', 20],
    ['number theory', 15],
  ]);
  @Input() changeLoadMenu: Function = () => {};
  @Input() userId: string = '';
  rank: string = '';
  subrank: string = '';
  @Input() bp: number = 0;
  quickHistory: any[] = [];
  quickHistoryGames: any[] = [];
  quickHistoryDates: any[] = [];
  nickname: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPerformance(this.userId).subscribe({
      next: (data) => {
        this.wins = data['wins'];
        this.losses = data['losses'];

        const historyData = data['history'];

        this.quickHistory = historyData.map((game: any) => {
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


        this.quickHistoryGames = this.quickHistory.map((group: any) => {
          return group.games;
        });

        this.quickHistoryDates = this.quickHistory.map((group: any) => {
          return group.date;
        });

        this.nickname = data['nickName'];
      },
      error: (err) => {
      },
    });
  }

  getRank(rank: number): string {
    if (rank < 200) {
      this.rank = 'Silver';
      this.subrank = rank < 100 ? '1' : '2';
      return 'silver';
    } else if (rank < 400) {
      this.rank = 'Emerald';
      this.subrank = rank < 300 ? '1' : '2';
      return 'emerald';
    } else if (rank < 600) {
      this.rank = 'Diamond';
      this.subrank = rank < 500 ? '1' : '2';
      return 'diamond';
    } else if (rank < 800) {
      this.rank = 'Master';
      this.subrank = rank < 700 ? '1' : '2';
      return 'master';
    }
    this.rank = 'Challenger';
    return 'challenger';
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
