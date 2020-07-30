const express = require('express')
const bodyParser = require('body-parser')
const {addActivity,saveUser,getUsers,getUser,deleteUser, editUser, deleteActivity} = require('../user.js')
const path = require('path')
const { read } = require('fs')
const { create } = require('domain')

const pathDB = path.resolve(__dirname,'../../db/users.json')
const app = express()
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/user/:username', (req,res)=>{
    const user = getUser(pathDB,req.params.username)
    res.header('Access-Control-Allow-Origin','*')
    res.send(user)
})

app.get('/users',(req,res)=>{
    const users = getUsers(pathDB)
    res.header('Access-Control-Allow-Origin','*')
    res.send(users)
})
app.options('/user/add',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','*')
    res.send('OK')
})

app.post('/user/add',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    try{
        const newUser = saveUser(pathDB,req.body,true)
        res.send(newUser)
    } catch(err){
        res.send('Duplicated user')
    }
})
app.post('/user/:username/delete',(req,res)=>{
    try{
        const msg = deleteUser(pathDB,req.params.username)
        res.send(msg)
    }catch(err){
        res.send('User does not exist')
    }

})
app.post('/user/:username/edit',(req,res)=>{
    try{
        const editedUser = editUser(pathDB,req.params.username,req.body)
        res.send(editedUser)
    }catch(err){
        res.send('User does not exist')
    }

})

app.post('/activity/:username/add',(req,res)=>{
    try{
        const user = getUser(pathDB,req.params.username)
        const newUser = addActivity(user,req.body.name,req.body.date,req.body.hour)
        const savedUser = saveUser(pathDB,newUser,false)
        res.send(savedUser)
    }catch(error){
        res.send(error)
    }
})

app.post('/activity/:username/:activityName/delete',(req,res)=>{
    try{
        const user = getUser(pathDB,req.params.username)
        const newUser = deleteActivity(user,req.params.activityName)
        const savedUser = saveUser(pathDB,newUser,false)
        res.send(savedUser)
    }catch(error){
        res.send(error.msg)
    }
})

app.post('/activity/:username/:activityName/edit',(req,res)=>{
    try{
        const editedUser = editUser(pathDB,req.params.username,req.body)
        res.send(editedUser)
    }catch(err){
        res.send('User does not exist')
    }
})

app.get('/front/users',(req,res)=>{
    const users = getUsers(pathDB)
    const fields = Object.keys(users[Object.keys(users)[0]])
    fields.length = fields.length-1
    const headers = ["Username", "Name", "Surname", "Email", "Phone"]
    let html = '<head><link rel="stylesheet" href="/css/mycss.css"></head><body><h2>Users:</h2><div>'
    html += createTableHTML(Object.values(users),headers,fields)
    html += '</div></body>'
    res.send(html)
})

app.get('/front/activities/:username',(req,res)=>{
    const user = getUser(pathDB,req.params.username)
    const fields = Object.keys(user.activityList[1])
    const headers = ["Activity name", "Date", "Hour"]
    let html = `<head><link rel="stylesheet" href="/css/mycss.css"></head><body><h2>Activities of user ${req.params.username}:</h2><div>`
    html += createTableHTML(user.activityList,headers,fields)
    html += '</div></body>'
    res.send(html)
})
app.listen(8000)

function createTableHTML(data,headers,fields){
    let html = '<table><tr>'
    for(let eachHeader in headers){
        html += `<th>${headers[eachHeader]}</th>`
    }
    html += '</tr>'
    for(let eachRow in data){
        html+='<tr>'
        for (let eachField in fields){
            html+=`<td>${data[eachRow][fields[eachField]]}</td>`
        }
        html+='</tr>'
    }
    html += '</table>'
    return html
}