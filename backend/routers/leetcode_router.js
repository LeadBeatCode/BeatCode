import { Router, response } from "express";
import axios from "axios";
import { User } from "../models/user.js";

export const leetcodeRouter = Router();

leetcodeRouter.get("/problems/:title", async (req, res) => {
  try {
    const query = `query questionContent($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                    content
                    title
                    isPaidOnly
                    difficulty
                    questionId
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
                            isPaidOnly
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
        if (response.data.data.question.codeSnippets)
          response.data.data.question.codeSnippets.map((language) => {
            data[language.lang] = language.code;
          });
        else
          return res
            .status(400)
            .json({
              error:
                "Premium Question: This question is only available for premium users",
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
                                                isPaidOnly
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
            isPaidOnly: exampleTestcaseList.data.data.question.isPaidOnly,
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

leetcodeRouter.post("/submission/check", async (req, res) => {
  const submissionId = req.body.submissionId;
  const user = await User.findByPk(req.body.id, { raw: true });
  if (!user) return res.status(404).json({ error: "User not found" });
  const cookie = user.leetcodeCookie;
  const csrftoken = cookie.split("csrftoken=")[1].split(";")[0];
  const data = {};
  const LEETCODE_SESSION = user.leetcodeCookie
    .split("LEETCODE_SESSION=")[1]
    .split(";")[0];
  console.log(LEETCODE_SESSION);
  const query = `
    query submissionDetails($submissionId: Int!) {
        submissionDetails(submissionId: $submissionId) {
            runtime
            runtimeDisplay
            runtimePercentile
            runtimeDistribution
            memory
            memoryDisplay
            memoryPercentile
            memoryDistribution
            code
            timestamp
            statusCode
            user {
                username
                profile {
                    realName
                    userAvatar
                }
            }
            lang {
                name
                verboseName
            }
            question {
                questionId
                titleSlug
                hasFrontendPreview
            }
            notes
            flagType
            topicTags {
                tagId
                slug
                name
            }
            runtimeError
            compileError
            lastTestcase
            codeOutput
            expectedOutput
            totalCorrect
            totalTestcases
            fullCodeOutput
            testDescriptions
            testBodies
            testInfo
            stdOutput
        }
    }
`;

  const variables = {
    submissionId: submissionId,
  };

  axios
    .post(
      "https://leetcode.com/graphql/",
      {
        query: `
            query submissionDetails($submissionId: Int!) {
                submissionDetails(submissionId: $submissionId) {
                    runtime
                    runtimeDisplay
                    runtimePercentile
                    runtimeDistribution
                    memory
                    memoryDisplay
                    memoryPercentile
                    memoryDistribution
                    code
                    timestamp
                    statusCode
                    user {
                        username
                        profile {
                            realName
                            userAvatar
                        }
                    }
                    lang {
                        name
                        verboseName
                    }
                    question {
                        questionId
                        titleSlug
                        hasFrontendPreview
                    }
                    notes
                    flagType
                    topicTags {
                        tagId
                        slug
                        name
                    }
                    runtimeError
                    compileError
                    lastTestcase
                    codeOutput
                    expectedOutput
                    totalCorrect
                    totalTestcases
                    fullCodeOutput
                    testDescriptions
                    testBodies
                    testInfo
                    stdOutput
                }
            }
        `,
        variables: {
          submissionId: submissionId,
        },
        operationName: "submissionDetails",
      },
      {
        headers: {
          "x-csrftoken": csrftoken,
          cookie: cookie, //`csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION}`,
          // "Referer": `https://leetcode.com/problems/${titleSlug}/`,
        },
      },
    )
    .then(function (response) {
      return res.json(response.data);
    })
    .catch(function (error) {
      return res
        .status(400)
        .json({ error: "Leetcode cookie is not valid: " + error.message });
    });
});

leetcodeRouter.post("/problems/submit", async (req, res) => {
  const titleSlug = req.body.titleSlug;
  const questionId = req.body.questionId;

  try {
    console.log(req.body);
    const user = await User.findByPk(req.body.id, { raw: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    const cookie = user.leetcodeCookie;
    const csrftoken = cookie.split("csrftoken=")[1].split(";")[0];
    const data = {};
    const LEETCODE_SESSION = user.leetcodeCookie
      .split("LEETCODE_SESSION=")[1]
      .split(";")[0];
    console.log(LEETCODE_SESSION);

    console.log(req.body.language);
    const lang = {
      Python3: "python3",
      Python: "python",
      Java: "java",
      C: "c",
      "c++": "cpp",
    };

    await axios
      .post(
        `https://leetcode.com/problems/${titleSlug}/submit/`,
        {
          lang: lang[req.body.language],
          question_id: questionId,
          typed_code: req.body.code,
        },
        {
          headers: {
            "x-csrftoken": csrftoken,
            cookie: cookie, //`csrftoken=${csrftoken}; LEETCODE_SESSION=${LEETCODE_SESSION}`,
            Referer: `https://leetcode.com/problems/${titleSlug}/`,
          },
        },
      )
      .then(function (response) {
        return res.json(response.data);
      })
      .catch(function (error) {
        return res
          .status(400)
          .json({ error: "Leetcode cookie is not valid: " + error.message });
      });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Leetcode cookie is not valid: " + error.message });
  }
});

leetcodeRouter.post("/checkCookie", async (req, res) => {
  try {
    const cookie = req.body.cookie;
    const csrftoken = req.body.cookie.split("csrftoken=")[1].split(";")[0];

    const data = JSON.stringify({
      lang: "python",
      question_id: "12",
      typed_code:
        'class Solution(object):\n    def myAtoi(self, s):\n        """\n        :type s: str\n        :rtype: int\n        """\n        ',
      data_input: '"42"\n"   -042"\n"1337c0d3"\n"0-1"\n"words and 987"',
    });

    const config = {
      method: "post",
      url: "https://leetcode.com/problems/string-to-integer-atoi/interpret_solution/",
      headers: {
        "x-csrftoken": csrftoken,
        cookie: cookie,
        Referer:
          "https://leetcode.com/problems/string-to-integer-atoi/description/",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        return res.json(response.data);
      })
      .catch(function (error) {
        return res
          .status(400)
          .json({ error: "Leetcode cookie is not valid: " + error.message });
      });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Leetcode cookie is not valid: " + error.message });
  }
});
