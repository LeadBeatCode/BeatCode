import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-performance',
  templateUrl: './user-performance.component.html',
  styleUrl: './user-performance.component.css',
})
export class UserPerformanceComponent {
  wins: number = 7;
  losses: number = 3;
  @Input() changeLoadMenu: Function = () => {};
}
