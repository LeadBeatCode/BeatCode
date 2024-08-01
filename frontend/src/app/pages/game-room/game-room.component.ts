import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/apiService/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { GameService } from '../../services/gameService/game.service';
import { GptService } from '../../services/gptService/gpt.service';
import moment from 'moment';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrl: './game-room.component.css',
})
export class GameRoomComponent implements OnInit {
  title = 'frontend';
  editorOptions = { theme: 'vs-dark', language: 'python' };
  opponentEditorOptions = { theme: 'hc-black', language: 'python' };
  player1Code: string = '';
  player2Code: string = '';
  expectedOutput: string = '4\n';
  result: string = '';
  stdout: string = '';
  stderr: string = '';
  showEditor: boolean = true;
  playerTitle: string = '';
  currentRoom: string = '';
  language: string = 'Python3';
  import: string = 'from typing import List\n';
  numAttempts: number = 0;
  opponentNumAttempts: number = 0;
  time: number = 0;
  displayTime: string = '';
  timeInterval: any;
  socketId: string = '';
  opponentSocketId: string = '';
  problemData: any = {};
  problemInitialCode: any = {};
  problemSlug: string = '';
  problemTitle: string = '';
  problemText: string = '';
  HEART_COUNT: number = 5;
  player1HeartCount: number[] = [];
  player2HeartCount: number[] = [];
  isPve: boolean = false;
  gptResponse: string = '';
  pveProblemId: number = 1;
  opponentLanguage: string = 'Python3';
  editor: any;
  timeElapsed: string = '00:00:00';
  dateStart: any = moment();
  titleSlug: string = '';
  submissionData: any = { gameType: '', id: '', titleSlug: '', questionId: '' };
  submissionDetails: any = {
    expected_output: '',
    total_testcases: '',
    correct_testcases: '',
    last_testcase: '',
    result: '',
  };
  showGameSummaryValue: boolean = false;
  timeElapsedInterval: any = 0;
  userImg1: string = '';
  userImg2: string = '';
  username1: string = '';
  username2: string = '';
  user1bp: number = 0;
  user2bp: number = 0;
  userId1: string = '';
  userId2: string = '';
  winner: string = '';
  runtimeerr_num: number = 0;

