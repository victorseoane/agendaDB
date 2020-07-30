const db = require('../lib/db.js')
const {createUser} = require("../lib/user.js")
const path = require('path')
const fs = require('fs')
describe('load function ',()=>{
    it("works with empty file",()=>{
        const loadedDb = db.load('')
        expect(loadedDb).toEqual({})
    })
    it("works for dbtest.json",()=>{
        const loadedDb = db.load(path.resolve(__dirname,'dbtest.json'))
        expect(loadedDb.username).not.toBe(undefined)
    })
})

describe('write function ',()=>{
    it("works for dbtest2.JSON",()=>{
        const pathTest2 = path.resolve(__dirname,'dbtest2.json')
        
        const loadedDb = db.load(pathTest2)
        expect(loadedDb).toEqual({})
        
        const user = createUser("username2","Pepe","Garcia","v@gmail.com","+346863423")
        db.write(user,pathTest2)
        const loadedDb2 = db.load(pathTest2)
        expect(loadedDb2).toEqual(user)
        
        fs.unlinkSync(pathTest2)
    })
})