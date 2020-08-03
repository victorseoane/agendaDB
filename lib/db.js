const fs = require('fs')
const mysql = require('mysql')

const db = {
    //new Promise((resolve,reject)=>{})
    executeQuery: (query, callback) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'AGENDADB'
        })
        connection.connect(function (err) {
            if (err) {
                callback(err)
                connection.end()
                return
            }
            connection.query(query, (error, res, fields) => {
                if (error) {
                    connection.end()
                    callback(error.code)
                    return
                }
                if(res){
                    if (res.constructor.name === 'OkPacket'){
                        if((JSON.parse(JSON.stringify(res)).changedRows===0)&&JSON.parse(JSON.stringify(res)).affectedRows===0){
                            connection.end()
                            callback('No changes')
                            return
                        }
                        connection.end()
                        callback('OK')
                        return
                    } else if(Array.isArray(res)){
                        obj = []
                        for (let u in res) {
                            obj.push(Object.assign({}, res[u]))
                        }
                        connection.end()
                        callback(obj)
                    }
                }
               
            })

        })
    }
}

module.exports = db