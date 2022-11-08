const fs = require('fs');
const ID = require("../../tools/id");

const avalibleTests = JSON.parse(fs.readFileSync("./data/tests/tests.json"));

var Tests = {
    AddTest: (test)=>{
        if(!Tests.ValidateStructer(test) )
            return false;
        
        test.TestID = ID.createTestID();
        test.Questions.forEach(elem => {
            elem.QuestionID = ID.createQuestionID()
        });
        avalibleTests.push(test);

        Tests.SaveTests();

        return true;
    },
    ValidateStructer: (test) => {
        if(test.TestName === undefined || test.TestName === "" )
            return false;
        if(avalibleTests.find(elem => elem.TestName == test.TestName) !== undefined)
            return false;
        if(avalibleTests.find(elem => elem.TestName == test.TestName) != null)
            return false;
        if(test.RelevantQuest === undefined || test.RelevantQuest === "" )
            test.RelevantQuest = "";
        if(test.Creator === undefined || test.Creator === "" )
            return false;
        if(test.Questions === undefined || !Array.isArray(test.Questions) || !(Array.isArray(test.Questions) && test.Questions.length > 0) )
            return false;
        
        return test.Questions.every(elem => {
            if(elem.Question === undefined || elem.Question === "" )
                return false;
            
            if(elem.Answers === undefined || !Array.isArray(elem.Answers) || !(Array.isArray(elem.Answers) && elem.Answers.length > 0) )
                return false;

            if(!Number.isInteger(elem.RightAnswer) || elem.Answers.length <= elem.RightAnswer || elem.RightAnswer < 0 )
                return false;

            return elem.Answers.every(ansElem => typeof ansElem === 'string' || ansElem instanceof String);
        });
    },
    GetAllTests: ()=>{
        return avalibleTests;
    },
    GetTestByID: (testID)=>{
        return avalibleTests.find( elem => elem.TestID === testID);      
    },
    GetTestByIDInAssignedStructer: (testID)=>{
        assigned = avalibleTests.find( elem => elem.TestID === testID);
        assigned = JSON.parse(JSON.stringify(assigned));

        delete assigned.RelevantQuest;
        delete assigned.Creator;
        assigned.Score = 0;
        assigned.IsCompleted = false;

        assigned.Questions.forEach(elem=>{
            delete elem.RightAnswer;
            elem.ChosenAnswer = -1;
        })

        return assigned;    
    },
    GetTestByTestName: (testName) => {
        return avalibleTests.find( elem => elem.TestName === testName );
    },
    RemoveTest: (testID) => {
        if(avalibleTests.splice(avalibleTests.findIndex(elem => elem.TestID === testID),1) == [])
            return false;

        Tests.SaveTests();
        return true;
    },
    SaveTests: ()=>{
        fs.writeFileSync("./data/tests/tests.json", JSON.stringify(avalibleTests,null,2));
    }
}


module.exports = Tests;