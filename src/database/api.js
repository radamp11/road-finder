const client = require('./connection.js')
const endpoints = require('./contract.js')
const defaultWays = require('./contract.js')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

const getCurrentDateTime = () => {
    return new Date(Date.now()).toISOString() + ' '
}


app.post(endpoints.shortestKPathsOnTimeEndpointNoLimit, (req, res) => {
    console.log(getCurrentDateTime(), ' Handling ', endpoints.shortestKPathsOnTimeEndpointNoLimit, ' request')
    const params = req.body
    console.log("params ", params)

    let fastestRouteQuery = `select * from __ksp_time(${params.startId}, ${params.targetId}, ${params.noOfRoads})`

    let ways = {
        way1: {
            edges: [],
            cost: null
        },
        way2: {
            edges: [],
            cost: null
        },
        way3: {
            edges: [],
            cost: null
        }
    }

    var ksp_query_result = null

    client.query(fastestRouteQuery, (err, result) => {
        if(!err) {
            ksp_query_result = result.rows
            var newWays = 0

            for(let i = 0; i < ksp_query_result.length; i++) {
                if(ksp_query_result[i].edge === '-1'){
                    if(newWays === 0)
                        ways.way1.cost = ksp_query_result[i].agg_cost
                    else if(newWays === 1)
                        ways.way2.cost = ksp_query_result[i].agg_cost
                    else ways.way3.cost = ksp_query_result[i].agg_cost
                    newWays++
                    continue
                }
                if(newWays === 0)
                    ways.way1.edges.push(ksp_query_result[i].edge)
                else if(newWays === 1)
                    ways.way2.edges.push(ksp_query_result[i].edge)
                else ways.way3.edges.push(ksp_query_result[i].edge)
            }
        
            let way1Query = ways.way1.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way1.edges})`
            let way2Query = ways.way2.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way2.edges})`
            let way3Query = ways.way3.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way3.edges})`

            var clientQueryList = []
            var option = null

            if(way1Query === null){
                option = 0
            }
            else if(way2Query === null){
                clientQueryList = [client.query(way1Query)]
                option = 1
            }
            else if (way3Query === null){
                clientQueryList = [
                    client.query(way1Query),
                    client.query(way2Query)
                ]
                option = 2
            }
            else{
                clientQueryList = [
                    client.query(way1Query),
                    client.query(way2Query),
                    client.query(way3Query)
                ]
                option = 3
            }
            // console.log(getCurrentDateTime() + 'just before queries for edges')
            Promise.all(clientQueryList).then(function(results){
                switch(option){
                    case 0:

                        break
                    case 1:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    case 2:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way2.edges = results[1].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    case 3:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way2.edges = results[1].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way3.edges = results[2].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    default:
                        console.error(getCurrentDateTime() + "Error in mapping results endpoint: " + endpoints.shortestKPathsOnDistanceEndpoint)
                }
                // console.log(ways)
                // console.log(getCurrentDateTime() + 'all queries completed')
                res.send(ways);
            })
        } 
        else {
            res.send(getCurrentDateTime() + 'Error finding the route: ' + err.message);
        }
        client.end;
    });
})


app.post(endpoints.shortestKPathsOnTimeEndpointSingleLimit, (req, res) => {
    console.log(getCurrentDateTime(), ' Handling ', endpoints.shortestKPathsOnTimeEndpointSingleLimit, ' request')
    const params = req.body
    console.log("params ", params)

    let fastestRouteQuery = `select * from __ksp_time(${params.startId}, ${params.targetId}, ${params.speedLimit}, ${params.noOfRoads})`

    let ways = {
        way1: {
            edges: [],
            cost: null
        },
        way2: {
            edges: [],
            cost: null
        },
        way3: {
            edges: [],
            cost: null
        }
    }

    var ksp_query_result = null

    client.query(fastestRouteQuery, (err, result) => {
        if(!err) {
            ksp_query_result = result.rows
            var newWays = 0

            for(let i = 0; i < ksp_query_result.length; i++) {
                if(ksp_query_result[i].edge === '-1'){
                    if(newWays === 0)
                        ways.way1.cost = ksp_query_result[i].agg_cost
                    else if(newWays === 1)
                        ways.way2.cost = ksp_query_result[i].agg_cost
                    else ways.way3.cost = ksp_query_result[i].agg_cost
                    newWays++
                    continue
                }
                if(newWays === 0)
                    ways.way1.edges.push(ksp_query_result[i].edge)
                else if(newWays === 1)
                    ways.way2.edges.push(ksp_query_result[i].edge)
                else ways.way3.edges.push(ksp_query_result[i].edge)
            }
        
            let way1Query = ways.way1.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way1.edges})`
            let way2Query = ways.way2.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way2.edges})`
            let way3Query = ways.way3.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way3.edges})`

            var clientQueryList = []
            var option = null

            if(way1Query === null){
                option = 0
            }
            else if(way2Query === null){
                clientQueryList = [client.query(way1Query)]
                option = 1
            }
            else if (way3Query === null){
                clientQueryList = [
                    client.query(way1Query),
                    client.query(way2Query)
                ]
                option = 2
            }
            else{
                clientQueryList = [
                    client.query(way1Query),
                    client.query(way2Query),
                    client.query(way3Query)
                ]
                option = 3
            }
            Promise.all(clientQueryList).then(function(results){
                switch(option){
                    case 0:

                        break
                    case 1:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    case 2:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way2.edges = results[1].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    case 3:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way2.edges = results[1].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way3.edges = results[2].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    default:
                        console.error(getCurrentDateTime() + "Error in mapping results endpoint: " + endpoints.shortestKPathsOnDistanceEndpoint)
                }
                // console.log(ways)
                res.send(ways);
            })
        } 
        else {
            res.send(getCurrentDateTime() + 'Error finding the route: ' + err.message);
        }
        client.end;
        console.log(getCurrentDateTime(), 'Done');
    });
})

