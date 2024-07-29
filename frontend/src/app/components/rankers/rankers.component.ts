import { Component } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';

@Component({
  selector: 'app-rankers',
  templateUrl: './rankers.component.html',
  styleUrl: './rankers.component.css'
})
export class RankersComponent {

  leaderboard : any[] = [];

  constructor(private apiService: ApiService) {
    this.apiService.getLeaderboard().subscribe((data: any) => {
      this.leaderboard = data;
    });
  }


}
