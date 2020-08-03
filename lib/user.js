const fs = require("fs")
const db = require('./db.js')
const path = require('path')


function createUser(userName, name, surname, email, phone) {
    if ((userName == null) || (name == null) || (surname == null) || (email == null) || (phone == null)) {
        throw Error("Wrong parameters for the user")
    }
    const user = { userName: userName, name: name, surname: surname, email: email, phone: phone, activityList: [] }
    return user
}

function saveUser(userToSave, callback) {
    const query = `INSERT INTO users VALUES('${userToSave.userName}','${userToSave.name}','${userToSave.surname}','${userToSave.email}','${userToSave.phone}')`
    db.executeQuery(query, callback)
}

function addActivity(username, activityName, activityDate, activityHour, callback) {
    if (username == undefined) {
        callback("username is not defined")
        return
    }
    if ((activityName == undefined) || (activityDate == undefined) || (activityHour == undefined)) {
        callback("Wrong parameters for the new activity")
        return
    }
    let query = 'INSERT INTO activities (username,activity_name,activity_date,activity_hour) '
    query += `VALUES('${username}','${activityName}','${activityDate}','${activityHour}')`
    db.executeQuery(query, callback)
}

function deleteActivity(username, activityName, callback) {
    const query = `DELETE FROM activities WHERE activity_name='${activityName}' AND username='${username}'`
    db.executeQuery(query, callback)
}

function editActivity(username, activityId, fieldsToChange, callback) {
    if (Object.keys(fieldsToChange).length===0) {
        callback("No activity fields have been specified")
        return
    }
    let query = 'UPDATE activities SET '
    let count=0
    for (field in fieldsToChange) {
        query+=`${field}='${fieldsToChange[field]}'`
        count++
        if(count!==Object.keys(fieldsToChange).length){
            query+=','
        }
    }
    query+=` WHERE username='${username}' AND id=${activityId}`
    db.executeQuery(query,callback)
}

function getUser(username, callback) {
    const query = `SELECT * FROM users WHERE username='${username}'`
    db.executeQuery(query, callback)
}

function getUsers(callback) {
    const query = 'SELECT * FROM users'
    db.executeQuery(query, callback)
}

function getActivitiesOfUser(username, callback) {
    const query = `SELECT activity_name,activity_date,activity_hour FROM activities WHERE username='${username}'`
    db.executeQuery(query, callback)
}
function deleteUser(username, callback) {
    const query = `DELETE FROM users WHERE username='${username}'`
    db.executeQuery(query, callback)
}
function editUser(username, fieldsToChange, callback) {
    let query = 'UPDATE users SET '

    if (fieldsToChange == {}) {
        callback('No fields to change')
    }
    let count = 0
    for (let field in fieldsToChange) {
        query += `${field}='${fieldsToChange[field]}'`
        count++
        if (count !== Object.keys(fieldsToChange).length) {
            query += ','
        }
    }
    query += ` WHERE username='${username}'`
    
    db.executeQuery(query, callback)
}

module.exports = { createUser, addActivity, deleteActivity, editActivity, saveUser, getUser, getUsers, getActivitiesOfUser, deleteUser, editUser }