  rankImage: any = {
    Silver: '../../../assets/rank1.png',
    Emerald: '../../../assets/rank2.png',
    Diamond: '../../../assets/rank3.png',
    Ruby: '../../../assets/rank4.png',
    Master: '../../../assets/rank5.png',
  };

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private socket: Socket,
    private game: GameService,
    private router: Router,
    private gptService: GptService,
    private gameService: GameService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.playerTitle = navigation.extras.state['playerTitle'];
    }
    this.activatedRoute.queryParams.subscribe((params) => {
      const roomId = params['roomId'];
      const accessToken = localStorage.getItem('accessToken');
      this.currentRoom = roomId;
      if (accessToken) {
        this.api.getRoom(roomId, accessToken).subscribe({
          next: (data) => {
            this.timeElapsed = data.timeElapsed;
            if (data.status === 'gameover') {
              this.showGameSummary();
            } else {
              this.timeElapsedInterval = setInterval(() => {
                this.timeElapsed = moment(this.timeElapsed, 'HH:mm:ss')
                  .add(1, 'second')
                  .format('HH:mm:ss');
                if (this.timeElapsed !== 'Invalid date') {
                  this.api
                    .updateRoomTimeElapsed(
                      parseInt(this.currentRoom),
                      accessToken,
                      this.timeElapsed,
                    )
                    .subscribe((data) => {});
                }
              }, 1000);
            }
            this.userImg1 = data.userImg1;
            this.userImg2 = data.userImg2;
            this.username1 = data.user1Nickname;
            this.username2 = data.user2Nickname;
            this.user1bp = data.user1bp;
            this.user2bp = data.user2bp;
            this.userId1 = data.userId1;
            this.userId2 = data.userId2;
            this.submissionData.gameType = data.gameType;
            this.submissionData.titleSlug = data.questionTitleSlug;
            this.submissionData.id =
              data.playerTitle === 'p1' ? data.userId1 : data.userId2;
            this.HEART_COUNT =
              data.playerTitle === 'p1'
                ? this.HEART_COUNT - data.user1Attempts
                : this.HEART_COUNT - data.user2Attempts;
            if (data.playerTitle === 'p1') {
              this.numAttempts = data.user1Attempts;
            } else {
              this.numAttempts = data.user2Attempts;
            }
            this.player1HeartCount = Array(
              this.HEART_COUNT - data.user1Attempts,
            ).fill(1);
            this.player2HeartCount = Array(
              this.HEART_COUNT - data.user2Attempts,
            ).fill(1);
            this.isPve = data.isPve;
            this.titleSlug = data.questionTitleSlug;

            if (!this.isPve) {
              this.api.getRoomSocketIds(this.currentRoom).subscribe((data) => {
                var socketOpponentUpdated = false;
                this.socket.on(
                  'opponent_reconnected',
                  (
                    title: string,
                    socketId: string,
                    roomId: string,
                    toSocketId: string,
                  ) => {
                    if (this.playerTitle !== title) {
                      this.opponentSocketId = socketId;
                    }
                  },
                );
                if (this.playerTitle === 'p1') {
                  if (data.socketId1 === '') {
                    this.socket.emit(
                      'reconnected',
                      this.userId1,
                      localStorage.getItem('accessToken'),
                    );

                    this.socket.on(
                      'reconnected',
                      (userId: string, socketId: string) => {
                        this.api
                          .setUserSocketId(accessToken, socketId, this.userId1)
                          .subscribe({
                            next: (data) => {
                            },
                            error: (err) => {
                            },
                          });
                        this.api
                          .getRoomSocketIds(this.currentRoom)
                          .subscribe((data) => {
                            this.opponentSocketId = data.socketId2;
                            this.socket.emit(
                              'opponent_reconnected',
                              this.currentRoom,
                              this.playerTitle,
                              socketId,
                              this.opponentSocketId,
                              accessToken,
                            );
                            socketOpponentUpdated = true;
                          });
                      },
                    );
                  } else {
                    this.opponentSocketId = data.socketId2;
                  }
                } else {
                  if (data.socketId2 === '') {
                    this.socket.emit(
                      'reconnected',
                      this.userId2,
                      localStorage.getItem('accessToken'),
                    );

                    this.socket.on(
                      'reconnected',
                      (userId: string, socketId: string) => {
                        this.api
                          .setUserSocketId(accessToken, socketId, this.userId2)
                          .subscribe({
                            next: (data) => {
                            },
                            error: (err) => {
                            },
                          });
                        this.api
                          .getRoomSocketIds(this.currentRoom)
                          .subscribe((data) => {
                            this.opponentSocketId = data.socketId1;
                            this.socket.emit(
                              'opponent_reconnected',
                              this.currentRoom,
                              this.playerTitle,
                              socketId,
                              this.opponentSocketId,
                              accessToken,
                            );
                            socketOpponentUpdated = true;
                          });
                      },
                    );
                  } else {
                    this.opponentSocketId = data.socketId1;
                  }
                }
              });
            }
            this.getProblem();
          },
          error: (err) => {
            if (err.status === 401) {
              this.router.navigate(['/']);
            } else if (err.status === 403) {
              this.router.navigate(['/']);
            }
          },
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {

    this.socket.on("reduce", (roomId: string) => {
      if (this.playerTitle === 'p1') {
        this.player2HeartCount[this.opponentNumAttempts] = 0;
        this.player2HeartCount = [...this.player2HeartCount];
      } else {
        this.player1HeartCount[this.opponentNumAttempts] = 0;
        this.player1HeartCount = [...this.player1HeartCount];
      }
      this.opponentNumAttempts += 1;
    });

    this.socket.on('game terminated by opponent', () => {
      
      this.showGameSummary();
    });

    this.dateStart = moment();

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

  getUserSocket() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
    this.gameService.getUserSocket(token).subscribe({
      next: (data) => {
        localStorage.removeItem('accessToken');
        this.gameService.getUserSocket('need to do it').subscribe((result) => {
        });
      },
      error: (err) => {
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
    this.submissionDetails.codeOutput = 'Output : ' + check_data.codeOutput;
    this.submissionDetails.lastTestcase =
      'Test case : ' + check_data.lastTestcase; // check_data.lastTestcase != "" ? JSON.parse(check_data.lastTestcase) : "";
    this.submissionDetails.totalCorrect = check_data.totalCorrect;
    this.submissionDetails.totalTestcases = ' / ' + check_data.totalTestcases;
    this.submissionDetails.expectedOutput =
      'Expected : ' + check_data.expectedOutput; // check_data.expectedOutput != "" ? JSON.parse(check_data.expectedOutput) : "";
  };

  showGameSummary = () => {
    clearInterval(this.timeElapsedInterval);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
    this.api.getRoom(parseInt(this.currentRoom), token).subscribe({
      next: (data) => {
        if (data.winner === 'p1') {
          this.winner = this.username1;
          this.user1bp += 50;
          this.user2bp = Math.max(0, this.user2bp - 50);
        } else {
          this.winner = this.username2;
          this.user1bp = Math.max(0, this.user1bp - 50);
          this.user2bp += 50;
        }
        this.showGameSummaryValue = true;
      },
      error: (err) => {
      },
    });
  };

  gameOver = () => {
    this.showGameSummary();
  };

  checkCorrectness = (totalCorrect: number, totalTestcases: number) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.api
        .updateGameResult(
          parseInt(this.currentRoom),
          this.submissionDetails.totalCorrect,
          this.numAttempts,
          token,
        )
        .subscribe((data) => {
        });
    }
    if (totalCorrect === totalTestcases) {
      clearInterval(this.timeInterval);
      clearInterval(this.timeElapsedInterval);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        this.router.navigate(['/']);
        return;
      }
      this.api
        .roomGameOver(
          parseInt(this.currentRoom),
          token,
          this.playerTitle === 'p1' ? 'p1' : 'p2',
        )
        .subscribe((data) => {
          this.socket.emit('game over', {
            roomId: this.currentRoom,
            token: token,
            playerTitle: this.playerTitle,
          });
          this.showGameSummary();
        });
    }
  };

  runCode(isGptResponse: boolean) {
    this.clearResult();
    this.submissionDetails = {};
    this.api
      .runCode(
        this.submissionData.gameType,
        this.submissionData.id,
        this.submissionData.titleSlug,
        this.submissionData.questionId,
        this.language,
        this.playerTitle === 'p1' ? this.player1Code : this.player2Code,
      )
      .subscribe((data) => {
        if (this.submissionData.gameType === 'leetcode') {
          var submission_status = 16;
          this.runtimeerr_num = 0;
          const submitInterval = setInterval(() => {
            this.api
              .checkSubmission(
                this.submissionData.gameType,
                this.submissionData.id,
                data.submission_id,
              )
              .subscribe((res) => {
                const check_data = res.data.submissionDetails;
                this.runtimeerr_num += 1;
                if (this.runtimeerr_num > 10) {
                  this.showError('Timeout Error; Try different language.');
                  clearInterval(submitInterval);
                }
                if (check_data.totalTestcases) {
                  clearInterval(submitInterval);
                  submission_status = check_data.statusCode;
                  this.updateSubmissionDetails(check_data);
                  if (
                    (this.submissionDetails.runtimeError &&
                      this.submissionDetails.runtimeError != '') ||
                    (this.submissionDetails.compileError &&
                      this.submissionDetails.compileError != '')
                  ) {
                    this.showError(
                      this.submissionDetails.runtimeError
                        ? this.submissionDetails.runtimeError
                        : this.submissionDetails.compileError,
                    );
                  } else {
                    this.checkCorrectness(
                      this.submissionDetails.totalCorrect,
                      this.submissionDetails.totalTestcases,
                    );
                    if (!this.submissionDetails.codeOutput) {
                      this.showError('No output was printed');
                    } else {
                      this.submissionDetails.runtimeError =
                        check_data.runtimeError;
                      this.showResult(
                        this.submissionDetails.codeOutput,
                        '',
                        this.submissionDetails.expectedOutput,
                      );
                    }
                  }
                  const token = localStorage.getItem('accessToken');
                  if (token) {
                    this.api
                      .updateGameResult(
                        parseInt(this.currentRoom),
                        this.submissionDetails.totalCorrect,
                        this.numAttempts,
                        token,
                      )
                      .subscribe((data) => {
                      });
                  }
                  this.reduceHeartCount();
                }
              });
          }, 2000);
        }
      });
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
            var code = this.player1Code;
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
      });
    }
  }

  getWinner = (
    user1Attempts: number,
    user2Attempts: number,
    user1Result: number,
    user2Result: number,
  ) => {
    var winner = 2;
    if (user1Result > user2Result) {
      winner = 1;
    } else if (user1Result === user2Result && user1Attempts < user2Attempts) {
      winner = 1;
    }

    this.winner = winner === 1 ? this.username1 : this.username2;
    return winner;
  };

  reduceHeartCount() {
    if (this.playerTitle === 'p1') {
      this.player1HeartCount[this.numAttempts] = 0;
      this.player1HeartCount = [...this.player1HeartCount];
    } else {
      this.player2HeartCount[this.numAttempts] = 0;
      this.player2HeartCount = [...this.player2HeartCount];
    }
    if (this.numAttempts < this.HEART_COUNT - 1) {
      this.numAttempts += 1;
      this.socket.emit('reduce', {roomId: this.currentRoom, playerTo: this.opponentSocketId});
    } else {
      clearInterval(this.timeInterval);
      clearInterval(this.timeElapsedInterval);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Not sign in
        this.router.navigate(['/']);
        return;
      }
      this.api.getRoom(parseInt(this.currentRoom), token).subscribe({
        next: (room_data) => {
          const winner = this.getWinner(
            room_data.user1Attempts,
            room_data.user2Attempts,
            room_data.user1Result,
            room_data.user2Result,
          );
          this.api
            .roomGameOver(
              parseInt(this.currentRoom),
              token,
              winner === 1  ? 'p1' : 'p2',
            )
            .subscribe((data) => {
              this.socket.emit('game over', {
                roomId: this.currentRoom,
                token: token,
                playerTitle: this.playerTitle,
              });
              this.showGameSummary();
            });
        },
        error: (err) => {
        },
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

  showResult(stdout: string, result: string, expected_output: any) {
    this.stderr = '';
    this.stdout = stdout;
    this.result = result;
  }

  showError(stderr: string) {
    this.stderr = stderr;
    this.stdout = '';
    this.result = '';
  }

  getProblem() {
    if (this.isPve) {
      this.api.getRandomPveProblem().subscribe((data) => {
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
        this.gptService
          .getResponse(
            data.description +
              'write the solution in python 3 and a method called solution. Do not include anything other than the method itself',
          )
          .then((response) => {
            this.gptResponse += response;
            if (response) {
              this.displayResponseLineByLine(response);
            }
          });
      });
    } else {
      this.api.getProblem(this.titleSlug).subscribe((response) => {
        this.problemData = response.data.question;
        this.submissionData.questionId = response.data.question.questionId;
        this.problemTitle = this.formatString(this.titleSlug);
        this.problemText = response.data.question.content;
        if (this.submissionData.gameType === 'leetcode') {
          this.api.getProblemStartCode(this.titleSlug).subscribe((data) => {
            this.problemInitialCode = data;
            if (this.playerTitle === 'p1') {
              this.player1Code += data[this.language];
            } else {
              this.player2Code += data[this.language];
            }
          });
        } else {
          this.problemInitialCode = {
            Python3:
              '# Welcome to BeatCode!\n# Write a function called "Solution" that returns the output. \n',
            Python:
              '# Welcome to BeatCode!\n# Write a function called "Solution" that returns the output. \n',
            C: '// Welcome to BeatCode!\n// Write a function called "Solution" that returns the output. \n',
            'C++':
              '// Welcome to BeatCode!\n// Write a function called "Solution" that returns the output. \n',
            Java: '// Welcome to BeatCode!\n// Write a function called "Solution" that returns the output. \n',
          };
          if (this.playerTitle === 'p1') {
            this.player1Code = this.problemInitialCode[this.language];
          } else {
            this.player2Code = this.problemInitialCode[this.language];
          }
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
    words = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );

    // Step 4: Join the words back into a single string
    formattedString = words.join(' ');

    // Step 5: Return the formatted string
    return formattedString;
  }

  displayResponseLineByLine(response: string) {
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
    const langListElement = document.querySelector(
      '.lang-list.' + this.playerTitle,
    );
    if (langListElement) {
      langListElement.classList.toggle('hidden');
    }
    if (language !== 'choose') {
      this.language = language;
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
      if (language && language !== 'choose') {
        this.player1Code = this.problemInitialCode[language] + '\n';
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

      if (language && language !== 'choose') {
        this.player2Code = this.problemInitialCode[language] + '\n';
      }
    }
  }

  changeOpponentLanguage = () => {
    if (this.playerTitle === 'p2') {
      if (
        this.opponentLanguage === 'Python3' ||
        this.opponentLanguage === 'Python'
      ) {
        this.editorOptions = { theme: 'hc-black', language: 'python' };
      } else if (this.opponentLanguage === 'C') {
        this.editorOptions = { theme: 'hc-black', language: 'c' };
      } else if (this.opponentLanguage === 'C++') {
        this.editorOptions = { theme: 'hc-black', language: 'cpp' };
      } else if (this.opponentLanguage === 'Java') {
        this.editorOptions = { theme: 'hc-black', language: 'java' };
      }
    } else {
      if (
        this.opponentLanguage === 'Python3' ||
        this.opponentLanguage === 'Python'
      ) {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'python' };
      } else if (this.opponentLanguage === 'C') {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'c' };
      } else if (this.opponentLanguage === 'C++') {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'cpp' };
      } else if (this.opponentLanguage === 'Java') {
        this.opponentEditorOptions = { theme: 'hc-black', language: 'java' };
      }
    }
  };

  getRank(rank: number): string {
    if (rank < 200) {
      return 'rank1';
    } else if (rank < 400) {
      return 'rank2';
    } else if (rank < 600) {
      return 'rank3';
    } else if (rank < 800) {
      return 'rank4';
    }
    return 'rank5';
  }
}
