const {createUser,addActivity, deleteActivity, editActivity, saveUser,getUsers,getUser, deleteUser, editUser} = require("../lib/user.js")
const db = require("../lib/db.js") 
const path = require('path')
const fs = require('fs')


function checkErrorCreateUser(usName,usSurname,usEmail,usPhone,errorMsg){
    expect(()=>{
        createUser(usName,usSurname,usEmail,usPhone)
    }).toThrow(errorMsg)
}

function checkErrorAddActivity(pathTest,user,actName,actDate,actHour,errorMsg){
    expect(()=>{
        addActivity(pathTest,user,actName,actDate,actHour)
    }).toThrow(errorMsg)
}

const usernameTest = ['vseoane','elenam']
const nameTest= ['Victor','Elena']
const surnameTest= ['Seoane','Marco']
const emailTest= ['victors@alternaenergetica.com','elenam@alternaenergetica.com']
const phoneTest = ['605968538','654978975']

const user1 = createUser(usernameTest[0],nameTest[0],surnameTest[0],emailTest[0],phoneTest[0])
const user2 = createUser(usernameTest[1],nameTest[1],surnameTest[1],emailTest[1],phoneTest[1])

const activitynameTest = "Work meeting"
const activityDateTest = "23/07/2020"
const activityHourTest = "11:30"

const nullnameTest = null
const nullUser = null

const pathTest = path.resolve(__dirname,'../db/emptyExample.json')
describe("createUser function ",()=>{

    it("works for simple case",()=>{
        const expectedUser = {userName:usernameTest[0],name:nameTest[0],surname:surnameTest[0],email:emailTest[0],phone:phoneTest[0],activityList:[]}
        expect(user1).toEqual(expectedUser)
    })
    it("throws error for wrong parameters",()=>{
        checkErrorCreateUser(nullnameTest,surnameTest[0],emailTest[0],phoneTest[0],"Wrong parameters for the user")
    })
})

describe("addActivity function ",()=>{

    it("works for simple case",()=>{
        const userWithActivity = addActivity(user1,activitynameTest,activityDateTest,activityHourTest)
        const expectedUser = {...user1,activityList:[{name:"Work meeting",date:"23/07/2020",hour:"11:30"}]}
        expect(userWithActivity).toEqual(expectedUser)
    })
    it("throws error for null user",()=>{
        checkErrorAddActivity(nullUser,activitynameTest,activityDateTest,activityHourTest,"User is not defined")
    })
    it("throws error for wrong parameters of the activity",()=>{
        checkErrorAddActivity(user1,activitynameTest,null,activityHourTest,"Wrong parameters for the new activity")
    })
})



describe("saveUser function ",()=>{


    it("works when DB is empty",()=>{
        saveUser(pathTest,user1,true)
        const readUser = db.load(pathTest)
        expect(readUser[usernameTest[0]]).toEqual(user1)
        fs.unlinkSync(pathTest)
    })

    it("works with multiple users",()=>{
        saveUser(pathTest,user1,true)
        saveUser(pathTest,user2,true)
        const readUser = db.load(pathTest)
        expect(readUser[usernameTest[0]]).toEqual(user1)
        expect(readUser[usernameTest[1]]).toEqual(user2)
        fs.unlinkSync(pathTest)
    })

    it("throws error when user is repeated",()=>{
        expect(()=>{
            saveUser(pathTest,user1,true)
            saveUser(pathTest,user1,true)
        }).toThrow('Duplicated user')
        fs.unlinkSync(pathTest)
    })

})

describe('getUsers function ',()=>{
    it('works for empty list',()=>{
        const usersGet = getUsers(pathTest)
        expect(usersGet).toEqual({})
    })
    it('works for non-empty list',()=>{
        saveUser(pathTest,user1,true)
        saveUser(pathTest,user2,true)
        const usersGet = getUsers(pathTest)
        expect(usersGet[user1.userName]).toEqual(user1)
        expect(usersGet[user2.userName]).toEqual(user2)
        fs.unlinkSync(pathTest)
    })
})

