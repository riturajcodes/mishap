"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard.module.css";
import DashMap from "@/components/DashMap";
import { useAuth } from "@/contexts/authContext";
import { postDataAPI } from "@/utils/fetchData";

const Dashboard = () => {
    const { authState } = useAuth();
    const [currZone, setCurrZone] = useState(null);
    const [loadingRisk, setLoadingRisk] = useState(false);

    const fetchZone = async () => {
        if (!currZone?._id) return;
        try {
            setLoadingRisk(true);
            const response = await postDataAPI(
                `/api/v1/fetch-zone-risk`,
                { zoneId: currZone._id },
                false,
                authState.access_token,
                "application/json"
            );

            setCurrZone((prev) => ({
                ...prev,
                risks: response?.data?.risks || [],
            }));
        } catch (error) {
            console.error("Error fetching zone risk:", error);
        } finally {
            setLoadingRisk(false);
        }
    };

    useEffect(() => {
        if (currZone?._id) fetchZone();
    }, [currZone?._id]);

    const handleMitigate = async () => {
        alert(`Mitigation started for ${currZone.name}`);
        // TODO: Integrate mitigation API
    };

    return (
        <div className={styles.dash}>
            <DashMap currZone={currZone} setCurrZone={setCurrZone} />

            {currZone && (
                <div className={styles.dash_tile}>
                    <div className={styles.tile_header}>
                        <h2>{currZone.name}</h2>
                        <span
                            className={`${styles.status} ${currZone.status === "Active"
                                ? styles.active
                                : currZone.status === "Maintenance"
                                    ? styles.maintenance
                                    : styles.inactive
                                }`}
                        >
                            {currZone.status}
                        </span>
                    </div>

                    <div className={styles.tile_body}>
                        <p className={styles.desc}>
                            {currZone.description || "No description available."}
                        </p>

                        {/* 🌦 Weather Section */}
                        {currZone.weather && (
                            <div className={styles.weather_section}>
                                <h3>🌦 Weather</h3>
                                <div className={styles.weather_grid}>
                                    <div>
                                        <span>Temperature</span>
                                        <strong>{currZone.weather.main.temp}°C</strong>
                                    </div>
                                    <div>
                                        <span>Wind</span>
                                        <strong>{currZone.weather.wind.speed} m/s</strong>
                                    </div>
                                    <div>
                                        <span>Condition</span>
                                        <strong>
                                            {currZone.weather.weather[0].description}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ⚠️ Risk Section */}
                        {loadingRisk ? (
                            <p className={styles.loading}>Loading risk data...</p>
                        ) : Array.isArray(currZone.risks) && currZone.risks.length > 0 ? (
                            <div className={styles.risk_section}>
                                <h3>⚠️ Risk Analysis</h3>
                                <div className={styles.risk_list}>
                                    {currZone.risks.map((risk) => (
                                        <div key={risk.id} className={styles.risk_card}>
                                            <div className={styles.risk_header}>
                                                <strong>{risk.riskType}</strong>
                                                <span
                                                    className={`${styles.risk_level} ${risk.riskLevel === "High"
                                                        ? styles.high
                                                        : risk.riskLevel === "Medium"
                                                            ? styles.medium
                                                            : styles.low
                                                        }`}
                                                >
                                                    {risk.riskLevel}
                                                </span>
                                            </div>
                                            <p>
                                                <b>Probability:</b> {risk.probability}
                                            </p>
                                            <p>
                                                <b>AI Suggestion:</b> {risk.aiSuggestion || "N/A"}
                                            </p>
                                            <p>
                                                <b>Recommended Action:</b>{" "}
                                                {risk.recommendedAction || "N/A"}
                                            </p>
                                            <p>
                                                <b>Status:</b> {risk.status}
                                            </p>
                                            <p className={styles.detectedAt}>
                                                Detected at:{" "}
                                                {new Date(risk.detectedAt).toLocaleString()}
                                            </p>
                                            <button className={styles.mitigate_btn} onClick={handleMitigate}>
                                                🚧 Mitigate
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>No risk data available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
