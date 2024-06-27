import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

declare const monaco: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = "frontend";
  editorOptions = { theme: 'vs-dark', language: 'python' };
  opponentEditorOptions = { theme: 'hc-black', language: 'python' };
  code: string = 'print(1)\n';
  opponentCode: string = 'print(2)\n';
  submissionToken: string = '';
  expectedOutput: string = '4\n';

  constructor(private api: ApiService) {}

  runCode() {
    this.logCode();
    this.api.submitCode(this.code).subscribe((data) => {
      this.submissionToken = data.token;
      this.checkSubmission();
    });
  }

  checkSubmission() {
    this.api.getSubmission(this.submissionToken).subscribe((data) => {
      if (data.stdout) {
        if (data.stdout === this.expectedOutput) {
          console.log('Correct answer!');
        } else {
          console.log('Incorrect answer!');
        }
      } else {
        setTimeout(() => {
          this.checkSubmission();
        }, 1000);
      }
    });
  }
    


  logCode() {
    console.log(this.code);
  } 
}
