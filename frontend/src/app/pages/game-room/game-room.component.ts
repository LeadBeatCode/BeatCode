import { Component } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import * as Yjs from "yjs"
import { MonacoBinding } from "y-monaco"
import { WebrtcProvider } from "y-webrtc"


@Component({
  // selector: 'app-root',
  // templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css'],
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css'
})

export class GameRoomComponent {
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

  editorInit(editor: any) {
    const ydoc = new Yjs.Doc()
    const provider = new WebrtcProvider('editor', ydoc)
    const ytext = ydoc.getText('monaco')
    const monacoBinding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), provider.awareness)
    editor.onDidChangeModelContent((event: any) => {
      //connect to socket
      console.log('1')
    });
  }

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
