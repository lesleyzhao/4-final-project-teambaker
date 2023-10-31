import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, GeoJSON } from 'react-leaflet'
import { Icon } from 'leaflet';
import InfoCard from '../../components/common/InfoCard';
import TimelineBar from '../../components/timeline/TimelineBar';
import { useOutletContext } from "react-router-dom"
// import countries from '../../util/data/countries.json'

const MainMap = () => {
  const [position, setPosition] = useState([51.505, -0.09])

  // const countryStyle = {
  //   color: "black",
  //   weight: 0.3,
  //   opacity: 1,
  // };
    
  return(
    <>
    <div className="flex justify-center items-center">
      <InfoCard title="Welcome!" text="Click anywhere on the map to start your European art & music journey! Let's get started!"/>
      <InfoCard title="What to do :)" text="Click the map for random art or drag the timeline to view map evolution over the history!"/>
   </div>

   <div className='mb-3'><TimelineBar></TimelineBar></div>
   </div> 

      
      <MapContainer className='mapContainer' center={position} zoom={4} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition}/>
        {/* <GeoJSON data={countries} style={countryStyle} /> */}
      </MapContainer>
    </>
  )
}

function LocationMarker(props) {
  const [, foundData, setFoundData] = useOutletContext()
  useMapEvents({
    click(evt) {
      const pos = [evt.latlng.lat, evt.latlng.lng]
      props.setPosition(pos)
      // TODO: subject to change
      setFoundData(pos)
      foundData && setFoundData("")
    },
  })
  const customIcon = new Icon({
    iconUrl: "/mapicon.png",
    iconSize: [38, 38],
  });
  return(
    <Marker icon={customIcon} position={props.position}>
      {/* <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup> */}
    </Marker>

  )
}


export default MainMap