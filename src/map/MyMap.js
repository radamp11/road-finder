import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet'
import L from 'leaflet'
import './MyMap.css'

const MyMap = ({setStartPosApp, setTargetPosApp, ways, setWays}) => {
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

  const [startPos, setStartPos] = useState(null)
  const [targetPos, setTargetPos] = useState(null) 

  let startIcon = L.icon({
    iconUrl: process.env.PUBLIC_URL + 'start_icon.png',
    iconSize: [30, 30],
  })

  const HandleMapClick = () => {
    const map = useMapEvents({
      click(e){
        if(startPos === null && targetPos === null) {
          setStartPos(e.latlng)
          setStartPosApp(e.latlng)
        }
        else if(startPos !== null && targetPos === null) {
          setTargetPos(e.latlng)
          setTargetPosApp(e.latlng)
        }
        else if(startPos !== null && targetPos !== null) {
          setStartPos(null)
          setStartPosApp(null)
          setTargetPos(null)
          setTargetPosApp(null)
          setWays(defaultWays)
        }
      }
    })
    // setStartPosApp()
    // setTargetPosApp()
    // console.log('startPos: ', startPos)
    // console.log('targetPos: ', targetPos)
  }

  const DrawStartPoint = () => {
    return startPos !== null ?
    (
      <Marker
        key={'start'}
        position={[startPos.lat, startPos.lng]}
        icon={startIcon}>
      </Marker>
    )
    :
    null
  }

  const DrawTargetPoint = () => {
    return targetPos !== null ?
    (
      <Marker
        key={'target'}
        position={[targetPos.lat, targetPos.lng]}>
      </Marker>
    )
    :
    null
  }

  return (
    <MapContainer 
      className='leaflet-container' 
      center={[52, 20]} 
      zoom={7} 
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

      <HandleMapClick/>

      <DrawStartPoint/>
      <DrawTargetPoint/>

      {ways.way3.edges === null || ways.way3.edges.length === 0 ? null : <Polyline positions={ways.way3.edges} color={'red'}/>}
      {ways.way2.edges === null || ways.way2.edges.length === 0 ? null : <Polyline positions={ways.way2.edges} color={'blue'}/>}
      {ways.way1.edges === null || ways.way1.edges.length === 0 ? null : <Polyline positions={ways.way1.edges} color={'green'}/>}

    </MapContainer> 
  )
}

export default MyMap