"use client"
import styles from "@/styles/Assets.module.css"
import Link from 'next/link'

import { useAuth } from "@/contexts/authContext";
import { postDataAPI } from "@/utils/fetchData";
import { useEffect, useRef, useState } from "react";
const Assets = () => {
    const [zones, setZones] = useState([]);
    const [zonesLoading, setZonesLoading] = useState(true);
    const { authState } = useAuth();
    useEffect(() => {
        const fetchZones = async () => {
            try {
                setZonesLoading(true);
                const response = await postDataAPI(
                    `/api/v1/fetch-zones`,
                    {},
                    false,
                    authState.access_token,
                    "application/json"
                );
                setZones(response.data);
                setZonesLoading(false);
            } catch (err) {
                console.log(err);
                setZonesLoading(false);
            }
        };
        fetchZones();
    }, []);
    return (
        <div className={styles.assets}>
            <h1>
                Manage Zone
            </h1>
            <div className={styles.assets_container}>
                <Link href="/manage-assets/add-new-zone" className={styles.assets_create}>
                    <b>Add New Zone +</b>
                    <p>Add a new factory zone and modify assets</p>
                </Link>
                {zones.map((zone, i) => <Link key={i} className={styles.assets_zone} href={`/manage-assets/${zone._id}`}>
                    <div className={styles.assets_zone_header}>
                        <h2>{zone.name}</h2>
                        <div>
                            <div
                                style={{
                                    background:
                                        zone.status === "Active"
                                            ? "linear-gradient(135deg, #27ae60, #219150)"
                                            : zone.status === "Maintenance"
                                                ? "linear-gradient(135deg, #f39c12, #d68910)"
                                                : "linear-gradient(135deg, #c0392b, #922b21)"
                                }}
                            ></div> {zone.status}
                        </div>
                    </div>
                    <p>{zone.description}</p>
                    <p>Risk: {zone.riskScore}</p>
                    <b>
                        Manage
                    </b>
                </Link>)}
            </div>
        </div>
    )
}

export default Assets