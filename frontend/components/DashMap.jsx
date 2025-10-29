"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "@/contexts/authContext";
import { postDataAPI } from "@/utils/fetchData";

const getEmojiForStatus = (status) => {
    switch (status) {
        case "Active":
            return "📍";
        case "Maintenance":
            return "⚙️";
        default:
            return "❌";
    }
};

// 🗺️ Animated fit to bounds on first load
const FitMapToBounds = ({ factories }) => {
    const map = useMap();
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!factories || factories.length === 0) return;

        const validCoords = factories
            .filter(f => f.location && f.location.coordinates?.length === 2)
            .map(f => [f.location.coordinates[0], f.location.coordinates[1]]);

        if (validCoords.length > 0 && !hasAnimated.current) {
            hasAnimated.current = true;
            const bounds = L.latLngBounds(validCoords);

            // First reset to world view
            map.setView([20.5937, 78.9629], 3);

            setTimeout(() => {
                map.flyToBounds(bounds, {
                    padding: [30, 30],
                    duration: 2.5,
                });
            }, 1000);
        }
    }, [factories, map]);

    return null;
};

const fetchWeatherData = async (lat, lon) => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error("Weather fetch failed");
        return await response.json();
    } catch (err) {
        console.error("Error fetching weather:", err);
        return null;
    }
};

const DashMap = ({ setCurrZone }) => {
    const [factories, setFactories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({});
    const { authState } = useAuth();
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchFactories = async () => {
            try {
                setLoading(true);
                const response = await postDataAPI(
                    `/api/v1/fetch-zones`,
                    {},
                    false,
                    authState.access_token,
                    "application/json"
                );

                setFactories(response?.data || []);
            } catch (err) {
                console.error("Error fetching factories:", err);
                setFactories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFactories();
    }, [authState.access_token]);

    const handleMarkerClick = async (factory) => {
        const [lat, lng] = factory.location.coordinates;
        if (!lat || !lng) return;

        const map = mapRef.current;
        if (map) {
            map.flyTo([lat, lng], 10, { duration: 2 });
        }

        let weatherData = weather[factory._id];
        if (!weatherData) {
            weatherData = await fetchWeatherData(lat, lng);
            if (weatherData) {
                setWeather(prev => ({ ...prev, [factory._id]: weatherData }));
            }
        }

        setCurrZone({
            ...factory,
            weather: weatherData,
        });
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={4}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
                whenCreated={(mapInstance) => {
                    mapRef.current = mapInstance;
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                />

                <FitMapToBounds factories={factories} />

                {!loading &&
                    factories.map((factory) => {
                        if (!factory.location?.coordinates) return null;
                        const [lat, lng] = factory.location.coordinates;
                        if (isNaN(lat) || isNaN(lng)) return null;

                        const weatherData = weather[factory._id];
                        return (
                            <Marker
                                key={factory._id}
                                position={[lat, lng]}
                                icon={L.divIcon({
                                    className: "emoji-marker",
                                    html: `<div style="font-size: 40px; text-align: center;">${getEmojiForStatus(factory.status)}</div>`,
                                })}
                                eventHandlers={{
                                    click: () => handleMarkerClick(factory),
                                }}
                            >
                                <Popup>
                                    <b>{factory.name}</b>
                                    <br />
                                    <b>Status:</b> {factory.status}
                                    <br />
                                    <b>Description:</b> {factory.description || "N/A"}
                                    <br />
                                    <b>Risk:</b> {factory.riskScore ?? 0}
                                    <hr />
                                    {weatherData ? (
                                        <>
                                            <b>🌡 Temp:</b> {weatherData.main.temp}°C <br />
                                            <b>💨 Wind:</b> {weatherData.wind.speed} m/s <br />
                                            <b>☁️ Conditions:</b> {weatherData.weather[0].description}
                                        </>
                                    ) : (
                                        <i>Click marker to load weather...</i>
                                    )}
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>
        </div>
    );
};

export default DashMap;
