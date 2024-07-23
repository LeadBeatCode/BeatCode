import { Component, OnInit} from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import * as Yjs from "yjs"
import { MonacoBinding } from "y-monaco"
import { WebsocketProvider } from "y-websocket"
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../services/gameService/game.service';

@Component({
  // selector: 'app-root',
  // templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css'],
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css'
})

export class GameRoomComponent implements OnInit{
  title = 'frontend';
  editorOptions = { theme: 'vs-dark', language: 'python' };
  opponentEditorOptions = { theme: 'hc-black', language: 'python' };
  player1Code: string = "# Welcome to BeatCode!\n# Write down your code here.\n";
  player2Code: string = "# Welcome to BeatCode!\n# Write down your code here.\n";
  submissionToken: string = '';
  expectedOutput: string = '4\n';
  result: string = '';
  stdout: string = '';
  stderr: string = '';
  playerTitle: string = '';
  currentRoom: string = '';
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
  

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private socket: Socket, game: GameService, private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
        const roomId = params['roomId'];
        const accessToken = localStorage.getItem('accessToken');
        this.currentRoom = roomId;
        this.api.getRoom(roomId).subscribe((data) => {
          if (data.token2 === accessToken) {
            this.playerTitle = 'p2';
          } else if (data.token1 === accessToken) {
            this.playerTitle = 'p1';
          } else {
            console.log('You are not a player in this room');
            this.router.navigate(['/']);
          }
          this.api.getRoomSocketIds(this.currentRoom).subscribe((data) => {
            if (this.playerTitle === 'p1') {
              this.opponentSocketId = data.socketId2;
            } else {
              this.opponentSocketId = data.socketId1;
            }
          });
        });
        this.api.getRoomSocketIds(this.currentRoom).subscribe((data) => {
      if (this.playerTitle === 'p1') {
        this.opponentSocketId = data.socketId2;
      } else {
        this.opponentSocketId = data.socketId1;
      }
    });
      });
  }

  ngOnInit() {
    this.startTimer();
    this.api.getLeetcodeOfficialSolution().subscribe(data => {
      console.log(data.data.allPlaygroundCodes)
      this.player1Code = data.data.allPlaygroundCodes[6].code;
    })
    // const getQuestionInterval = setInterval(() => {
    //   if (this.problemText) {
    //     clearInterval(getQuestionInterval);
    //   }
      this.getProblem();
    // }, 5000);
  }

  startTimer() {
    console.log("=====>");
    this.timeInterval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.displayTime=this.transform( this.time)
    }, 1000);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60);
  }



  editorInit(editor: any) {
    editor.updateOptions({ scrollBeyondLastLine: false , renderLineHighlight: 'none'});
    if (this.playerTitle === 'p2') {
      editor.updateOptions({ readOnly: true });
      this.socket.on('editor', (data: any) => {
        editor.setValue(data.code);
      });
    } else {
      editor.updateOptions({ readOnly: false });
      editor.onDidChangeModelContent((event: any) => {
        //connect to socket
        console.log('editor content changed', this.opponentSocketId, editor.getValue());
        this.socket.emit('editor', { targetSocketId: this.opponentSocketId, code: editor.getValue()});
      });
      
    }
    
  }

  opponentEditorInit(editor: any) {
    editor.updateOptions({ scrollBeyondLastLine: false , renderLineHighlight: 'none'});
    if (this.playerTitle === 'p1') {
      editor.updateOptions({ readOnly: true });
      this.socket.on('editor', (data: any) => {
        console.log('opponent editor content changed', data.code);
        editor.setValue(data.code);
      });
    } else {
      editor.updateOptions({ readOnly: false });
      editor.onDidChangeModelContent((event: any) => {

        this.socket.emit('editor', { targetSocketId: this.opponentSocketId, code: editor.getValue()});
      });
    }
    // const ydoc = new Yjs.Doc()
    // const provider = new WebsocketProvider('http://localhost:1235', 'p1Editor' + this.currentRoom, ydoc)
    // const ytext = ydoc.getText('p2Monaco' + this.currentRoom)
    // const monacoBinding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), provider.awareness);
    
  }

  runCode() {
    var code = this.playerTitle === 'p1' ? this.player1Code : this.player2Code;
    code += '\nsoln = Solution()\nprint(soln.twoSum([2,7,11,15], 9))'
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
          this.showResult(`Output: ${data.stdout}`, 'Correct answer!', this.numAttempts);
        } else {
          if (this.playerTitle === 'p1') {
            this.player1HeartCount[this.numAttempts] = 0;
            this.player1HeartCount = [...this.player1HeartCount];
            console.log(this.player1HeartCount)
          } else {
            this.player2HeartCount[this.numAttempts] = 0;
            this.player2HeartCount = [...this.player2HeartCount];
            console.log(this.player2HeartCount)
          }
          if (this.numAttempts < 9) {
            this.numAttempts += 1;
          } else {
            console.log("Game Over");
          }
          this.showResult(`Output: ${data.stdout}`, 'Incorrect answer!', this.numAttempts);
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
    this.api.getRandomProblem().subscribe(data => {
      console.log(data.question.title)
      this.problemTitle = data.question.title;
      this.problemText = data.question.content;
      console.log(data.question)
    })
  }
}
