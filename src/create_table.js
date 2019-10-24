var knex = require('knex')({
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

knex.schema
    .dropTableIfExists('temps')
    .createTable('temps', function (table) {
        table.increments('id')
        table.integer('device_id')
        table.dateTime('datetime')
        table.float('temp').notNullable().defaultTo(0)
    }).then(() => {
        console.log('created')
    })
