import React, { useRef, useEffect } from 'react';

/**
 * MapPicker - Google Maps location picker component
 * Props:
 *   value: { latitude, longitude }
 *   onChange: (coords) => void
 */
const MapPicker = ({ value, onChange, height = 300 }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        // Load Google Maps script if not already loaded
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
            script.async = true;
            script.onload = initMap;
            document.body.appendChild(script);
        } else {
            initMap();
        }
        function initMap() {
            if (!mapRef.current) return;
            const center = {
                lat: value.latitude || 28.6139,
                lng: value.longitude || 77.2090,
            };
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center,
                zoom: 13,
            });
            markerRef.current = new window.google.maps.Marker({
                position: center,
                map: mapInstance.current,
                draggable: true,
            });
            // On marker drag
            markerRef.current.addListener('dragend', (e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                onChange({ latitude: lat, longitude: lng });
            });
            // On map click
            mapInstance.current.addListener('click', (e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                markerRef.current.setPosition({ lat, lng });
                onChange({ latitude: lat, longitude: lng });
            });
        }
        // Cleanup
        return () => {
            if (markerRef.current) markerRef.current.setMap(null);
            if (mapInstance.current) mapInstance.current = null;
        };
        // eslint-disable-next-line
    }, []);

    // Update marker if value changes
    useEffect(() => {
        if (markerRef.current && value.latitude && value.longitude) {
            markerRef.current.setPosition({ lat: value.latitude, lng: value.longitude });
            mapInstance.current.setCenter({ lat: value.latitude, lng: value.longitude });
        }
    }, [value.latitude, value.longitude]);

    return <div ref={mapRef} style={{ width: '100%', height }} />;
};

export default MapPicker;
