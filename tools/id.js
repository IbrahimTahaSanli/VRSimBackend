const crypto = require("crypto");

module.exports = class ID{
    static createUserID(){
        return crypto.randomBytes(24).toString("hex")        
    }

    static createTestID(){
        return crypto.randomBytes(16).toString("hex")
    }

    static createQuestID(){
        return crypto.randomBytes(16).toString("hex")
    }

    static createQuestionID(){
        return crypto.randomBytes(32).toString("hex")
    }
}