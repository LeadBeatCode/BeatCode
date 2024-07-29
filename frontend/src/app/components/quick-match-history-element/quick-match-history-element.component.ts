import { Component, Input, OnInit } from '@angular/core';

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
  constructor() {}
  ngOnInit(): void {
    console.log('image', this.image);
  }
}
