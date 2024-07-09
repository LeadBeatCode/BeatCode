import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service'

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css'],
})

export class ProblemComponent implements OnInit {
  @Input() stderr: string = '';
  @Input() stdout: string = '';
  @Input() result: string = '';

  problem:boolean=true;
  testResult:boolean=false;
  resultStyle:string = '';
  
  constructor(private ApiService: ApiService) {
  }

  ngOnInit(): void {}

  showProblem(){
    this.problem=true;
    this.testResult=false;
  }

  showTestResult(){
    this.testResult=true;
    this.problem=false;
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
