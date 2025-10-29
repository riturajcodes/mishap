'use client'
import React, { useState } from "react";
import styles from "@/styles/Assets.module.css";
import { postDataAPI } from "@/utils/fetchData";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

const ZoneForm = () => {
    const router = useRouter()
    const { authState } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        zoneType: "",
        description: "",
        longitude: "",
        latitude: "",
        fireSuppressionSystem: "",
        ventilation: "",
        riskScore: "",
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await postDataAPI(
                "/api/v1/add-new-zone",
                formData,
                true,
                authState.access_token,
                "application/json"
            );

            if (res.status === 200) {
                router.push("/manage-assets");
            } else {
                setMessage("⚠️ Something went wrong. Try again.");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setMessage(err.response?.data?.msg || "❌ Failed to create zone.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <form className={styles.assets_new_form} onSubmit={handleSubmit}>
            <h1>Add New Zone</h1>
            <div className={styles.assets_new_two_col}>
                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.assets_new_input}
                        required
                    />
                </div>

                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Zone Type</label>
                    <select
                        name="zoneType"
                        value={formData.zoneType}
                        onChange={handleChange}
                        className={styles.assets_new_select}
                        required
                    >
                        <option value="">Select Zone Type</option>
                        <option value="RefineryUnit">Refinery Unit</option>
                        <option value="StorageYard">Storage Yard</option>
                        <option value="PumpStation">Pump Station</option>
                        <option value="PowerHouse">Power House</option>
                        <option value="ControlRoom">Control Room</option>
                        <option value="PipelineSection">Pipeline Section</option>
                        <option value="SafetyZone">Safety Zone</option>
                    </select>
                </div>

                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Longitude</label>
                    <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className={styles.assets_new_input}
                        step="any"
                    />
                </div>

                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Latitude</label>
                    <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className={styles.assets_new_input}
                        step="any"
                    />
                </div>

                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Fire Suppression System</label>
                    <select
                        name="fireSuppressionSystem"
                        value={formData.fireSuppressionSystem}
                        onChange={handleChange}
                        className={styles.assets_new_select}
                    >
                        <option value="">Select Type</option>
                        <option value="Sprinkler">Sprinkler</option>
                        <option value="Foam">Foam</option>
                        <option value="CO2">CO2</option>
                        <option value="DryPowder">Dry Powder</option>
                        <option value="None">None</option>
                    </select>
                </div>

                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Ventilation</label>
                    <select
                        name="ventilation"
                        value={formData.ventilation}
                        onChange={handleChange}
                        className={styles.assets_new_select}
                    >
                        <option value="">Select Type</option>
                        <option value="Natural">Natural</option>
                        <option value="Forced">Forced</option>
                        <option value="ExplosionProof">Explosion Proof</option>
                    </select>
                </div>

                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Risk Score</label>
                    <input
                        type="number"
                        name="riskScore"
                        value={formData.riskScore}
                        onChange={handleChange}
                        className={styles.assets_new_input}
                        min="0"
                        max="100"
                    />
                </div>

                <div className={styles.assets_new_field}>
                    <label className={styles.assets_new_label}>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={styles.assets_new_select}
                    >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Shutdown">Shutdown</option>
                    </select>
                </div>
            </div>

            <div className={styles.assets_new_field_full}>
                <label className={styles.assets_new_label}>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={styles.assets_new_textarea}
                />
            </div>
            {message && <p className={styles.assets_new_error}>{message}</p>}

            <button type="submit" disabled={loading} className={styles.assets_new_submit}>
                Create Zone
            </button>
        </form>
    );
};

export default ZoneForm;
