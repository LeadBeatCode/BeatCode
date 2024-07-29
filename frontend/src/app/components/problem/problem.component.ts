import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProblemComponent implements OnInit {
  @Input() stderr: string = '';
  @Input() stdout: string = '';
  @Input() expected_output: string = '';
  @Input() total_testcases: string = '';
  @Input() correct_testcases: string = '';
  @Input() last_testcase: string = '';
  @Input() result: string = '';
  @Input() problemTitle: string = '';
  @Input() problemText: string = '';
  @Input() numAttemptsText: string = '';

  problem: boolean = true;
  testResult: boolean = false;
  resultStyle: string = '';

  constructor(
    private ApiService: ApiService,
    public sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {}

  showProblem() {
    this.problem = true;
    this.testResult = false;
  }

  showTestResult() {
    this.testResult = true;
    this.problem = false;
  }

  ngOnChanges() {
    if (this.result) {
      if (this.result.toLowerCase().includes('incorrect')) {
        this.resultStyle = 'incorrect';
      } else {
        this.resultStyle = 'correct';
      }
    }
  }
}
