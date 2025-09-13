import { useState } from "react"
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useChatToken, useUserInfo, useMedicalDepartments, useChatRoom } from "@/lib/store";

export function MapLayout(...props: any) {
  console.log('[map-layout] props ... ', props);

  const { latitude, longitude, hospitalName, hospitalAddress, hospitalPhone } = props[0];

  // user 위치
  const userLat = useUserInfo((s) => s.latitude) || 0;
  const userLng = useUserInfo((s) => s.longitude) || 0;

  //
  const [isOpen, setIsOpen] = useState(false)

  const [mapPins, setMapPins] = useState([]);

  const [lat, setLat] = useState(latitude || 0);
  const [lng, setLng] = useState(longitude || 0);

  return (
    <Map
      center={{ lat, lng }}
      style={{ width: "100%", height: "360px" }}
    >
      <MapMarker
        position={{ lat, lng }}
        title={hospitalName}
        onClick={() => setIsOpen(true)}   // 클릭 이벤트
      >
        {isOpen && (
          <div style={{ padding: "8px", color: "#000", background: "#fff" }}>
            <b>{hospitalName}</b>
            <p>{hospitalAddress}</p>
            <p>{hospitalPhone}</p>
          </div>
        )}
      </MapMarker>
    </Map>
  )
}