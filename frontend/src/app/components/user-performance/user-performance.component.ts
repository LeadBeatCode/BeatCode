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
  quickHistory: any[] = [];
  quickHistoryGames: any[] = [];
  quickHistoryDates: any[] = [];
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
        
        // const historyData = data['history'];

        const historyData = [
    {
        "id": 12,
        "status": "gameover",
        "userId1": "google-oauth2|102285350198118156800",
        "userId2": "google-oauth2|113045705384435939202",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "shortest-impossible-sequence-of-rolls",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-28T11:42:00.995Z",
        "updatedAt": "2024-07-28T11:42:15.433Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user1Nickname": "jackjin965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user2Nickname": "hermit965"
    },
    {
        "id": 11,
        "status": "gameover",
        "userId1": "google-oauth2|102285350198118156800",
        "userId2": "google-oauth2|113045705384435939202",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "subarrays-distinct-element-sum-of-squares-i",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-28T11:41:18.173Z",
        "updatedAt": "2024-07-28T11:41:29.907Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user1Nickname": "jackjin965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user2Nickname": "hermit965"
    },
    {
        "id": 10,
        "status": "gameover",
        "userId1": "google-oauth2|113045705384435939202",
        "userId2": "google-oauth2|102285350198118156800",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "maximum-number-of-vowels-in-a-substring-of-given-length",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-28T11:40:13.707Z",
        "updatedAt": "2024-07-28T11:40:29.299Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user1Nickname": "hermit965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user2Nickname": "jackjin965"
    },
    {
        "id": 9,
        "status": "gameover",
        "userId1": "google-oauth2|102285350198118156800",
        "userId2": "google-oauth2|113045705384435939202",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "best-sightseeing-pair",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-28T11:38:13.985Z",
        "updatedAt": "2024-07-28T11:38:28.827Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user1Nickname": "jackjin965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user2Nickname": "hermit965"
    },
    {
        "id": 8,
        "status": "gameover",
        "userId1": "google-oauth2|113045705384435939202",
        "userId2": "google-oauth2|102285350198118156800",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "continuous-subarrays",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-29T11:35:36.026Z",
        "updatedAt": "2024-07-28T11:35:50.169Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user1Nickname": "hermit965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user2Nickname": "jackjin965"
    },
    {
        "id": 7,
        "status": "gameover",
        "userId1": "google-oauth2|102285350198118156800",
        "userId2": "google-oauth2|113045705384435939202",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "design-memory-allocator",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-28T11:34:21.209Z",
        "updatedAt": "2024-07-28T11:34:35.607Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user1Nickname": "jackjin965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user2Nickname": "hermit965"
    },
    {
        "id": 6,
        "status": "gameover",
        "userId1": "google-oauth2|102285350198118156800",
        "userId2": "google-oauth2|113045705384435939202",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "robot-collisions",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p2",
        "createdAt": "2024-07-28T11:33:17.240Z",
        "updatedAt": "2024-07-28T11:33:34.834Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user1Nickname": "jackjin965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user2Nickname": "hermit965"
    },
    {
        "id": 4,
        "status": "gameover",
        "userId1": "google-oauth2|102285350198118156800",
        "userId2": "google-oauth2|113045705384435939202",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "amount-of-new-area-painted-each-day",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-28T11:31:51.250Z",
        "updatedAt": "2024-07-28T11:32:07.154Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user1Nickname": "jackjin965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user2Nickname": "hermit965"
    },
    {
        "id": 3,
        "status": "gameover",
        "userId1": "google-oauth2|113045705384435939202",
        "userId2": "google-oauth2|102285350198118156800",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "longest-palindromic-substring",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-29T11:30:48.998Z",
        "updatedAt": "2024-07-28T11:31:03.006Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user1Nickname": "hermit965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user2Nickname": "jackjin965"
    },
    {
        "id": 2,
        "status": "gameover",
        "userId1": "google-oauth2|102285350198118156800",
        "userId2": "google-oauth2|113045705384435939202",
        "isPve": false,
        "gameType": null,
        "questionTitleSlug": "remove-vowels-from-a-string",
        "timeElapsed": null,
        "problemId": null,
        "user1Attempts": null,
        "user2Attempts": null,
        "user1Status": "accepted",
        "user2Status": "accepted",
        "winner": "p1",
        "createdAt": "2024-07-31T11:29:51.056Z",
        "updatedAt": "2024-07-28T11:30:11.839Z",
        "user1ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocLmXbSLH6sCOqd978QthE9U5ByX42LiCZyBFtFSk6iMInZLvw=s96-c",
        "user1Nickname": "jackjin965",
        "user2ProfilePicture": "https://lh3.googleusercontent.com/a/ACg8ocKyYzUDrkQsRl_HzlPBtiJ8Dkxw4FOdZ4I8PWKwWr8EsT6umw=s96-c",
        "user2Nickname": "hermit965"
    }
]

        this.quickHistory =historyData.map((game: any) => {
          console.log('game', game);
          return game;
        })

        const groups = historyData.reduce((groups: any, game) => {
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
            games: groups[date]
          };
        });

        console.log(this.quickHistory)

        this.quickHistoryGames = this.quickHistory.map((group: any) => {
          console.log('sdfsdf', group.games);
          return group.games;
        })

        this.quickHistoryDates = this.quickHistory.map((group: any) => {
          return group.date;
        })
        
        console.log('history', this.quickHistoryGames);
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
