import React, { useState, useEffect } from 'react'
import './App.css';
import MyMap from './map/MyMap.js'
import Header from './components/Header.js'


function App() {
  const endpoints = require('./database/contract.js')
  const apiServer = 'http://127.0.0.1:3300'
  // const apiServer = 'http://25.56.64.63:3300'
  const defaultWays = {
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
  
  const [noOfRoads, setNoOfRoads] = useState(1)
  const [limit1, setLimit1] = useState(0)
  const [limit2, setLimit2] = useState(0)
  const [limit3, setLimit3] = useState(0)
  const [timePriority, setTimePriority] = useState(false)

  const [startPosApp, setStartPosApp] = useState(null)
  const [targetPosApp, setTargetPosApp] = useState(null)
  const [start, setStart] = useState(null)
  const [target, setTarget] = useState(null)

  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false)

  const [ways, setWays] = useState(defaultWays)
  const [emptyResult, setEmptyResult] = useState(false)


  const isWayEmpty = (route) => {
    return route.way1.edges.length === 0 &&
            route.way2.edges.length === 0 &&
            route.way3.edges.length === 0 &&
            route.way1.cost === null &&
            route.way2.cost === null &&
            route.way3.cost === null;
  }

  const runAlgorithm = () => {
    setClicked(true)
  }

  const fetchShortestKPathsOnTimeNoLimit = () => {
    const requestBody = {
      startId: parseInt(start[0].id),
      targetId: parseInt(target[0].id),
      noOfRoads: noOfRoads
    }
    setIsLoading(true)
    fetch(apiServer + endpoints.shortestKPathsOnTimeEndpointNoLimit, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })
        .then(res => {
          if(res.ok) {
            return res.json();
          }
        })
        .then(closestRoutes => {
          // console.log("new closest route: ", closestRoutes)
          if(isWayEmpty(closestRoutes)){
            setEmptyResult(true)
          }
          setWays(closestRoutes)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('ERROR in fetching closest way: ', error)
          setIsLoading(false)
        })
  }

  const fetchShortestKPathsOnTimeSingleLimit = (limit) => {
    const requestBody = {
      startId: parseInt(start[0].id),
      targetId: parseInt(target[0].id),
      speedLimit: limit,
      noOfRoads: noOfRoads
    }
    setIsLoading(true)

    fetch(apiServer + endpoints.shortestKPathsOnTimeEndpointSingleLimit, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(res => {
      if(res.ok) {
        return res.json();
      }
    })
    .then(closestRoutes => {
      // console.log("new closest route: ", closestRoutes)
      if(isWayEmpty(closestRoutes)){
        setEmptyResult(true)
      }
      setWays(closestRoutes)
      setIsLoading(false)
    })
    .catch(error => {
      console.error('ERROR in fetching closest way: ', error)
      setIsLoading(false)
    })

  }

  const fetchShortestKPathsOnTimeManyLimits = (limits) => {
    const requestBody = {
      startId: parseInt(start[0].id),
      targetId: parseInt(target[0].id),
      speedLimits: limits,
      noOfRoads: noOfRoads
    }
    setIsLoading(true)

    fetch(apiServer + endpoints.shortestKPathsOnTimeEndpointManyLimits, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(res => {
      if(res.ok) {
        return res.json();
      }
    })
    .then(closestRoutes => {
      // console.log("new closest route: ", closestRoutes)
      if(isWayEmpty(closestRoutes)){
        setEmptyResult(true)
      }
      setWays(closestRoutes)
      setIsLoading(false)
    })
    .catch(error => {
      console.error('ERROR in fetching closest way: ', error)
      setIsLoading(false)
    })

  }

  const fetchShortestKPathsOnDistance = () => {
    const requestBody = {
      startId: parseInt(start[0].id),
      targetId: parseInt(target[0].id),
      noOfRoads: noOfRoads
    }
    setIsLoading(true)
    fetch(apiServer + endpoints.shortestKPathsOnDistanceEndpoint, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(res => {
      if(res.ok) {
        return res.json();
      }
    })
    .then(closestRoutes => {
      // console.log("new closest route: ", closestRoutes)
      if(isWayEmpty(closestRoutes)){
        setEmptyResult(true)
      }
      setWays(closestRoutes)
      setIsLoading(false)
    })
    .catch(error => {
      console.error('ERROR in fetching closest way: ', error)
      setIsLoading(false)
    })
  }

  const fetchStartPoint = () => {
    fetch(apiServer + endpoints.closestPointEndpoint, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(startPosApp)
    })
    .then(res => {
      if(res.ok) {
        return res.json();
      }
    })
    .then(closestPoint => {
      console.log("new closest start point: ", closestPoint)
      setStart(closestPoint)
    })
    .catch(error => {
      // console.error('ERROR in fetching start closest point: ', error)
    })
  }

  const fetchTargetPoint = () => {
    fetch(apiServer + endpoints.closestPointEndpoint, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(targetPosApp)
    })
    .then(res => {
      if(res.ok) {
        return res.json();
      }
    })
    .then(closestPoint => {
      console.log("new closest target point: ", closestPoint)
      setTarget(closestPoint)})
    .catch(error => {
      // console.error('ERROR in fetching target closest point: ', error)
    })
  }

  useEffect(() => {
    if(startPosApp !== null) {
      fetchStartPoint()
    }
  }, [startPosApp]);

  useEffect(() => {
    if(targetPosApp !== null) {
      fetchTargetPoint()
    }
  }, [targetPosApp]);

  useEffect(() => {
    if(clicked && targetPosApp !== null && startPosApp !== null){
      if(timePriority){
        if(noOfRoads === 1){
          if(limit1 === 0)
            fetchShortestKPathsOnTimeNoLimit()
          else
            fetchShortestKPathsOnTimeSingleLimit(limit1)
        }
        else if(noOfRoads === 2){
          if(limit1 === 0 && limit2 === 0){ // 0 limitów
            fetchShortestKPathsOnTimeNoLimit()
          } 
          else if(limit1 !== 0 && limit2 !== 0){ // 2 limity
            let speedLimits = {
              limit1: limit1,
              limit2: limit2
            }
            fetchShortestKPathsOnTimeManyLimits(speedLimits)
          } 
          else { // 1 limit
            let speedLimit = limit1 !== 0 ? limit1 : limit2
            fetchShortestKPathsOnTimeSingleLimit(speedLimit)
          }
        }
        else {  // 3 drogi
          if(limit1 === 0 && limit2 === 0 && limit3 === 0) { // 0 limitów
            fetchShortestKPathsOnTimeNoLimit()
          }
          else if(limit1 !== 0 && limit2 !== 0 && limit3 !== 0){  // 3 limity
            let speedLimits = {
              limit1: limit1,
              limit2: limit2,
              limit3: limit3
            }
            fetchShortestKPathsOnTimeManyLimits(speedLimits)
          }
          else if((limit1 !== 0 && limit2 === 0 && limit3 === 0) ||
          (limit1 === 0 && limit2 !== 0 && limit3 === 0) ||
          (limit1 === 0 && limit2 === 0 && limit3 !== 0)) { // 1 limit
            let speedLimit = limit1 !== 0 ? limit1 : limit2 !== 0 ? limit2 : limit3
            fetchShortestKPathsOnTimeSingleLimit(speedLimit)
          }
          else { // 2 limity - wybrane zostanie dla jednego limitu, pierwszego od prawej
            let speedLimit = limit1 !== 0 ? limit1 : limit2 !== 0 ? limit2 : limit3
            fetchShortestKPathsOnTimeSingleLimit(speedLimit)
          }
        }
      } else {
        fetchShortestKPathsOnDistance()
      }
      // fetchClosestWay()
      setClicked(false)
    }
  }, [clicked]);

  return (
    <div>
      <Header 
        noOfRoads={noOfRoads}
        setNoOfRoads={setNoOfRoads}
        limit1={limit1}
        setLimit1={setLimit1}
        limit2={limit2}
        setLimit2={setLimit2}
        limit3={limit3}
        setLimit3={setLimit3}
        timePriority={timePriority}
        setTimePriority={setTimePriority}
        isLoading={isLoading} 
        start={startPosApp} 
        target={targetPosApp} 
        ways={ways}
        emptyResult={emptyResult}
        setEmptyResult={setEmptyResult}
        clickSend={runAlgorithm}>
      </Header>
      <MyMap 
        setStartPosApp={setStartPosApp} 
        setTargetPosApp={setTargetPosApp} 
        ways={ways} 
        setWays={setWays}>
      </MyMap>
      {/* {isLoading ? <LoadingSpinner className={'spinner'}/> : null} */}
    </div>
  );
}

export default App;
