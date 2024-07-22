import { Router, response } from 'express';
import axios from 'axios';

export const leetcodeRouter = Router();

leetcodeRouter.get('/problems/:title', async (req, res) => {
    try {
        const query = `query questionContent($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                    content
                    mysqlSchemas
                    dataSchemas
                    }
                }`;
        const variables = {
                titleSlug: req.params.title,
            };
        axios.get('https://leetcode.com/graphql/', {
                data: {
                    query,
                    variables,
                }
            },
        ).then((response) => {
            return res.json(response.data);
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

leetcodeRouter.get('/official-solution/:title', async (req, res) => {
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
        axios.get('https://leetcode.com/graphql/', {
                data: {
                    query,
                    variables,
                }
            },
        ).then((response) => {
            try {
                const uuid = response.data.data.question.solution.content.split('https://leetcode.com/playground/')[1].split('/')[0];
                console.log(uuid)
                const getCodeQuery = `query fetchPlayground {
                                        allPlaygroundCodes(uuid: "${uuid}") {
                                            code
                                            langSlug
                                        }
                                        }`
                axios.get('https://leetcode.com/graphql/', {
                        data: {
                            query: getCodeQuery,
                        }
                    },
                ).then((response) => {
                    const codes = response.data.data.allPlaygroundCodes;
                    codes.map(element => {
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

leetcodeRouter.get('/has-official-solution/:title', async (req, res) => {
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
        axios.get('https://leetcode.com/graphql/', {
                data: {
                    query,
                    variables,
                }
            },
        ).then((response) => {
            return res.json(response.data);
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

leetcodeRouter.get('/question-set', async (req, res) => {
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
                    "categorySlug": "Algorithms", //all-code-essentials
                    "skip": 0,
                    "limit": 3,
                    "filters": {}
                };
        axios.get('https://leetcode.com/graphql/', {
                data: {
                    query,
                    variables,
                }
            },
        ).then((response) => {
            return res.json(response.data);
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

leetcodeRouter.get('/random-problem', (req, res) => {
    try {
        const query = `query randomQuestion($categorySlug: String, $filters: QuestionListFilterInput) {
                        randomQuestion(categorySlug: $categorySlug, filters: $filters) {
                            titleSlug
                        }
                    }`;
        const variables = {
                "categorySlug": "all-code-essentials",
                "filters": {}
            };
        axios.get('https://leetcode.com/graphql/', {
                data: {
                    query,
                    variables,
                }
            },
        ).then( async response => {
            const exampleTestcaseList = await axios.get('https://leetcode.com/graphql/', {
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
                        variables: { "titleSlug": response.data.data.randomQuestion.titleSlug }
                    }
                })
            const problemContent = await axios.get('https://leetcode.com/graphql/', {
                    data: {
                        query: `query questionContent($titleSlug: String!) {
                                                question(titleSlug: $titleSlug) {
                                                    content
                                                }
                                            }`,
                        variables: { "titleSlug": response.data.data.randomQuestion.titleSlug }
                    }
                })
            var data = {
                question: {
                    titleSlug: response.data.data.randomQuestion.titleSlug,
                    title: exampleTestcaseList.data.data.question.questionTitle,
                    exampleTestcaseList: exampleTestcaseList.data.data.question.exampleTestcaseList,
                    content: problemContent.data.data.question.content
                }
            }
            return res.json(data);
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

leetcodeRouter.get('/problems', async (req, res) => {
    try {
        axios.get('https://leetcode.com/graphql/', {
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