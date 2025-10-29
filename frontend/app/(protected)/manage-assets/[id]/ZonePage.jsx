"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/Assets.module.css";
import { postDataAPI } from "@/utils/fetchData";

const ZonePage = ({ id }) => {
    const [zone, setZone] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authState] = useState({ access_token: "" });

    const fetchZone = async () => {
        try {
            setLoading(true);
            const response = await postDataAPI(
                `/api/v1/fetch-zone`,
                { id },
                false,
                authState.access_token,
                "application/json"
            );
            setZone(response.data);
        } catch (error) {
            console.error("Error fetching zone:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZone();
    }, [id]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Active": return "linear-gradient(135deg, #4CAF50, #2E7D32)";
            case "Maintenance": return "linear-gradient(135deg, #FFC107, #FFA000)";
            case "Shutdown": return "linear-gradient(135deg, #F44336, #D32F2F)";
            default: return "linear-gradient(135deg, #9E9E9E, #616161)";
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!zone) return <p>No zone data found.</p>;

    return (
        <div className={styles.zone_page}>
            {/* --- Header --- */}
            <div className={styles.zone_header}>
                <div className={styles.zone_title}>
                    <h1>{zone.name}</h1>
                    <span>{zone.zoneType}</span>
                </div>
                <div className={styles.zone_status}>
                    <div
                        className={styles.zone_status_dot}
                        style={{ background: getStatusColor(zone.status) }}
                    ></div>
                    <p>{zone.status}</p>
                </div>
            </div>

            {/* --- Zone Info --- */}
            <div className={styles.zone_grid}>
                <div className={styles.zone_card}><h3>Description</h3><p>{zone.description || "N/A"}</p></div>
                <div className={styles.zone_card}><h3>Fire Suppression</h3><p>{zone.fireSuppressionSystem}</p></div>
                <div className={styles.zone_card}><h3>Ventilation</h3><p>{zone.ventilation}</p></div>
                <div className={styles.zone_card}><h3>Risk Score</h3><p>{zone.riskScore}</p></div>
                <div className={styles.zone_card}><h3>Coordinates</h3><p>{zone.location?.coordinates?.join(", ")}</p></div>
                <div className={styles.zone_card}><h3>Created</h3><p>{new Date(zone.createdAt).toLocaleString()}</p></div>
                <div className={styles.zone_card}><h3>Last Updated</h3><p>{new Date(zone.updatedAt).toLocaleString()}</p></div>
            </div>

            {/* --- Tanks --- */}
            {zone.tanks?.length > 0 && (
                <div className={styles.zone_section}>
                    <h2>🛢️ Tanks</h2>
                    {zone.tanks.map((t) => (
                        <div key={t._id} className={styles.asset_card}>
                            <h3>{t.name}</h3>
                            <p><strong>Type:</strong> {t.tankType}</p>
                            <p><strong>Material:</strong> {t.material}</p>
                            <p><strong>Capacity:</strong> {t.capacityLiters} L</p>
                            <p><strong>Current Level:</strong> {t.currentLevelLiters} L</p>
                            <p><strong>Pressure Rating:</strong> {t.pressureRating}</p>
                            <p><strong>Temperature Limit:</strong> {t.temperatureLimit}</p>
                            <p><strong>Corrosion Status:</strong> {t.corrosionStatus}</p>
                            <p><strong>Leak Detected:</strong> {t.leakDetected ? "Yes" : "No"}</p>
                            <p><strong>Risk Score:</strong> {t.riskScore}</p>
                            <p><strong>Last Inspection:</strong> {new Date(t.lastInspection).toLocaleString()}</p>
                            <h4>🔍 Sensors</h4>

                            {/* --- Sensors for this Tank --- */}
                            {t.sensors?.length > 0 && (
                                <div className={styles.sensor_list}>
                                    {t.sensors.map((s) => (
                                        <div key={s._id} className={styles.sensor_card}>
                                            <p><strong>Name:</strong> {s.name}</p>
                                            <p><strong>Type:</strong> {s.sensorType}</p>
                                            <p><strong>Status:</strong> {s.status}</p>
                                            <p><strong>Battery:</strong> {s.batteryLevel}%</p>
                                            <p><strong>Signal:</strong> {s.signalStrength}%</p>
                                            <p><strong>Anomaly Score:</strong> {s.anomalyScore}</p>
                                            <p><strong>Last Reading:</strong> {s.lastReading}</p>
                                            <p><strong>Updated:</strong> {new Date(s.lastUpdated).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- Lines --- */}
            {zone.lines?.length > 0 && (
                <div className={styles.zone_section}>
                    <h2>⚙️ Lines</h2>
                    {zone.lines.map((l) => (
                        <div key={l._id} className={styles.asset_card}>
                            <h3>{l.name}</h3>
                            <p><strong>Type:</strong> {l.lineType}</p>
                            <p><strong>Material:</strong> {l.material}</p>
                            <p><strong>Length:</strong> {l.lengthMeters} m</p>
                            <p><strong>Diameter:</strong> {l.diameterMm} mm</p>
                            <p><strong>Pressure Rating:</strong> {l.pressureRating}</p>
                            <p><strong>Temperature Rating:</strong> {l.temperatureRating}</p>
                            <p><strong>Corrosion Status:</strong> {l.corrosionStatus}</p>
                            <p><strong>Risk Score:</strong> {l.riskScore}</p>
                            <p><strong>Last Inspection:</strong> {new Date(l.lastInspection).toLocaleString()}</p>

                            <h4>📡 Sensors</h4>
                            {/* --- Sensors for this Line --- */}
                            {l.sensors?.length > 0 && (
                                <div className={styles.sensor_list}>
                                    {l.sensors.map((s) => (
                                        <div key={s._id} className={styles.sensor_card} data-status={s.status}>
                                            <p><strong>Name:</strong> {s.name}</p>
                                            <p><strong>Type:</strong> {s.sensorType}</p>
                                            <p><strong>Status:</strong> {s.status}</p>
                                            <p><strong>Battery:</strong> {s.batteryLevel}%</p>
                                            <p><strong>Signal:</strong> {s.signalStrength}%</p>
                                            <p><strong>Anomaly Score:</strong> {s.anomalyScore}</p>
                                            <p><strong>Last Reading:</strong> {s.lastReading}</p>
                                            <p><strong>Updated:</strong> {new Date(s.lastUpdated).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ZonePage;
