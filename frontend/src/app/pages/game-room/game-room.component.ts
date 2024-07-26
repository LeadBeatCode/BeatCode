import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import * as Yjs from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../services/gameService/game.service';
import { switchMap } from 'rxjs';

@Component({
  // selector: 'app-root',
  // templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css'],
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css',
})
export class GameRoomComponent implements OnInit {
  title = 'frontend';
  editorOptions = { theme: 'vs-dark', language: 'python' };
  opponentEditorOptions = { theme: 'hc-black', language: 'python' };
  player1Code: string =
    '# Welcome to BeatCode!\n# Write down your code here.\n';
  player2Code: string =
    '# Welcome to BeatCode!\n# Write down your code here.\n';
  submissionToken: string = '';
  expectedOutput: string = '4\n';
  result: string = '';
  stdout: string = '';
  stderr: string = '';
  playerTitle: string = '';
  currentRoom: string = '';
  language: string = 'Python3';
  import: string = 'from typing import List\n';
  numAttempts: number = 0;
  numAttemptsText: string = '';
  time: number = 0;
  displayTime: string = '';
  timeInterval: any;
  opponentSocketId: string = '';
  problemTitle: string = '';
  problemText: string = '';
  player1HeartCount: number[] = Array(10).fill(1);
  player2HeartCount: number[] = Array(10).fill(1);
  isPve: boolean = false;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private socket: Socket,
    private game: GameService,
    private router: Router,
  ) {
    
    this.activatedRoute.queryParams.subscribe((params) => {
      const roomId = params['roomId'];
      const accessToken = localStorage.getItem('accessToken');
      this.currentRoom = roomId;
      if (accessToken) {
        this.api.getRoom(roomId, accessToken).subscribe({
          next: (data) => {
            this.isPve = data.isPve;
            this.api.getRoomSocketIds(this.currentRoom).subscribe((data) => {
              if (this.playerTitle === 'p1') {
                this.opponentSocketId = data.socketId2;
              } else {
                this.opponentSocketId = data.socketId1;
              }
            });
          },
          error: (err) => {
            console.log(err);
            if (err.status === 401) {
              console.log('Please sign in');
              this.router.navigate(['/']);
            } else if (err.status === 403) {
              console.log('You are not authorized to access this page');
              this.router.navigate(['/']);
            }
          },
        });
      } else {
        console.log('Please sign in');
        this.router.navigate(['/']);
      }

    });
  }

  ngOnInit() {
    this.startTimer();
    // this.api.getLeetcodeOfficialSolution().subscribe(data => {
    //   console.log(data.data.allPlaygroundCodes)
    //   this.player1Code = '\n' + data.data.allPlaygroundCodes[6].code;
    // })
    // const getQuestionInterval = setInterval(() => {
    //   if (this.problemText) {
    //     clearInterval(getQuestionInterval);
    //   }
    this.getProblem();
    // }, 5000);
  }

  startTimer() {
    console.log('=====>');
    this.timeInterval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.displayTime = this.transform(this.time);
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60);
  }

  editorInit(editor: any) {
    editor.updateOptions({
      scrollBeyondLastLine: false,
      renderLineHighlight: 'none',
    });

    if (!this.isPve) {if (this.playerTitle === 'p2') {
      editor.updateOptions({ readOnly: true });
      this.socket.on('editor', (data: any) => {
        editor.setValue(data.code);
      });
    } else {
      editor.updateOptions({ readOnly: false });
      editor.onDidChangeModelContent((event: any) => {
        //connect to socket
        console.log(
          'editor content changed',
          this.opponentSocketId,
          editor.getValue(),
        );
        this.socket.emit('editor', {
          targetSocketId: this.opponentSocketId,
          code: editor.getValue(),
        });
      });
    }}
  }

  opponentEditorInit(editor: any) {
    editor.updateOptions({
      scrollBeyondLastLine: false,
      renderLineHighlight: 'none',
    });
    if(!this.isPve) {if (this.playerTitle === 'p1') {
      editor.updateOptions({ readOnly: true });
      this.socket.on('editor', (data: any) => {
        console.log('opponent editor content changed', data.code);
        editor.setValue(data.code);
      });
    } else {
      editor.updateOptions({ readOnly: false });
      editor.onDidChangeModelContent((event: any) => {
        this.socket.emit('editor', {
          targetSocketId: this.opponentSocketId,
          code: editor.getValue(),
        });
      });
    }} else {
      editor.updateOptions({ readOnly: true });
    }
  }

  runCode() {
    var code = this.playerTitle === 'p1' ? this.player1Code : this.player2Code;
    code = this.import + code;
    code += '\nsoln = Solution()\nprint(soln.twoSum([2,7,11,15], 9))';
    this.api.submitCode(code).subscribe((data) => {
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
          this.showResult(
            `Output: ${data.stdout}`,
            'Correct answer!',
            this.numAttempts,
          );
        } else {
          if (this.playerTitle === 'p1') {
            this.player1HeartCount[this.numAttempts] = 0;
            this.player1HeartCount = [...this.player1HeartCount];
            console.log(this.player1HeartCount);
          } else {
            this.player2HeartCount[this.numAttempts] = 0;
            this.player2HeartCount = [...this.player2HeartCount];
            console.log(this.player2HeartCount);
          }
          if (this.numAttempts < 9) {
            this.numAttempts += 1;
          } else {
            console.log('Game Over');
            clearInterval(this.timeInterval);
          }
          this.showResult(
            `Output: ${data.stdout}`,
            'Incorrect answer!',
            this.numAttempts,
          );
        }
      } else {
        setTimeout(() => {
          this.checkSubmission();
        }, 1000);
      }
    });
  }

  showResult(stdout: string, result: string, numAttempts: number) {
    this.stderr = '';
    this.stdout = stdout;
    this.result = result;
    // console.log(this.stdout, this.expectedOutput)
    // if ('' + this.stdout + '\n' === this.expectedOutput) {
    //   this.numAttemptsText = 'Congratulations! You solved the problem in ' + this.numAttempts + ' attempts!';
    // } else {
    this.numAttemptsText = 'You have made ' + this.numAttempts + ' attempts.';
    // }
  }

  showError(stderr: string) {
    this.stderr = stderr;
    this.stdout = '';
    this.result = '';
  }

  getProblem() {
    if(this.isPve) {
      this.api.getRandomPveProblem().subscribe((data) => {
        console.log(data.question.title);
        this.problemTitle = data.title;
        this.problemText = data.description;
        this.api.getProblemStartCode().subscribe((data) => {
          this.player1Code += data[this.language];
        });
        console.log(data.question);
      });
    } else {
    this.api.getRandomProblem().subscribe((data) => {
      console.log(data.question.title);
      this.problemTitle = data.question.title;
      this.problemText = data.question.content;
      this.api.getProblemStartCode().subscribe((data) => {
        this.player1Code += data[this.language];
      });
      console.log(data.question);
    });
  }
}
}
