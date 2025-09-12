import { Map, MapMarker } from "react-kakao-maps-sdk"

export function MapLayout(...props: any) {
  console.log('[map-layout] props ... ', props);
  return (
    <Map
      center={{ lat: 37.497419, lng: 127.026605 }}
      style={{ width: "100%", height: "360px" }}
    >
      <MapMarker position={{ lat: 37.497419, lng: 127.026605 }}>
        <div style={{ color: "#000" }}>박창수안과의원</div>
      </MapMarker>
    </Map>
  )

  // return (
  //   <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
  //     {/* Map Header */}
  //     <div className="bg-blue-50 p-4 border-b border-gray-200">
  //       <div className="flex items-center gap-2">
  //         <MapPin className="w-5 h-5 text-blue-600" />
  //         <h3 className="font-semibold text-gray-900">Nearby Healthcare Facilities</h3>
  //       </div>
  //       <p className="text-sm text-gray-600 mt-1">Find medical care near your location</p>
  //     </div>

  //     {/* Mock Map Area */}
  //     <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
  //       <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

  //       {/* Mock location pins */}
  //       {facilities.map((facility, index) => (
  //         <div
  //           key={facility.id}
  //           className={`absolute w-6 h-6 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
  //             selectedFacility?.id === facility.id ? "z-10" : ""
  //           }`}
  //           style={{
  //             left: `${20 + index * 25}%`,
  //             top: `${30 + index * 15}%`,
  //           }}
  //           onClick={() => handleFacilityClick(facility)}
  //         >
  //           <div
  //             className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
  //               facility.type === "Hospital"
  //                 ? "bg-red-500"
  //                 : facility.type === "Emergency"
  //                   ? "bg-orange-500"
  //                   : "bg-blue-500"
  //             }`}
  //           >
  //             <div className="w-2 h-2 bg-white rounded-full"></div>
  //           </div>
  //         </div>
  //       ))}

  //       {/* User location pin */}
  //       {userLocation && (
  //         <div
  //           className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
  //           style={{ left: "50%", top: "50%" }}
  //         >
  //           <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
  //         </div>
  //       )}
  //     </div>

  //     {/* Facilities List */}
  //     <div className="max-h-64 overflow-y-auto">
  //       {facilities.map((facility) => (
  //         <div
  //           key={facility.id}
  //           className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
  //             selectedFacility?.id === facility.id ? "bg-blue-50 border-blue-200" : ""
  //           }`}
  //           onClick={() => handleFacilityClick(facility)}
  //         >
  //           <div className="flex items-start justify-between">
  //             <div className="flex-1">
  //               <div className="flex items-center gap-2">
  //                 <h4 className="font-medium text-gray-900">{facility.name}</h4>
  //                 <span
  //                   className={`px-2 py-1 text-xs rounded-full ${
  //                     facility.type === "Hospital"
  //                       ? "bg-red-100 text-red-700"
  //                       : facility.type === "Emergency"
  //                         ? "bg-orange-100 text-orange-700"
  //                         : "bg-blue-100 text-blue-700"
  //                   }`}
  //                 >
  //                   {facility.type}
  //                 </span>
  //               </div>
  //               <p className="text-sm text-gray-600 mt-1">{facility.address}</p>
  //               <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
  //                 <div className="flex items-center gap-1">
  //                   <Navigation className="w-3 h-3" />
  //                   {facility.distance}
  //                 </div>
  //                 <div className="flex items-center gap-1">
  //                   <Clock className="w-3 h-3" />
  //                   {facility.hours}
  //                 </div>
  //                 <div className="flex items-center gap-1">
  //                   <Phone className="w-3 h-3" />
  //                   {facility.phone}
  //                 </div>
  //               </div>
  //             </div>
  //             <Button
  //               size="sm"
  //               variant="outline"
  //               onClick={(e) => {
  //                 e.stopPropagation()
  //                 getDirections(facility)
  //               }}
  //               className="ml-2"
  //             >
  //               <Navigation className="w-3 h-3 mr-1" />
  //               Directions
  //             </Button>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // )
}