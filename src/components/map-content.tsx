'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapContentProps {
    activityData: any;
}

export function MapContent({ activityData }: MapContentProps) {
    const latitude = activityData?.Location?.latitude || 51.505;
    const longitude = activityData?.Location?.longitude || -0.09;
    const title = activityData?.Title || 'Activity';

    console.log('Map rendering with:', { latitude, longitude, title, activityData });

    return (
        <div className="w-full h-screen">
            <MapContainer 
                center={[latitude, longitude]} 
                zoom={13} 
                scrollWheelZoom={false}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        {title}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
