const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "spdbuser",
    port: 5432,
    password: "spdbpw",
    database: "spdb_car_routing"
    // database: "spdb_osm2pgrouting"
})

module.exports = client