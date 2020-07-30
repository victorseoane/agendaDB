const stdio = require('stdio')
const path = require('path')
const {createUser, saveUser, addActivity,getUsers, getUser} = require('../lib/user')
const db = require('../lib/db.js')
const pathDB = path.resolve(__dirname,'../db/users.json')

chooseOption().then((res)=>{
    if(res=='1'){
        gatherUserData().then((res)=>{
            const user = createUser(res.answer,res.answer2,res.answer3,res.answer4,res.answer5)
            saveUser(pathDB,user,true)
        }).catch((error)=>{
            console.log(error)
        })
    }
    if(res=='2'){
        gatherActivityData().then((res)=>{
            const newUser = addActivity(res.user,res.answer,res.answer2,res.answer3)
            saveUser(pathDB,newUser,false)
        }).catch((error)=>{
            console.log(error)
        })
    }
    if(res=='3'){
        askUser().then((username)=>{
            let user
            try{
                user = getUser(pathDB,username)
            }catch(e){
                console.log('User does not exist')
                return
            }
            const row = {...user,activityList:JSON.stringify(user.activityList)}
            console.table([row])
        }).catch((error)=>{
            console.log(error)
        })
    }
    if(res=='4'){
        const allUsers = user = getUsers(pathDB)
        let myTable = []
        for(let eachUser in allUsers){
            let row = {...user[eachUser],activityList:JSON.stringify(user[eachUser].activityList)}
            myTable.push(row)
        }
        console.table(myTable)
    }

}).catch((error)=>{
    console.log(error)
})



async function chooseOption(){
    const answer = await stdio.ask('Choose an option:\n1. Add new user \n2.Add activity to existing user\n3. Get user\n4. Get all the users\n')
    return answer
}
async function askUser(){
    const answer = await stdio.ask('Introduce the username')
    return answer
}
async function gatherUserData(){
    const answer = await stdio.ask('Introduce the username')
    const answer2 = await stdio.ask('Introduce the name of the user')
    const answer3 = await stdio.ask('Introduce the surnames of the user')
    const answer4 = await stdio.ask('Introduce the email of the user') 
    const answer5 = await stdio.ask('Introduce the phone number of the user')
    return {answer,answer2,answer3,answer4,answer5}
}

async function gatherActivityData(){
    const user = await stdio.ask('Introduce the username')
    let readData
    try{
         readData = db.load(pathDB) 
    }catch(e){
        console.log(e)
        throw e
    }
    if (readData[user]==undefined) throw Error('User doesn!t exist')

    const answer = await stdio.ask('Introduce the name of the activity')
    const answer2 = await stdio.ask('Introduce the date of the activity')
    const answer3 = await stdio.ask('Introduce the hour of the activity') 
    return {user:readData[user],answer,answer2,answer3}

}
