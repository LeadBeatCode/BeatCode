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
  player1Code: string = ''
  player2Code: string = ''
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
  problemData: any = {}
  problemInitialCode: any = {}
  problemSlug: string = '';
  problemTitle: string = '';
  problemText: string = '';
  HEART_COUNT: number = 2;
  player1HeartCount: number[] = Array(this.HEART_COUNT).fill(1);
  player2HeartCount: number[] = Array(this.HEART_COUNT).fill(1);
  isPve: boolean = false;
  gptResponse: string = '';
  pveProblemId: number = 1;
  opponentLanguage: string = 'Python3';
  editor: any;
  timeElapsed: string = "00:00:00";
  dateStart: any = moment();
  titleSlug: string = '';
  submissionData: any = {gameType: "", id: "", titleSlug: "", questionId: ""};
  submissionDetails: any = {expected_output: "", total_testcases: "", correct_testcases: "", last_testcase: "", result: ""};
  showGameSummaryValue: boolean = false;
  timeElapsedInterval: any = 0;
  userImg1: string = '';
  userImg2: string = '';
  username1: string = '';
  username2: string = '';
  userrank1: string = '';
  userrank2: string = '';

  rankImage: any = {
    Silver: '../../../assets/rank1.png',
    Emerald: '../../../assets/rank2.png',
    Diamond: '../../../assets/rank3.png',
    Ruby: '../../../assets/rank4.png',
    Master: '../../../assets/rank5.png',
  }

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private socket: Socket,
    private game: GameService,
    private router: Router,
    private gptService: GptService,
    private gameService: GameService,
  ) {
    console.log('game room');
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
            this.userImg1 = data.userImg1;
            this.userImg2 = data.userImg2;
            this.username1 = data.user1Nickname;
            this.username2 = data.user2Nickname;
            this.userrank1 = this.rankImage[data.user1rank];
            this.userrank2 = this.rankImage[data.user2rank];
            this.submissionData.gameType = "leetcode";data.gameType;
            this.submissionData.titleSlug = data.questionTitleSlug;
            this.submissionData.id = data.playerTitle === 'p1' ? data.userId1 : data.userId2;
            this.isPve = data.isPve;
            this.titleSlug = data.questionTitleSlug;
            if(!this.isPve){
              this.api.getRoomSocketIds(this.currentRoom).subscribe((data) => {
              if (this.playerTitle === 'p1') {
                this.opponentSocketId = data.socketId2;
              } else {
                this.opponentSocketId = data.socketId1;
              }
            });}
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

      this.timeElapsedInterval = setInterval(() => {
        this.timeElapsed = moment.utc(moment(moment()).diff(this.dateStart)).format("HH:mm:ss");
        // UPDATE DB WITH TIME
      }, 1000);

    });
  }

  ngOnInit() {
    this.socket.on('connect', () => {
      this.socket.on('game won by opponent', (data: any) => {
        console.log(data);
        this.router.navigate(['/']);
      });
    });
    this.socket.on("game won by opponent", () => {
      console.log('game won by opponent');
      this.showGameSummary();
    })
    console.log('game room init');
    // this.startTimer();    
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

  exitGameRoom() {
    clearInterval(this.timeInterval);
    this.router.navigate(['/']);
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
    if(!this.isPve) {
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
    }} else {
      editor.updateOptions({ readOnly: true });
    }
  }

  showLeetcodeResult(lastTestcase:any, totalCorrect:any, totalTestcases:any) {

    
  }

  getUserSocket() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Please sign in');
      this.router.navigate(['/']);
      return;
    }
    this.gameService.getUserSocket(token).subscribe({
      next: (data) => {
        console.log('log out', data);
        localStorage.removeItem('accessToken');
        this.gameService.getUserSocket('need to do it').subscribe((result) => {
          console.log(result);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
    
  }

  clearResult() {
    this.result = '';
    this.stdout = '';
    this.stderr = '';
  }


  updateSubmissionDetails = (check_data: any) => {
    this.submissionDetails.runtimeError = check_data.runtimeError;
    this.submissionDetails.compileError = check_data.compileError;
    this.submissionDetails.codeOutput = check_data.codeOutput;
    this.submissionDetails.lastTestcase = check_data.lastTestcase// check_data.lastTestcase != "" ? JSON.parse(check_data.lastTestcase) : "";
    this.submissionDetails.totalCorrect = check_data.totalCorrect;
    this.submissionDetails.totalTestcases = check_data.totalTestcases;
    this.submissionDetails.expectedOutput = check_data.expectedOutput // check_data.expectedOutput != "" ? JSON.parse(check_data.expectedOutput) : "";
  }

  showGameSummary = () => {
    this.showGameSummaryValue = true;
  }

  gameOver = () => {
    this.showGameSummary();
  }

  checkCorrectness = (totalCorrect: number, totalTestcases: number) => {
    console.log(this.titleSlug)
    if (totalCorrect === totalTestcases) {
      console.log('Game Over');
      // clearInterval(this.timeInterval);
      clearInterval(this.timeElapsedInterval);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('Please sign in');
        this.router.navigate(['/']);
        return;
      }
      this.api.roomGameOver(parseInt(this.currentRoom), token, this.playerTitle === 'p1' ? 'p1' : 'p2' ).subscribe((data) => {
        console.log(data);
        this.socket.emit('game over', {roomId: this.currentRoom, token: token});
        this.showGameSummary();
      });
    }
  }

  runCode(isGptResponse: boolean) {
    console.log(this.submissionData)
    this.clearResult();
    this.api.runCode(this.submissionData.gameType, this.submissionData.id, this.submissionData.titleSlug, this.submissionData.questionId, this.language, this.playerTitle === 'p1' ? this.player1Code : this.player2Code).subscribe((data) => {
      console.log(data);
      if (this.submissionData.gameType === 'leetcode') {
        var submission_status = 16;
          const submitInterval = setInterval(() => {
            this.api.checkSubmission(this.submissionData.gameType, this.submissionData.id, data.submission_id).subscribe((res) => {
              const check_data = res.data.submissionDetails;
              console.log("checking", check_data.statusCode, check_data)
              if (check_data.totalTestcases) {
                clearInterval(submitInterval);
                submission_status = check_data.statusCode;
                this.updateSubmissionDetails(check_data)
                if ((this.submissionDetails.runtimeError && this.submissionDetails.runtimeError != "") || (this.submissionDetails.compileError  && this.submissionDetails.compileError != "")) {
                  console.log(this.submissionDetails.runtimeError, this.submissionDetails.compileError, !this.submissionDetails.runtimeError, !this.submissionDetails.compileError);
                  this.showError(this.submissionDetails.runtimeError ? this.submissionDetails.runtimeError : this.submissionDetails.compileError);
                } else {  // codeOutput, stdOutput
                  this.checkCorrectness(this.submissionDetails.totalCorrect, this.submissionDetails.totalTestcases);
                  if (!this.submissionDetails.codeOutput) {
                    this.showError('No output was printed');
                  } else {
                    this.showResult(this.submissionDetails.codeOutput, this.submissionDetails.expectedOutput, this.numAttempts);
                    this.showLeetcodeResult(this.submissionDetails.lastTestcase, this.submissionDetails.totalCorrect, this.submissionDetails.totalTestcases);
                  }
                }

                // this.showResult(stdOutput, JSON.stringify(lastTestcase), this.numAttempts);
              }
            })
          }, 2000);
      } else {
        this.checkSubmission(data.token, isGptResponse, this.expectedOutput, 'aaabb');
      }
    })
    if (this.isPve) {
      const expectedOutputs: any [] = [];
      const expectedInputs : any [] = [];
      this.api.getPveProblem(this.pveProblemId).subscribe((data) => {
        expectedInputs.push(data.input1);
        expectedInputs.push(data.input2);
        expectedInputs.push(data.input3);
        expectedOutputs.push(data.expectedOutput1);
        expectedOutputs.push(data.expectedOutput2);
        expectedOutputs.push(data.expectedOutput3);
        for (let i = 0; i < expectedInputs.length; i++) {
          if (isGptResponse) {
            let code = this.player2Code + '\nprint(solution(' + JSON.stringify(expectedInputs[i].subInput1) + '))';
            this.api.submitCode(code, 'python3').subscribe((data) => {
            this.checkSubmission(data.token, isGptResponse, expectedOutputs[i].subOutput1, expectedInputs[i].subInput1);
            
          });
          } else {
            console.log(expectedInputs[0]);
          console.log(expectedInputs[0].subInput1);
          var code = this.playerTitle === 'p1' ? this.player1Code : this.player2Code;
          console.log(this.playerTitle);
          code = this.import + code;
          if (this.language === 'python3' || this.language === 'python') {
          code = this.player1Code + '\nprint(solution(' + JSON.stringify(expectedInputs[i].subInput1) + '))';
          } else if (this.language === 'C') {
            code = this.player1Code + '\n int main(){printf("%d", solution(' + JSON.stringify(expectedInputs[i].subInput1) + '))}';
          } else if (this.language === 'C++') {
            code = this.player1Code + '\nstd::cout << solution(' + JSON.stringify(expectedInputs[i].subInput1) + ') << std::endl';
          } else if (this.language === 'Java') {
            code = this.player1Code + '\nSystem.out.println(solution(' + JSON.stringify(expectedInputs[i].subInput1) + '));';
          }

          this.api.submitCode(code, this.language).subscribe((data) => {
          
            this.checkSubmission(data.token, isGptResponse, expectedOutputs[i].subOutput1, expectedInputs[i].subInput1);
          });
        }
        }
        console.log(expectedInputs);
        console.log(expectedOutputs);
        

      });
    } else {

      // var code = this.playerTitle === 'p1' ? this.player1Code : this.player2Code;
      // console.log(this.playerTitle);
      // //code = this.import + code;
      // //code = this.player2Code + 'print(solution(' + JSON.stringify(expectedInputs[0].subInput1) + '))';
      // //code += 'print(solution("aaabb"))';
      // console.log(code);
      // this.api.submitCode(code, this.language).subscribe((data) => {
      
      //   this.checkSubmission(data.token, isGptResponse, this.expectedOutput, 'aaabb');
      // });
    
  }
  }

  reduceHeartCount() {
    if (this.playerTitle === 'p1') {
      this.player1HeartCount[this.numAttempts] = 0;
      this.player1HeartCount = [...this.player1HeartCount];
      console.log(this.player1HeartCount);
    } else {
      this.player2HeartCount[this.numAttempts] = 0;
      this.player2HeartCount = [...this.player2HeartCount];
      console.log(this.player2HeartCount);
    }
    if (this.numAttempts < this.HEART_COUNT) {
      this.numAttempts += 1;
    } else {
      console.log('Game Over');
      clearInterval(this.timeInterval);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('Please sign in');
        this.router.navigate(['/']);
        return;
      }
      this.api.roomGameOver(parseInt(this.currentRoom), token, this.playerTitle === 'p1' ? 'p1' : 'p2' ).subscribe((data) => {
        console.log(data);
        this.router.navigate(['/']);
        this.socket.emit('game over', {roomId: this.currentRoom, token: token});
      });
    }
  }

  checkSubmission(submissionToken: string, isGptResponse: boolean, expectedOutput: string, input: string) {
    
    this.api.getSubmission(submissionToken).subscribe((data) => {
      console.log(data);
      if (data.stderr) {
        const error = atob(data.stderr);
        this.showError(`Error: ${error}`);
      }
      if (data.status.id === 3) {
        const output = atob(data.stdout);
        if (output === expectedOutput+'\n') {
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
          this.reduceHeartCount();
          this.showResult(
            `Input: ${input}\n
            Output: ${output}`,
            'Incorrect answer!',
            this.numAttempts,
          );
        }
      } else if (data.status.id === 1 || data.status.id === 2) {
        setTimeout(() => {
          this.checkSubmission(submissionToken, isGptResponse, expectedOutput, input);
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
    if(this.isPve) {
      this.api.getRandomPveProblem().subscribe((data) => {
        console.log(data.title);
        this.problemTitle = data.title;
        this.problemSlug = data.slug;
        this.problemText = data.description + '<p>\ninput1: ' + data.input1.subInput1 + '</p><p>\ninput2: ' + data.input2.subInput1 + '</p>\ninput3: ' + data.input3.subInput1;
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
      this.api.getProblem(this.titleSlug).subscribe((response) => {
        this.problemData = response.data.question;
        console.log(this.problemData);
        this.submissionData.questionId = response.data.question.questionId;
        console.log(this.problemData.title);
        this.problemTitle = this.formatString(this.titleSlug);
        this.problemSlug = response.slug;
        console.log(this.problemSlug);
        console.log(JSON.stringify(response));
        this.problemText = response.data.question.content;
        if (this.submissionData.gameType === 'leetcode') {
          this.api.getProblemStartCode(this.titleSlug).subscribe((data) => {
            this.problemInitialCode = data;
            console.log(data);
            if (this.playerTitle === 'p1') {
              this.player1Code += data[this.language];
            } else {
              this.player2Code += data[this.language];
            }
            console.log(this.player1Code);
          });
        }
      });
  }
}

formatString(input: string): string {
  // Step 1: Replace all dashes with spaces
  let formattedString = input.replace(/-/g, ' ');

  // Step 2: Split the string into words
  let words = formattedString.split(' ');

  // Step 3: Capitalize the first letter of each word
  words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  // Step 4: Join the words back into a single string
  formattedString = words.join(' ');

  // Step 5: Return the formatted string
  return formattedString;
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
        }, 500);
}

chooseLanguage(language: string) {
  
  
  const langListElement = document.querySelector('.lang-list.' + this.playerTitle);
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
      this.socket.emit('change language', {language: language, targetSocketId: this.opponentSocketId});
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

    if (language)
      this.player1Code = this.problemInitialCode[language] + '\n' //+ this.player1Code;
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

    if (language)
      this.player2Code = this.problemInitialCode[language] + '\n' //+ this.player2Code;
  }

}
}
