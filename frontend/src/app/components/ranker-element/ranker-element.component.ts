import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ranker-element',
  templateUrl: './ranker-element.component.html',
  styleUrl: './ranker-element.component.css',
})
export class RankerElementComponent {
  @Input() nickname: string = '';
  @Input() rank: number = 0;
  @Input() picture: string = '';

  constructor() {}
  ngOnInit(): void {}
  getRank(rank: number): string {
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
