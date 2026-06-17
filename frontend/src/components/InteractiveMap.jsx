import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Compass } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function InteractiveMap({ location, lat = 22.7196, lng = 75.8577 }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const [map, setMap] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds({ lat, lng });
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full aspect-video rounded-[3rem] bg-black/5 animate-pulse" />;

  return (
    <div className="relative w-full aspect-video rounded-[4rem] overflow-hidden shadow-2xl border border-surface-variant dark:border-dark-surface-variant group">
      {/* Header Overlay */}
      <div className="absolute top-8 left-8 z-10 flex items-center gap-4 pointer-events-none">
        <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md shadow-xl flex items-center justify-center text-primary dark:text-dark-primary border border-white/20">
          <Navigation className="w-6 h-6" />
        </div>
        <div className="glass dark:glass-dark px-6 py-2 rounded-2xl border border-white/30">
          <h3 className="font-black text-primary dark:text-white text-xs uppercase tracking-widest">{location || "Central India"}</h3>
          <p className="text-[10px] font-bold text-primary/40 dark:text-white/40 uppercase tracking-widest">Neighborhood precision</p>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat, lng }}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
            styles: mapTheme,
            disableDefaultUI: true,
            zoomControl: false,
        }}
      >
        <Marker 
            position={{ lat, lng }} 
            onClick={() => setShowInfo(true)}
            icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                fillColor: "#B8860B",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF",
                scale: 1.5,
                anchor: new window.google.maps.Point(12, 22)
            }}
        />

        {showInfo && (
            <InfoWindow position={{ lat, lng }} onCloseClick={() => setShowInfo(false)}>
                <div className="p-2 min-w-[150px]">
                    <h4 className="font-black text-primary uppercase text-xs mb-1">{location}</h4>
                    <p className="text-[10px] font-bold text-gray-500">Premium Estate Location</p>
                </div>
            </InfoWindow>
        )}
      </GoogleMap>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-3">
        <button className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md shadow-xl flex items-center justify-center text-primary dark:text-dark-primary border border-white/20 hover:scale-110 transition-all">
            <Compass className="w-6 h-6" />
        </button>
        <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-accent transition-all">
            Get Directions
        </button>
      </div>
    </div>
  );
}

const mapTheme = [
    { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
    { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];
