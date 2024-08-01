import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';

@Component({
  selector: 'app-quick-match-history-element',
  templateUrl: './quick-match-history-element.component.html',
  styleUrl: './quick-match-history-element.component.css',
})
export class QuickMatchHistoryElementComponent implements OnInit {
  @Input() nickname: string = '';
  @Input() result: string = '';
  @Input() time: string = '';
  @Input() opponent: string = '';
  @Input() image: string = '';
  @Input() opponentImage: string = '';
  @Input() user1bp: number = 0;
  @Input() user2bp: number = 0;
  constructor(private api: ApiService) {}
  ngOnInit(): void {
  }
  getRank(rank: number): string {
    if (rank === null) {
      return 'unranked';
    }
    if (rank < 200) {
      return 'rank1';
    } else if (rank < 400) {
      return 'rank2';
    } else if (rank < 600) {
      return 'rank3';
    } else if (rank < 800) {
      return 'rank4';
    }
    return 'rank5';
  }
}