app.post(endpoints.shortestKPathsOnTimeEndpointManyLimits, (req, res) => {
    console.log(getCurrentDateTime(), 'Handling ', endpoints.shortestKPathsOnTimeEndpointManyLimits, ' request...')
    const params = req.body

    console.log("params ", params)

    let ways = {
        way1: {
            edges: [],
            cost: null
        },
        way2: {
            edges: [],
            cost: null
        },
        way3: {
            edges: [],
            cost: null
        }
    }
    // res.send(ways)

    let queryWay1 = `select * from __dijkstra_time(${params.startId}, ${params.targetId}, ${params.speedLimits.limit1})`
    let queryWay2 = `select * from __dijkstra_time(${params.startId}, ${params.targetId}, ${params.speedLimits.limit2})`
    let queryWay3 = null

    let dijkstraQueryList = []

    if(params.noOfRoads === 3){
        queryWay3 = `select * from __dijkstra_time(${params.startId}, ${params.targetId}, ${params.speedLimits.limit3})`
        dijkstraQueryList = [
            client.query(queryWay1),
            client.query(queryWay2),
            client.query(queryWay3),
        ]
    }
    else {
        dijkstraQueryList = [
            client.query(queryWay1),
            client.query(queryWay2)
        ]
    }
    Promise.all(dijkstraQueryList).then(function(results){
        for(let i = 0; i < results[0].rows.length; i++){
            if(i === results[0].rows.length - 1)
                ways.way1.cost = results[0].rows[i].agg_cost
            ways.way1.edges.push(results[0].rows[i].edge)
        }
        for(let i = 0; i < results[1].rows.length; i++){
            if(i === results[1].rows.length - 1)
                ways.way2.cost = results[1].rows[i].agg_cost
            ways.way2.edges.push(results[1].rows[i].edge)
        }
        if(params.noOfRoads === 3){
            for(let i = 0; i < results[2].rows.length; i++){
                if(i === results[2].rows.length - 1)
                    ways.way3.cost = results[2].rows[i].agg_cost
                ways.way3.edges.push(results[2].rows[i].edge)
            }
        }

        // console.log('ways after first query: ', ways)

        let way1Query = ways.way1.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way1.edges})`
        let way2Query = ways.way2.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way2.edges})`
        let way3Query = ways.way3.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way3.edges})`

        let wayQueryList = []

        if(params.noOfRoads === 3 && way3Query !== null && way2Query !== null && way1Query !== null){
            wayQueryList = [
                client.query(way1Query),
                client.query(way2Query),
                client.query(way3Query),
            ]
        }
        else if(way2Query !== null && way1Query !== null){
            wayQueryList = [
                client.query(way1Query),
                client.query(way2Query)
            ]
        }
        else {
            console.warn(getCurrentDateTime(), 'WARNING: Given queries returned empty result list: \n', queryWay1, '\n', queryWay2, '\n', queryWay3)
            return res.send({
                way1: {
                    edges: [],
                    cost: null
                },
                way2: {
                    edges: [],
                    cost: null
                },
                way3: {
                    edges: [],
                    cost: null
                }
            })
        }
        // console.log('queries: \n', way1Query, '\n', way2Query, '\n', way3Query)
        // console.log(wayQueryList)
        Promise.all(wayQueryList).then(function(results){
            ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
            ways.way2.edges = results[1].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
            if(params.noOfRoads === 3)
                ways.way3.edges = results[2].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
            
            // console.log(ways) 
            console.log(getCurrentDateTime(), 'Done');
            return res.send(ways)
        })
    })
    client.end
})

app.post(endpoints.shortestKPathsOnDistanceEndpoint, (req, res) => {
    console.log(getCurrentDateTime(), 'Handling ', endpoints.shortestKPathsOnDistanceEndpoint, ' request...')
    const params = req.body

    console.log("params ", params)

    var ksp_query_result = null
    
    let ksp_query = `select * from __ksp_distance(${params.startId}, ${params.targetId}, ${params.noOfRoads});`

    client.query(ksp_query, (err, result) => {
        // console.log(result)
        if(!err) {
            ksp_query_result = result.rows

            var ways = {
                way1: {
                    edges: [],
                    cost: null
                },
                way2: {
                    edges: [],
                    cost: null
                },
                way3: {
                    edges: [],
                    cost: null
                }
            }
        
            var newWays = 0

            for(let i = 0; i < ksp_query_result.length; i++) {
                if(ksp_query_result[i].edge === '-1'){
                    if(newWays === 0)
                        ways.way1.cost = ksp_query_result[i].agg_cost
                    else if(newWays === 1)
                        ways.way2.cost = ksp_query_result[i].agg_cost
                    else ways.way3.cost = ksp_query_result[i].agg_cost
                    newWays++
                    continue
                }
                if(newWays === 0)
                    ways.way1.edges.push(ksp_query_result[i].edge)
                else if(newWays === 1)
                    ways.way2.edges.push(ksp_query_result[i].edge)
                else ways.way3.edges.push(ksp_query_result[i].edge)
            }
        
            // console.log(ways)
            let way1Query = ways.way1.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way1.edges})`
            let way2Query = ways.way2.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way2.edges})`
            let way3Query = ways.way3.edges.length === 0 ? null : `select ways.x1, ways.y1, ways.x2, ways.y2 from ways where ways.gid in (${ways.way3.edges})`

            var clientQueryList = []
            var option = null

            if(way1Query === null){
                option = 0
            }
            else if(way2Query === null){
                clientQueryList = [client.query(way1Query)]
                option = 1
            }
            else if (way3Query === null){
                clientQueryList = [
                    client.query(way1Query),
                    client.query(way2Query)
                ]
                option = 2
            }
            else{
                clientQueryList = [
                    client.query(way1Query),
                    client.query(way2Query),
                    client.query(way3Query)
                ]
                option = 3
            }
            
            Promise.all(clientQueryList).then(function(results){
                switch(option){
                    case 0:
                        break
                    case 1:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    case 2:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way2.edges = results[1].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    case 3:
                        ways.way1.edges = results[0].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way2.edges = results[1].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        ways.way3.edges = results[2].rows.map(point => [[point.y1, point.x1],[point.y2, point.x2]])
                        break
                    default:
                        console.error(getCurrentDateTime() + "Error in mapping results endpoint: " + endpoints.shortestKPathsOnDistanceEndpoint)
                }
                // console.log(ways)
                console.log(getCurrentDateTime(), 'Done');
                res.send(ways);
            })

            
        } else {
            res.send(getCurrentDateTime() + 'Error finding the route: ' + err.message)
        }
        client.end;
    })
})

app.post(endpoints.closestPointEndpoint, (req, res) => {
    console.log(getCurrentDateTime(), 'Handling ', endpoints.closestPointEndpoint, ' request')
    const point = req.body
    // console.log(point)

    let closestPointQuery = `SELECT pt.id, pt.lon, pt.lat
        FROM points pt
        WHERE ST_DWithin(pt.the_geom, 'SRID=4326;POINT(${point.lng} ${point.lat})', 0.1)
        ORDER BY ST_Distance(pt.the_geom, 'SRID=4326;POINT(${point.lng} ${point.lat})')
        LIMIT 1;`

    client.query(closestPointQuery, (err, result) => {
        // console.log(result)
        if(!err) {
            res.send(result.rows)
        } else {
            res.send(getCurrentDateTime() + 'Error finding the route: ' + err.message)
        }
        client.end;
    })
    console.log(getCurrentDateTime(), 'Done');
})

app.listen(3300, () => {
    console.log('...\nserver listening at port 3300');
})

client.connect()