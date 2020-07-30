const fs = require("fs")
const db = require('./db.js')
const path = require('path')

function createUser(userName,name,surname,email,phone){
    if((userName==null)||(name==null)||(surname==null)||(email==null)||(phone==null)){
        throw Error("Wrong parameters for the user")
    }
    const user = {userName:userName,name:name, surname:surname, email:email, phone:phone, activityList:[]}
    return user
}




function saveUser(dbPath,userToSave,isNew){
    let readData
    try{
         readData = db.load(dbPath) 
    }catch(e){
        console.log(e)
        throw e
    }
    const userKey=userToSave.userName
    
    if(isNew===true){
        if (readData[userKey]!=undefined) throw Error('Duplicated user')
    }
    
    readData[userKey]=userToSave
    db.write(readData,dbPath)
    try{
        readData = db.load(dbPath) 
   }catch(e){
       console.log(e)
       throw e
   }
   return readData[userKey]
}

function addActivity(user, activityName,activityDate, activityHour){
    if(user==null){
        throw Error("User is not defined")
    }
    if((activityName==null)||(activityDate==null)||(activityHour==null)){
        throw Error("Wrong parameters for the new activity")
    }
    const activity = {name:activityName, date:activityDate, hour:activityHour}
    const newUser = {...user,activityList:[...user.activityList]} //Copia de objeto con todas las keys
    newUser.activityList.push(activity)
    return newUser
}

function deleteActivity(user, activityName){
    if(user==null){
        throw Error("User is not defined")
    }
    if(activityName==null){
        throw Error("No activity has been specified")
    }
    const newUser = {...user,activityList:[...user.activityList]}
    for (let act in newUser.activityList){
        if(newUser.activityList[act].name===activityName){
            newUser.activityList.splice(act,1)
            break;
        }
    }
    return newUser
}

function editActivity(user, activityName, fieldsToChange){
    if(user==null){
        throw Error("User is not defined")
    }
    if(activityName==null){
        throw Error("No activity has been specified")
    }
    if(fieldsToChange=={}){
        throw Error("No activity fields have been specified")
    }

    const newUser = {...user,activityList:[...user.activityList]}
    for (let act in newUser.activityList){
        if(newUser.activityList[act].name===activityName){
            for (field in fieldsToChange){
                newUser.activityList[act][field]=fieldsToChange[field]
            }
            break;
        }
    }
    return newUser
}

function getUsers(dbPath){
    let readData
    try{
         readData = db.load(dbPath) 
    }catch(e){
        console.log(e)
        throw e
    }
    return readData
}

function getUser(dbPath,username){
    const readData = checkUser(dbPath,username)
    return readData[username]
}

function deleteUser(dbPath,username){
    const readData = checkUser(dbPath,username)
    delete readData[username]
    db.write(readData,dbPath)
    return 'User '+username+' deleted'
}
function editUser(dbPath,username,fieldsToChange){
    const readData = checkUser(dbPath,username)
    if(fieldsToChange=={}){
        throw Error('No fields to change')
    }
    for (field in fieldsToChange){
        readData[username][field]=fieldsToChange[field]
    }
    db.write(readData,dbPath)
    const editedUser = getUser(dbPath,username)
    return editedUser
}

function checkUser(dbPath,username){
    const readData = getUsers(dbPath)
    if (!(username in readData)) throw Error('User does not exist')
    return readData
}
module.exports = {createUser,addActivity, deleteActivity, editActivity,saveUser,getUsers,getUser,deleteUser, editUser}