describe('getUser function ',()=>{
    it('works for existing user',()=>{
        saveUser(pathTest,user1,true)
        const userGet = getUser(pathTest,user1.userName)
        expect(userGet).toEqual(user1)
        fs.unlinkSync(pathTest)
    })
    it('works for non-existing user',()=>{
        saveUser(pathTest,user1,true)
        expect(()=>{
            getUser(pathTest,user2.userName)
        }).toThrow('User does not exist')
        fs.unlinkSync(pathTest)

    })
})

describe('deleteUser function ',()=>{
    it('works for existing user',()=>{
        saveUser(pathTest,user1,true)
        deleteUser(pathTest,user1.userName)
        expect(()=>{
            const userGet = getUser(pathTest,user1.userName)
        }).toThrow('User does not exist')
        fs.unlinkSync(pathTest)
    })
    it('works for non-existing user',()=>{
        saveUser(pathTest,user1,true)
        expect(()=>{
            deleteUser(pathTest,user2.userName)
        }).toThrow('User does not exist')
        fs.unlinkSync(pathTest)
    })
})

describe('editUser function ',()=>{
    it('works for existing user',()=>{
        saveUser(pathTest,user1,true)
        const editedUser = editUser(pathTest,user1.userName,{name:"Pepe",surname:"Pepito"})
        expect(editedUser.name).toEqual("Pepe")
        expect(editedUser.surname).toEqual("Pepito")
        
        const userGet = getUser(pathTest,user1.userName)
        expect(userGet.name).toEqual("Pepe")
        expect(userGet.surname).toEqual("Pepito")
        fs.unlinkSync(pathTest)
    })
    it('works for non-existing user',()=>{
        saveUser(pathTest,user1,true)
        expect(()=>{
            const editedUser = editUser(pathTest,user2.userName,{name:"Pepe",surname:"Pepito"})
        }).toThrow('User does not exist')
        fs.unlinkSync(pathTest)
    })
})

describe("deleteActivity function ",()=>{
    it("works with user with one activity",()=>{
        const user = saveUser(pathTest,user1,true)
        const userWithActivity = addActivity(user1,activitynameTest,activityDateTest,activityHourTest)
        saveUser(pathTest,userWithActivity,false)
        
        const userWithoutAct = deleteActivity(userWithActivity,activitynameTest)
        saveUser(pathTest,userWithoutAct,false)

        const userGet = getUser(pathTest,userWithoutAct.userName)
        expect(userGet.activityList.length).toEqual(0)
        fs.unlinkSync(pathTest)
    })
    it("works with user with user with multiple activity",()=>{
        const user = saveUser(pathTest,user1,true)
        const userWithActivity = addActivity(user1,activitynameTest,activityDateTest,activityHourTest)
        const userWithActivity2 = addActivity(userWithActivity,'Golf','20/04/2020','15:00')
        const userWithActivity3 = addActivity(userWithActivity2,'Padel','20/04/2020','15:00')
        saveUser(pathTest,userWithActivity3,false)
        
        const userWithoutAct = deleteActivity(userWithActivity3,'Golf')
        saveUser(pathTest,userWithoutAct,false)

        const userGet = getUser(pathTest,userWithoutAct.userName)
        expect(userGet.activityList.length).toEqual(2)
        fs.unlinkSync(pathTest)
    })
})
describe('editActivity function ',()=>{
    it('works for existing activity',()=>{
        saveUser(pathTest,user1,true)
        const userWithActivity = addActivity(user1,activitynameTest,activityDateTest,activityHourTest)
        saveUser(pathTest,userWithActivity,false)

        const editedUser = editActivity(userWithActivity,activitynameTest,{name:"Prueba",date:"28/05/1996"})
        expect(editedUser.activityList[0].name).toEqual('Prueba')
        expect(editedUser.activityList[0].date).toEqual('28/05/1996')
        saveUser(pathTest,editedUser,false)

        
        const userGet = getUser(pathTest,user1.userName)
        expect(userGet.activityList[0].name).toEqual('Prueba')
        expect(userGet.activityList[0].date).toEqual('28/05/1996')
        fs.unlinkSync(pathTest)
    })
})