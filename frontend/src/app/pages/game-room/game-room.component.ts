import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../services/gameService/game.service';
import { GptService } from '../../services/gptService/gpt.service';
import { switchMap } from 'rxjs';
import moment from 'moment';

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
  gptResponse: string = '';
  pveProblemId: number = 1;
  opponentLanguage: string = 'Python3';
  editor: any;
  now: string = '00:00:00';
  dateStart: any = moment();

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private socket: Socket,
    private game: GameService,
    private router: Router,
    private gptService: GptService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      console.log(navigation.extras.state);
      this.playerTitle = navigation.extras.state['playerTitle'];
    }
    console.log('player title', this.playerTitle);
    this.activatedRoute.queryParams.subscribe((params) => {
      const roomId = params['roomId'];
      const accessToken = localStorage.getItem('accessToken');
      this.currentRoom = roomId;
      if (accessToken) {
        this.api.getRoom(roomId, accessToken).subscribe({
          next: (data) => {
            console.log(data);
            this.isPve = data.isPve;
            if (!this.isPve) {
              this.api.getRoomSocketIds(this.currentRoom).subscribe((data) => {
                if (this.playerTitle === 'p1') {
                  this.opponentSocketId = data.socketId2;
                } else {
                  this.opponentSocketId = data.socketId1;
                }
              });
            }
            this.getProblem();
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

      setInterval(() => {
        // this.now = new Date();
        this.now = moment
          .utc(moment(moment()).diff(this.dateStart))
          .format('HH:mm:ss');
      }, 1000);
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
    // this.getProblem();
    this.dateStart = moment();
    // }, 5000);

    const langElement = document.querySelector('.lang-selector');
    if (langElement) {
      langElement.addEventListener('click', () => {
        langElement.classList.toggle('active');
      });
    }
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

  exitGameRoom() {
    clearInterval(this.timeInterval);
    this.router.navigate(['/dashboard']);
  }

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60);
  }

  editorInit(editor: any) {
    this.editor = editor;
    // console.log(editor.getModel().getLanguageIdentifier().language);
    editor.updateOptions({
      scrollBeyondLastLine: false,
      renderLineHighlight: 'none',
    });

    if (!this.isPve) {
      if (this.playerTitle === 'p2') {
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
      }
    }
  }

  opponentEditorInit(editor: any) {
    this.socket.on('opponent change language', (data: any) => {
      this.opponentLanguage = data.language;
    });
    editor.updateOptions({
      scrollBeyondLastLine: false,
      renderLineHighlight: 'none',
    });
    if (!this.isPve) {
      if (this.playerTitle === 'p1') {
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
      }
    } else {
      editor.updateOptions({ readOnly: true });
    }
  }

  runCode(isGptResponse: boolean) {
    if (this.isPve) {
      const expectedOutputs: any[] = [];
      const expectedInputs: any[] = [];
      this.api.getPveProblem(this.pveProblemId).subscribe((data) => {
        expectedInputs.push(data.input1);
        expectedInputs.push(data.input2);
        expectedInputs.push(data.input3);
        expectedOutputs.push(data.expectedOutput1);
        expectedOutputs.push(data.expectedOutput2);
        expectedOutputs.push(data.expectedOutput3);
        for (let i = 0; i < expectedInputs.length; i++) {
          if (isGptResponse) {
            let code =
              this.player2Code +
              '\nprint(solution(' +
              JSON.stringify(expectedInputs[i].subInput1) +
              '))';
            this.api.submitCode(code, 'python3').subscribe((data) => {
              this.checkSubmission(
                data.token,
                isGptResponse,
                expectedOutputs[i].subOutput1,
                expectedInputs[i].subInput1,
              );
            });
          } else {
            console.log(expectedInputs[0]);
            console.log(expectedInputs[0].subInput1);
            var code =
              this.playerTitle === 'p1' ? this.player1Code : this.player2Code;
            console.log(this.playerTitle);
            code = this.import + code;
            if (this.language === 'python3' || this.language === 'python') {
              code =
                this.player1Code +
                '\nprint(solution(' +
                JSON.stringify(expectedInputs[i].subInput1) +
                '))';
            } else if (this.language === 'C') {
              code =
                this.player1Code +
                '\n int main(){printf("%d", solution(' +
                JSON.stringify(expectedInputs[i].subInput1) +
                '))}';
            } else if (this.language === 'C++') {
              code =
                this.player1Code +
                '\nstd::cout << solution(' +
                JSON.stringify(expectedInputs[i].subInput1) +
                ') << std::endl';
            } else if (this.language === 'Java') {
              code =
                this.player1Code +
                '\nSystem.out.println(solution(' +
                JSON.stringify(expectedInputs[i].subInput1) +
                '));';
            }

            this.api.submitCode(code, this.language).subscribe((data) => {
              this.checkSubmission(
                data.token,
                isGptResponse,
                expectedOutputs[i].subOutput1,
                expectedInputs[i].subInput1,
              );
            });
          }
        }
        console.log(expectedInputs);
        console.log(expectedOutputs);
      });
    } else {
      var code =
        this.playerTitle === 'p1' ? this.player1Code : this.player2Code;
      console.log(this.playerTitle);
      //code = this.import + code;
      //code = this.player2Code + 'print(solution(' + JSON.stringify(expectedInputs[0].subInput1) + '))';
      //code += 'print(solution("aaabb"))';
      console.log(code);
      this.api.submitCode(code, this.language).subscribe((data) => {
        this.checkSubmission(
          data.token,
          isGptResponse,
          this.expectedOutput,
          'aaabb',
        );
      });
    }
  }

  checkSubmission(
    submissionToken: string,
    isGptResponse: boolean,
    expectedOutput: string,
    input: string,
  ) {
    this.api.getSubmission(submissionToken).subscribe((data) => {
      console.log(data);
      if (data.stderr) {
        const error = atob(data.stderr);
        this.showError(`Error: ${error}`);
      }
      if (data.status.id === 3) {
        const output = atob(data.stdout);
        if (output === expectedOutput + '\n') {
          if (isGptResponse) {
            this.showResult(
              `Input: ${input}\nOutput: ${output}`,
              'Gpt is faster than you!',
              this.numAttempts,
            );
          } else {
            this.showResult(
              `Input: ${input}\nOutput: ${output}`,
              'Correct answer!',
              this.numAttempts,
            );
          }
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
            `Input: ${input}\n
            Output: ${output}`,
            'Incorrect answer!',
            this.numAttempts,
          );
        }
      } else if (data.status.id === 1 || data.status.id === 2) {
        setTimeout(() => {
          this.checkSubmission(
            submissionToken,
            isGptResponse,
            expectedOutput,
            input,
          );
        }, 1000);
      } else {
        this.showError('Error: ' + data.status.description);
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
    console.log('get problem', this.isPve);
    if (this.isPve) {
      this.api.getRandomPveProblem().subscribe((data) => {
        console.log(data.title);
        this.problemTitle = data.title;
        this.problemText =
          data.description +
          '<p>\ninput1: ' +
          data.input1.subInput1 +
          '</p><p>\ninput2: ' +
          data.input2.subInput1 +
          '</p>\ninput3: ' +
          data.input3.subInput1;
        this.pveProblemId = data.id;
        // this.gptService.getResponse(data.description + 'write the solution in python 3 and a method called solution. Do not include anything other than the method itself').then((response) => {
        //   console.log(response);
        //   this.gptResponse += response;
        //   console.log(this.player2Code);
        //   if (response){
        //     this.displayResponseLineByLine(response);
        //   }

        // });
        console.log(data.question);
      });
    } else {
      this.api.getRandomProblem().subscribe((data) => {
        console.log(data.question.title);
        this.problemTitle = data.question.title;
        console.log(JSON.stringify(data.question.content));
        this.problemText = data.question.content;
        this.api.getProblemStartCode().subscribe((data) => {
          this.player1Code += data[this.language];
          console.log(this.player1Code);
        });
        console.log(data.question);
      });
    }
  }

  displayResponseLineByLine(response: string) {
    // const lines = response.split('\n');
    // let currentLineIndex = 0;

    // const intervalId = setInterval(() => {
    //   if (currentLineIndex < lines.length) {
    //     this.player2Code += lines[currentLineIndex] + '\n';
    //     currentLineIndex++;
    //   } else {
    //     clearInterval(intervalId);
    //   }
    // }, 5000); // Adjust the interval time as needed (1000ms = 1 second)
    let index = 0;
    const delay = Math.floor(Math.random() * 900) + 100;
    const intervalId = setInterval(() => {
      if (index < response.length) {
        this.player2Code += response[index];
        index++;
      } else {
        clearInterval(intervalId);
        this.runCode(true);
      }
    }, delay);
  }

  chooseLanguage(language: string) {
    const langListElement = document.querySelector(
      '.lang-list.' + this.playerTitle,
    );
    console.log(this.playerTitle);
    console.log(langListElement);
    if (langListElement) {
      langListElement.classList.toggle('hidden');
    }
    console.log(language);
    if (language !== 'choose') {
      this.language = language;
      console.log(this.editor);
      //this.editor.setLanguageConfiguration(language);
      //monaco.editor.setModelLanguage(this.editor.getModel(), language);
      if (!this.isPve) {
        this.socket.emit('change language', {
          language: language,
          targetSocketId: this.opponentSocketId,
        });
      }
    }
    if (this.playerTitle === 'p1') {
      if (language === 'Python3' || language === 'Python') {
        this.editorOptions = { theme: 'hc-black', language: 'python' };
      } else if (language === 'C') {
        this.editorOptions = { theme: 'hc-black', language: 'c' };
      } else if (language === 'C++') {
        this.editorOptions = { theme: 'hc-black', language: 'cpp' };
      } else if (language === 'Java') {
        this.editorOptions = { theme: 'hc-black', language: 'java' };
      }
    } else {
      if (language === 'Python3' || language === 'Python') {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'python' };
      } else if (language === 'C') {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'c' };
      } else if (language === 'C++') {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'cpp' };
      } else if (language === 'Java') {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'java' };
      }
    }
  }
}
