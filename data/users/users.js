const fs = require('fs');
const ID = require("../../tools/id");
const Tests = require("../tests/tests");
const Quests = require("../quest/quest");

const avalibleUsers = JSON.parse(fs.readFileSync("./data/users/users.json"));

const emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


var Users = {
    AddUser: (user)=>{
        if(user.username === undefined || user.username === "" || user.username.length < 10 || user.username.length > 40)
            return false;
        if(user.password === undefined || user.password === "" || user.password.length < 10 || user.password.length > 24)
            return false;
        if(user.email === undefined || user.email === "" || !(emailReg.test(user.email)))
            return false;
        
        user.id = ID.createUserID();
        user.assignedtest = [];
        user.assignedquest = [];
        avalibleUsers.push(user);

        Users.SaveUsers();

        return true;
    },
    GetUserByID: (userID)=>{
        return avalibleUsers.find( elem => elem.id === userID);      
    },
    GetUserByUserName: (userName) => {
        return avalibleUsers.find( elem => elem.username === userName );
    },
    GetUserByUserEmail: (email) => {
        return avalibleUsers.find( elem => elem.email === email );
    },
    AddAssignedTest: (user, assigned) => {
        user.AssignedTest.push(assigned);

        Users.SaveUsers();
        return true;
    },
    AddAssignedQuest: (user, assigned) => {
        user.AssignedQuest.push(assigned);

        Users.SaveUsers();
        return true;
    },
    AnswerQuestion: (user, testID, questionID, answerIndex) => {
        test = user.AssignedTest.find(element =>element.TestID === testID);
        if(test === undefined)
            return -3;

        if(test.IsCompleted)
            return -4;
        
        question = test.Questions.find(elem=>elem.QuestionID === questionID);
        if(question === undefined)
            return -2;

        if(question.Answers.length > answerIndex && 0 <= answerIndex){
            question.ChosenAnswer = answerIndex;
            Users.SaveUsers();
            return 0;
        }
        return -1;
    },
    FinalizeTest: (user, testID) => {
        assignedTest = user.AssignedTest.find(element =>element.TestID === testID);
        if(assignedTest === undefined)
            return -2;

        test = Tests.GetTestByID(testID);
        if(test === undefined)
            return -1;

        assignedTest.Questions.forEach(element => {
            test.Questions.forEach(elem => {
                if(element.QuestionID === elem.QuestionID)
                    if(element.ChosenAnswer === elem.RightAnswer)
                        assignedTest.Score += 1;
            })
        });

        if( test.RelevantQuest != null && test.RelevantQuest != undefined && assignedTest.Score === test.Questions.length){
            Users.AddAssignedQuest(user, Quests.GetQuestByIDInAssignedStructer(test.RelevantQuest));
        }

        assignedTest.IsCompleted = true;
        Users.SaveUsers();
        return assignedTest;
    },
    FinalizeQuest: (user, questID, score) => {
        assignedQuest = user.AssignedQuest.find(element =>element.QuestID === QuestID);
        if(assignedQuest === undefined)
            return -2;

        quest = Quests.GetQuestByID(questID);
        if(quest === undefined)
            return -1;

        assignedQuest.Score = score;

        assignedQuest.IsCompleted = true;
        Users.SaveUsers();
        return assignedQuest;
    },
    RemoveUser: (userID) => {
        if(avalibleUsers.splice(avalibleUsers.findIndex(elem => elem.id === userID),1) == [])
            return false;

        Users.SaveUsers();
        return true;
    },
    SaveUsers: ()=>{
        fs.writeFileSync("./data/users/users.json", JSON.stringify(avalibleUsers,null,2));
    }
}


module.exports = Users;