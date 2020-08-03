const db = require('../lib/db.js')


describe('executeQuery function ',()=>{
    it("works with error",(done)=>{
        const query = 'SELECT * FROM nonexistingdb'
        db.executeQuery(query, (result)=>{
            expect(result).toEqual('ER_NO_SUCH_TABLE')
            done()
        })
    })
    it("works for correct case returning an array",(done)=>{
        const query = 'SELECT * FROM users'
        db.executeQuery(query, (result)=>{
            expect(Array.isArray(result)).toEqual(true)
            done()
        })
    })

    it("works for case in which there is no match",(done)=>{
        const query = 'UPDATE users SET username="vseoane" WHERE name="nonexistingname"'
        db.executeQuery(query, (result)=>{
            expect(result).toEqual('No changes')
            done()
        })
    })

    it("works for correct case returning a message",(done)=>{
        const query = 'INSERT INTO users VALUES("prueba","prueba","prueba","prueba","prueba")'
        const query2 = 'DELETE FROM users WHERE username="prueba"'

        db.executeQuery(query, (result)=>{
            expect(result).toEqual('OK')
                db.executeQuery(query2,(result2)=>{
                    expect(result2).toEqual('OK')
                    done()
                })

        })
    })

})
