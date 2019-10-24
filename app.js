const express = require('express');
const app = express();
const bodyParser = require('body-parser')

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

app.use(bodyParser.json())


app.get('/test', (req, res) => res.send('test page!'));
app.get('/say/:name', function (req, res) {
  const name = req.params.name
  const q = req.query.q
  const t = req.query.t
  res.send(`say ${name} ${q} ${t}`);
});


app.post('/report/temperature', function (req, res) {
  const temp = req.body.temperature
  const device_id = req.body.id

  knex('temps').insert({
    temp: temp,
    datetime: new Date(),
    device_id: device_id
  })
    .then((result) => {
      res.json({ result: 'ok' })
    })
    .catch((err) => {
      res.statusCode = 500
      res.json({ result: 'error' })
    })
});


app.get('/monitor/temperature', (req, res) => {
  knex('temps').select()
    .orderBy('datetime', 'desc')
    .limit(100)
    .then((list) => {
      res.json(list)
    })
    .catch((err) => {
      res.statusCode = 500
      res.json({ result: 'error' })
    })
})

app.get('/monitor/temperature/bydevice/:start/:end', (req, res) => {
  const start = req.params.start
  const end = req.params.end

  const query = knex('temps').select([
    'device_id',
    knex.raw(`date_trunc('day', "datetime") as date_day`),
    knex.raw('avg(temp) as avg'),
    knex.raw('min(temp) as min'),
    knex.raw('max(temp) as max')
  ])
    .whereBetween('datetime', [
      new Date(start),
      new Date(end)
    ])
    .groupBy(['date_day', 'device_id'])
    .orderBy('date_day', 'asc')

  console.log(query.toString())

  query.then((list) => {
    const listByDevId = {}

    list.forEach(row => {
      if (listByDevId[row.device_id]) {
        listByDevId[row.device_id].push(row)
      }
      else {
        listByDevId[row.device_id] = [row]
      }
    })

    res.json(listByDevId)
  })
    .catch((err) => {
      res.statusCode = 500
      res.json({ result: 'error' })
    })
})

app.get('/monitor/temperature/bydeviceall/:start/:end', (req, res) => {
  const start = req.params.start
  const end = req.params.end

  const query = knex('temps').select([
    'device_id',
    knex.raw('avg(temp) as avg'),
    knex.raw('min(temp) as min'),
    knex.raw('max(temp) as max')
  ])
    .whereBetween('datetime', [
      new Date(start),
      new Date(end)
    ])
    .groupBy(['device_id'])

  console.log(query.toString())

  query.then((list) => {
    res.json(list)
  })
    .catch((err) => {
      res.statusCode = 500
      res.json({ result: 'error' })
    })
})

app.use(express.static('public'))


const { PORT = 3000 } = process.env

app.listen(PORT, function () {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});
