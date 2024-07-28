import { Router, response } from "express";
import axios from "axios";

export const leetcodeRouter = Router();

leetcodeRouter.get("/problems/:title", async (req, res) => {
  try {
    const query = `query questionContent($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                    content
                    topicTags {
                      name
                      id
                      slug
                    }
                    mysqlSchemas
                    dataSchemas
                    }
                }`;
    const variables = {
      titleSlug: req.params.title,
    };
    axios
      .get("https://leetcode.com/graphql/", {
        data: {
          query,
          variables,
        },
      })
      .then((response) => {
        return res.json(response.data);
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.get("/official-solution/:title", async (req, res) => {
  try {
    const query = `query officialSolution($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            solution {
                            id
                            title
                            content
                            contentTypeId
                            paidOnly
                            hasVideoSolution
                            paidOnlyVideo
                            canSeeDetail
                            }
                        }
                        }`;
    const variables = {
      titleSlug: req.params.title,
    };
    axios
      .get("https://leetcode.com/graphql/", {
        data: {
          query,
          variables,
        },
      })
      .then((response) => {
        try {
          const uuid = response.data.data.question.solution.content
            .split("https://leetcode.com/playground/")[1]
            .split("/")[0];
          console.log(uuid);
          const getCodeQuery = `query fetchPlayground {
                                        allPlaygroundCodes(uuid: "${uuid}") {
                                            code
                                            langSlug
                                        }
                                        }`;
          axios
            .get("https://leetcode.com/graphql/", {
              data: {
                query: getCodeQuery,
              },
            })
            .then((response) => {
              const codes = response.data.data.allPlaygroundCodes;
              codes.map((element) => {
                const code = element.code;

                console.log(element);
              });
              return res.json(response.data);
            });
        } catch (error) {
          return res.json({ error: error.message });
        }
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.get("/has-official-solution/:title", async (req, res) => {
  try {
    const query = `query hasOfficialSolution($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            solution {
                                id
                            }
                        }
                    }`;
    const variables = {
      titleSlug: req.params.title,
    };
    axios
      .get("https://leetcode.com/graphql/", {
        data: {
          query,
          variables,
        },
      })
      .then((response) => {
        return res.json(response.data);
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.get("/question-set", async (req, res) => {
  try {
    const query = `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                        problemsetQuestionList: questionList(
                            categorySlug: $categorySlug
                            limit: $limit
                            skip: $skip
                            filters: $filters
                        ) {
                            total: totalNum
                            questions: data {
                            acRate
                            difficulty
                            freqBar
                            frontendQuestionId: questionFrontendId
                            isFavor
                            paidOnly: isPaidOnly
                            status
                            title
                            titleSlug
                            topicTags {
                                name
                                id
                                slug
                            }
                            hasSolution
                            hasVideoSolution
                            }
                        }
                        }`;
    const variables = {
      categorySlug: "Algorithms", //all-code-essentials
      skip: 0,
      limit: 3,
      filters: {},
    };
    axios
      .get("https://leetcode.com/graphql/", {
        data: {
          query,
          variables,
        },
      })
      .then((response) => {
        return res.json(response.data);
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.get("/startcode/:title", async (req, res) => {
  try {
    const query = `query questionEditorData($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                        codeSnippets {
                            lang
                            langSlug
                            code
                        }
                        }
                    }`;
    const variables = {
      titleSlug: req.params.title,
    };
    axios
      .get("https://leetcode.com/graphql/", {
        data: {
          query,
          variables,
        },
      })
      .then((response) => {
        var data = {};
        response.data.data.question.codeSnippets.map((language) => {
          data[language.lang] = language.code;
        });
        return res.json(data);
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.get("/random-problem", (req, res) => {
  try {
    const query = `query randomQuestion($categorySlug: String, $filters: QuestionListFilterInput) {
                        randomQuestion(categorySlug: $categorySlug, filters: $filters) {
                            titleSlug
                        }
                    }`;
    const variables = {
      categorySlug: "Algorithms",
      filters: {},
    };
    axios
      .get("https://leetcode.com/graphql/", {
        data: {
          query,
          variables,
        },
      })
      .then(async (response) => {
        const exampleTestcaseList = await axios.get(
          "https://leetcode.com/graphql/",
          {
            data: {
              query: `query consolePanelConfig($titleSlug: String!) {
                                            question(titleSlug: $titleSlug) {
                                                questionId
                                                questionTitle
                                                enableRunCode
                                                enableSubmit
                                                exampleTestcaseList
                                            }
                                        }`,
              variables: {
                titleSlug: response.data.data.randomQuestion.titleSlug,
              },
            },
          },
        );
        const problemContent = await axios.get(
          "https://leetcode.com/graphql/",
          {
            data: {
              query: `query questionContent($titleSlug: String!) {
                                                question(titleSlug: $titleSlug) {
                                                    content
                                                    topicTags {
                                                      name
                                                      slug
                                                    }
                                                }
                                            }`,
              variables: {
                titleSlug: response.data.data.randomQuestion.titleSlug,
              },
            },
          },
        );
        var data = {
          question: {
            titleSlug: response.data.data.randomQuestion.titleSlug,
            title: exampleTestcaseList.data.data.question.questionTitle,
            exampleTestcaseList:
              exampleTestcaseList.data.data.question.exampleTestcaseList,
            content: problemContent.data.data.question.content,
            topicTags: problemContent.data.data.question.topicTags,
          },
        };
        return res.json(data);
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.get("/problems", async (req, res) => {
  try {
    axios
      .get("https://leetcode.com/graphql/", {
        query: `query questionContent($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                    content
                    mysqlSchemas
                    dataSchemas
                    }
                }`,
        variables: {
          titleSlug: req.query.titleSlug,
        },
      })
      .then((response) => {
        return res.json(response.data);
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.get("/problems/submit/:titleSlug", async (req, res) => {

  const titleSlug = req.params.titleSlug;
  
  body = "{\"lang\":\"python\",\"question_id\":\"12\",\"typed_code\":\"class Solution(object):\\n    def intToRoman(self, num):\\n        \\\"\\\"\\\"\\n        :type num: int\\n        :rtype: str\\n        \\\"\\\"\\\"\\n        \"}"
  csrftoken = "0UZryTfxOwRw8fBA9GPYwGanz7NDJy5plkyKAbMVR72ZPM7IGIuVMCxOlH5SapsY"
  const LEETCODE_SESSION = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiNTM3NTM4MyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjkwYzE2OThhZjdlNDViNTZlNjcxOTZhY2M4ZjJjYzMwNmU0NDUxNzFlMDUwODFmMjllNzBiN2NhYmJlODcwMGYiLCJpZCI6NTM3NTM4MywiZW1haWwiOiJzb212ZWx5YTk5QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiU3ZlbDk5IiwidXNlcl9zbHVnIjoiU3ZlbDk5IiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2F2YXRhcnMvYXZhdGFyXzE2Mzg5MDI4MTYucG5nIiwicmVmcmVzaGVkX2F0IjoxNzIyMDYyMzg0LCJpcCI6Ijc2LjY5LjExNS4xNTgiLCJpZGVudGl0eSI6IjEwZjkyODdkZWFmNjA5ZWUzNmZiMzc3ODNmMmI4OWMwIiwic2Vzc2lvbl9pZCI6NjcyMTU5OTUsImRldmljZV93aXRoX2lwIjpbImUwYTdhNWNjYzRhOWZhYTAzMTM1Zjk4ZjBlNjY2OGVjIiwiNzYuNjkuMTE1LjE1OCJdfQ.kADfuCnVECyXHY0uW2VxIwLBDYzaE4bx1JYzuy3sSZQ; Domain=.leetcode.com; expires=Sat, 10 Aug 2024 20:10:06 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax; Secure"

  // const body = req.body.body;
  // const csrftoken = req.body.csrftoken;
  // const leetcode_session = req.body.leetcode_session;

  try {
   fetch(`https://leetcode.com/problems/${titleSlug}/submit/`, {
    "headers": {
        "x-csrftoken": csrftoken,
        "cookie": `csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION}`,
        "Referer": `https://leetcode.com/problems/${titleSlug}/`,
    },
    "body": JSON.stringify(body),
    "method": "POST"
    }).then((response) => {
        console.log(response.status)
        if (response.status !== 200) {
            return res.status(400).json({ error: "Leetcode submission failed" })
        }
        return response.json();
    })
    // axios
    //   .get(`https://leetcode.com/problems/${titleSlug}/submit/`, {
    //     query: `query questionContent($titleSlug: String!) {
    //                 question(titleSlug: $titleSlug) {
    //                 content
    //                 mysqlSchemas
    //                 dataSchemas
    //                 }
    //             }`,
    //     variables: {
    //       titleSlug: req.query.titleSlug,
    //     },
    //   })
    //   .then((response) => {
    //     return res.json(response.data);
    //   });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeRouter.post("/checkCookie", async (req, res) => {
  try {
    const cookie = req.body.cookie;
    const csrftoken = req.body.cookie.split("csrftoken=")[1].split(";")[0];

    const data = JSON.stringify({
      lang: "python",
      question_id: "12",
      typed_code: "class Solution(object):\n    def myAtoi(self, s):\n        \"\"\"\n        :type s: str\n        :rtype: int\n        \"\"\"\n        ",
      data_input: "\"42\"\n\"   -042\"\n\"1337c0d3\"\n\"0-1\"\n\"words and 987\""
    });

    const config = {
      method: 'post',
      url: 'https://leetcode.com/problems/string-to-integer-atoi/interpret_solution/',
      headers: {
        'x-csrftoken': csrftoken,
        'cookie': cookie,
        'Referer': 'https://leetcode.com/problems/string-to-integer-atoi/description/',
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
    .then(function (response) {
      return res.json(response.data);
    })
    .catch(function (error) {
    return res.status(400).json({ error: "Leetcode cookie is not valid: " + error.message });
    });
  }catch (error) {
    return res.status(400).json({ error: "Leetcode cookie is not valid: " + error.message });
  }
});