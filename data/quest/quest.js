const fs = require('fs');
const ID = require("../../tools/id");

const avalibleQuests = JSON.parse(fs.readFileSync("./data/quest/quest.json"));

var Quest = {
    AddQuest: (quest)=>{
        if(!Quest.ValidateStructer(quest) )
            return false;
        
        quest.QuestID = ID.createTestID();

        avalibleQuests.push(quest);

        Quest.SaveQuests();

        return true;
    },
    ValidateStructer: (quest) => {
        if(quest.QuestName === undefined || quest.QuestName === "" )
            return false;

        if(avalibleQuests.find(elem => elem.QuestName === quest.QuestName ) !== undefined)
            return false;
        return true;
    },
    GetAllQuests: ()=>{
        return avalibleQuests;
    },
    GetQuestByID: (questID)=>{
        return avalibleQuests.find( elem => elem.QuestID === questID);      
    },
    GetQuestByIDInAssignedStructer: (questID)=>{
        assigned = avalibleQuests.find( elem => elem.QuestID === questID);
        assigned = JSON.parse(JSON.stringify(assigned));

        delete assigned.Creator;

        assigned.Score = 0;
        assigned.IsCompleted = false;

        return assigned;    
    },
    GetQuestByQuestName: (questName) => {
        return avalibleQuests.find( elem => elem.QuestName === questName );
    },
    RemoveTest: (questID) => {
        if(avalibleQuests.splice(avalibleQuests.findIndex(elem => elem.QuestID === questID),1) == [])
            return false;

        Quest.SaveQuests();
        return true;
    },
    SaveQuests: ()=>{
        fs.writeFileSync("./data/quest/quest.json", JSON.stringify(avalibleQuests,null,2));
    }
}


module.exports = Quest;