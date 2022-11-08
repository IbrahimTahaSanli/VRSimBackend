const Nhttp = require("./Nhttp");

const tokenlogin = require("./routes/login/tokenlogin");
const login = require("./routes/login/login");
const relogin = require("./routes/login/relogin");

const verifyUserName = require("./routes/register/verifyusername");
const verifyEmail = require("./routes/register/verifyemail");
const register = require("./routes/register/register");

const postTest = require("./routes/test/PostTest");
const getTest = require("./routes/test/GetTest");

const index = require("./routes/index");
const getTestByID = require("./routes/test/GetTestByID");
const GetTestTakeByID = require("./routes/test/GetTestTakeByID");

const postAnswer = require("./routes/answer/PostAnswer");
const getAnswerFinalize = require("./routes/answer/GetAnswerFinalize");

const getQuest = require("./routes/quest/GetQuest");
const getQuestByID = require("./routes/quest/GetQuestByID");
const getQuestFinalize = require("./routes/quest/GetQuestFinalize");
const getQuestTakeByID = require("./routes/quest/GetQuestTakeByID");
const postQuest = require("./routes/quest/PostQuest");

let route = [
    verifyUserName,
    verifyEmail,
    register,

    tokenlogin,
    login,
    relogin,

    GetTestTakeByID,
    getTestByID,
    postTest,
    getTest,

    postAnswer,
    getAnswerFinalize,

    getQuest,
    getQuestByID,
    getQuestFinalize,
    getQuestTakeByID,
    postQuest,

    index
];

const SERVERTIMEOUT = 5000;
const SERVERPORT = 303;

new Nhttp(route, SERVERPORT, SERVERTIMEOUT, opts=
    {
        DomainName:"localhost", 
        PreSetHeaders:
        {
            "Access-Control-Allow-Origin": "http://localhost:303",
            'Access-Control-Allow-Credentials': "true",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
        }
    }).startServer();