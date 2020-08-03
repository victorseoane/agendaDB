const { createUser, addActivity, deleteActivity, editActivity, saveUser, getUsers, getUser, deleteUser, editUser, getActivitiesOfUser } = require("../lib/user.js")
const db = require("../lib/db.js")

function checkErrorCreateUser(usName, usSurname, usEmail, usPhone, errorMsg) {
    expect(() => {
        createUser(usName, usSurname, usEmail, usPhone)
    }).toThrow(errorMsg)
}

const usernameTest = ['prueba1', 'prueba2']
const nameTest = ['Victor', 'Elena']
const surnameTest = ['Seoane', 'Marco']
const emailTest = ['victors@alternaenergetica.com', 'elenam@alternaenergetica.com']
const phoneTest = ['605968538', '654978975']

const user1 = createUser(usernameTest[0], nameTest[0], surnameTest[0], emailTest[0], phoneTest[0])
const user2 = createUser(usernameTest[1], nameTest[1], surnameTest[1], emailTest[1], phoneTest[1])

const activitynameTest = "Work meeting"
const activityDateTest = "23/07/2020"
const activityHourTest = "11:30"

const nullnameTest = null
const nullUser = null


describe("createUser function ", () => {
    it("works for simple case", () => {
        const expectedUser = { userName: usernameTest[0], name: nameTest[0], surname: surnameTest[0], email: emailTest[0], phone: phoneTest[0], activityList: [] }
        expect(user1).toEqual(expectedUser)
    })
    it("throws error for wrong parameters", () => {
        checkErrorCreateUser(nullnameTest, surnameTest[0], emailTest[0], phoneTest[0], "Wrong parameters for the user")
    })
})

describe("saveUser function ", () => {
    it("works with single user", (done) => {
        saveUser(user1, (result) => {
            expect(result).toEqual("OK")
            getUser(user1.userName, (result2) => {
                expect(result2[0].userName === user1.userName)
                expect(result2[0].name === user1.name)
                expect(result2[0].surname === user1.surname)
                expect(result2[0].phone === user1.phone)
                expect(result2[0].email === user1.email)
                deleteUser(user1.userName, (result3) => {
                    expect(result3).toEqual("OK")
                    done()
                })
            })
        })
    })

    it("works with single user", (done) => {
        saveUser(user1, (result) => {
            expect(result).toEqual("OK")
            getUser(user1.userName, (result2) => {
                expect(result2[0].userName === user1.userName)
                expect(result2[0].name === user1.name)
                expect(result2[0].surname === user1.surname)
                expect(result2[0].phone === user1.phone)
                expect(result2[0].email === user1.email)
                saveUser(user2, (result3) => {
                    expect(result3[0].userName === user2.userName)
                    expect(result3[0].name === user2.name)
                    expect(result3[0].surname === user2.surname)
                    expect(result3[0].phone === user2.phone)
                    expect(result3[0].email === user2.email)
                })
                deleteUser(user1.userName, (result4) => {
                    expect(result4).toEqual("OK")
                    deleteUser(user2.userName, (result5) => {
                        expect(result5).toEqual("OK")
                        done()
                    })
                })
            })
        })
    })
    it("throws error when user is repeated", (done) => {
        saveUser(user1, (result) => {
            expect(result).toEqual("OK")
            saveUser(user1, (result2) => {
                expect(result2).toEqual("ER_DUP_ENTRY")
                deleteUser(user1.userName, (result3) => {
                    expect(result3).toEqual("OK")
                    done()
                })
            })
        })
    })
})

describe("addActivity function ", () => {
    it("works for simple case", (done) => {
        saveUser(user1, (result) => {
            expect(result).toEqual("OK")
            addActivity(user1.userName, activitynameTest, activityDateTest, activityHourTest, (result2) => {
                expect(result2).toEqual("OK")
                getActivitiesOfUser(user1.userName, (result3) => {
                    expect(result3[0].activity_name).toEqual(activitynameTest)
                    expect(result3[0].activity_date).toEqual(activityDateTest)
                    expect(result3[0].activity_hour).toEqual(activityHourTest)
                    deleteUser(user1.userName, (result4) => {
                        expect(result4).toEqual("OK")
                        deleteActivity(user1.userName, activitynameTest, (result5) => {
                            expect(result5).toEqual("OK")
                            done()
                        })

                    })
                })
            })
        })
    })

    it("throws error for wrong parameters of the activity", (done) => {
        saveUser(user1, (result) => {
            expect(result).toEqual("OK")
            addActivity(user1.userName, activitynameTest, null, activityHourTest, (result2) => {
                expect(result2).toEqual("Wrong parameters for the new activity")
                deleteUser(user1.userName, (result3) => {
                    expect(result3).toEqual("OK")
                    done()
                })
            })
        })
    })
})

describe('getUsers function ', () => {
    it('works for non-empty bd', (done) => {
        getUsers((result) => {
            expect(Array.isArray(result)).toEqual(true)
            done()
        })
    })
})

describe('getUser function ', () => {
    it('works for existing user', (done) => {
        saveUser(user1, (result) => {
            getUser(user1.userName, (result2) => {
                expect(result2.length).toEqual(1)
                expect(result2[0].username).toEqual(user1.userName)
                expect(result2[0].name).toEqual(user1.name)
                expect(result2[0].surname).toEqual(user1.surname)
                expect(result2[0].phone).toEqual(user1.phone)
                expect(result2[0].email).toEqual(user1.email)
                deleteUser(user1.userName, (result3) => {
                    expect(result3).toEqual("OK")
                    done()
                })
            })
        })
    })
    it('works for non-existing user', (done) => {
        getUser(user1.userName, (result2) => {
            expect(result2.length).toEqual(0)
            done()
        })

    })
})

describe('deleteUser function ', () => {
    it('works for existing user', (done) => {
        saveUser(user1, (result) => {
            deleteUser(user1.userName, (result2) => {
                expect(result2).toEqual("OK")
                getUser(user1.userName, (result3) => {
                    expect(result3.length).toEqual(0)
                })
                done()
            })
        })
    })
    it('works for non-existing user', (done) => {
        deleteUser(user1.userName, (result2) => {
            expect(result2).toEqual("No changes")
            done()
        })
    })
})


describe("deleteActivity function ", () => {
    it("works with existing activity", (done) => {
        saveUser(user1, (result) => {
            expect(result).toEqual("OK")
            addActivity(user1.userName, activitynameTest, activityDateTest, activityHourTest, (result2) => {
                expect(result2).toEqual("OK")
                deleteActivity(user1.userName, activitynameTest, (result3) => {
                    expect(result3).toEqual("OK")
                    getActivitiesOfUser(user1.userName, (result4) => {
                        expect(result4.length).toEqual(0)
                        deleteUser(user1.userName, (result4) => {
                            expect(result4).toEqual("OK")
                            done()
                        })
                    })
                })
            })
        })
    })

    it("works with non-existing activity", (done) => {
        saveUser(user1, (result) => {
            expect(result).toEqual("OK")
            deleteActivity(user1.userName, activitynameTest, (result3) => {
                expect(result3).toEqual("No changes")
                deleteUser(user1.userName, (result4) => {
                        expect(result4).toEqual("OK")
                        done()
                })
            })
        })
    })
})

/*
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
})*/