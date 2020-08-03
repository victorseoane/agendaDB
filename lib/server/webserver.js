const express = require('express')
const bodyParser = require('body-parser')
const {getUser,getUsers,getActivitiesOfUser,saveUser,deleteUser,editUser, addActivity, deleteActivity,editActivity} = require('../user.js')
const path = require('path')

const app = express()
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/users',(req,res)=>{
    getUsers((users)=>{
        res.header('Access-Control-Allow-Origin','*')
        res.send(users)
        return
    })
})
app.get('/activities/:username',(req,res)=>{
    getActivitiesOfUser(req.params.username,(actis)=>{
        res.header('Access-Control-Allow-Origin','*')
        res.send(actis)
        return
    })
})

app.get('/user/:username',(req,res)=>{
    getUser(req.params.username,(user)=>{
        res.header('Access-Control-Allow-Origin','*')
        res.send(user)
        return
    })
})
app.options('/user/add',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','*')
    res.send('OK')
})
app.post('/user/add',(req,res)=>{
    saveUser(req.body,(err)=>{
            if(err.code==='ER_DUP_ENTRY'){
                res.header('Access-Control-Allow-Origin','*')
                res.send('Duplicated user')
                return
            }
            else{
                res.header('Access-Control-Allow-Origin','*')
                getUser(req.body.userName,(result)=>{
                    console.log(result)
                    res.send(result)  
                    return
                })
            }
        })
})

app.post('/user/:username/delete',(req,res)=>{
    deleteUser(req.params.username,(result)=>{
        res.header('Access-Control-Allow-Origin','*')
        res.send(result)
    })
})

app.post('/user/:username/edit',(req,res)=>{
    editUser(req.params.username,req.body,(result)=>{
        res.header('Access-Control-Allow-Origin','*')
        res.send(result)
    })
})
app.post('/activities/:username/add',(req,res)=>{
    const body = req.body
    res.header('Access-Control-Allow-Origin','*')
    if((body.name===undefined)||(body.date===undefined)||(body.hour===undefined)){
        res.send('Wrong format')
        return
    }
    addActivity(req.params.username,body.name,body.date,body.hour,(result)=>{
        res.send(result)
    })
})
app.post('/activities/:username/delete',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    const body = req.body
    if(body.id===undefined){
        res.send('Wrong format')
        return
    }
    deleteActivity(req.params.username,body.id,(result)=>{
        res.send(result)
    })
})
app.post('/activities/:username/edit',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*')
    const body = req.body
    if(body.id===undefined){
        res.send('Wrong format')
        return
    }
    if(body.changes===undefined){
        res.send('No changes')
        return
    }
    editActivity(req.params.username,body.id,body.changes,(result)=>{
        res.send(result)
    })
})
app.listen(8000)