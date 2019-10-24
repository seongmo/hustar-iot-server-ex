const fs = require('fs')
const csv = require('fast-csv')

const filename = 'data/temp_datas2.csv'

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'mydb.sqlite'
  }
  //client: 'pg',
  //connection: {
  //    hostname:'localhost',
  //    user: 'user1',
  //    password: 'upass1',
  //    database: 'mtdb'
  // }  
});


const datas = []

fs.createReadStream(filename)
  .pipe(csv.parse({ headers: true }))
  .on('data', row => {
    const datetime = row['년/월/일/시/시간']
    const devId = row['지점번호']
    const temp = parseFloat(row['기온'])
    const data = {
      device_id: Number(devId),
      datetime: new Date(datetime),
      temp: temp || 0
    }
    datas.push(data)
    
  }).on('end', async () => {
    console.log('csv parse done')

    const chunkSize = 300
    try {
      for(var i=0; i<datas.length; i += chunkSize) {
        const chunk = datas.slice(i, i+chunkSize)
        
        await knex('temps').insert(chunk)
        console.log(`${i+chunkSize} row inserted`)
      }
    }
    catch(err) {
      console.error(err)
    }
    console.log('done')

    knex.destroy()
  })