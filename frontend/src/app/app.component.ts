import { Component } from '@angular/core';
import { ApiService } from './services/apiService/api.service';

declare const monaco: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'frontend';
  editorOptions = { theme: 'vs-dark', language: 'python' };
  opponentEditorOptions = { theme: 'hc-black', language: 'python' };
  code: string = 'print(1)\n';
  opponentCode: string = 'print(2)\n';
  submissionToken: string = '';
  expectedOutput: string = '4\n';
  result: string = '';
  stdout: string = '';
  stderr: string = '';

  constructor(private api: ApiService) {}

  runCode() {
    this.api.submitCode(this.code).subscribe((data) => {
      this.submissionToken = data.token;
      this.checkSubmission();
    });
  }

  checkSubmission() {
    this.api.getSubmission(this.submissionToken).subscribe((data) => {
      if (data.stderr) {
        this.showError(`Error: ${data.stderr}`);
      }
      if (data.stdout) {
        if (data.stdout === this.expectedOutput) {
          this.showResult(`Output: ${data.stdout}`, 'Correct answer!');
        } else {
          this.showResult(`Output: ${data.stdout}`, 'Incorrect answer!');
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

  showResult(stdout: string, result: string) {
    this.stderr = '';
    this.stdout = stdout;
    this.result = result;
  }

  showError(stderr: string) {
    this.stderr = stderr;
    this.stdout = '';
    this.result = '';
  }
}
