import { useState } from "react"
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useChatToken, useUserInfo, useMedicalDepartments, useChatRoom } from "@/lib/store";

export function MapLayout(...props: any) {
  console.log('[map-layout] props ... ', props);

  // const { name, address } = props[0];
  const { latitude, longitude, hospitalName } = props[0];

  // user 위치
  const userLat = useUserInfo((s) => s.latitude) || 0;
  const userLng = useUserInfo((s) => s.longitude) || 0;

  const [mapPins, setMapPins] = useState([]);

  const [lat, setLat] = useState(latitude || 0);
  const [lng, setLng] = useState(longitude || 0);

  return (
    <Map
      center={{ lat: userLat, lng: userLng }}
      style={{ width: "100%", height: "360px" }}
    >
      <MapMarker
        position={{ lat, lng }}
        title={hospitalName}
      >
        <div style={{ color: "#000" }}>1</div>
      </MapMarker>
    </Map>
  )
}