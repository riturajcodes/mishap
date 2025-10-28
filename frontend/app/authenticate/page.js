"use client";
import styles from "@/styles/Authenticate.module.css"

import React, { useState, useEffect } from "react";
import { postDataAPI } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

const Authenticate = () => {

    const [loginData, setLoginData] = useState({ email: "johndoe@factory.com", password: "pass123" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const { authState, updateAuthState } = useAuth();

    useEffect(() => {
        const access_token = authState.access_token;
        if (access_token) {
            setLoading(true);
            router.push("/dashboard");
        } else {
            setLoading(true);
            const getAccessToken = async () => {
                try {
                    const res = await postDataAPI(
                        "/api/v1/generateaccesstoken",
                        { msg: "test" },
                        true,
                        "",
                        "application/json"
                    );
                    const { access_token, user } = res.data;
                    updateAuthState({
                        ...authState,
                        access_token,
                        user,
                    });
                    router.push("/dashboard");
                } catch (err) {
                    setLoading(false);
                }
            };
            getAccessToken();
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await postDataAPI(
                "/api/v1/login",
                loginData,
                true,
                "",
                "application/json"
            );
            updateAuthState({
                ...authState,
                user: { ...res.data.user },
                access_token: res.data.access_token,
            });
            setLoading(false);
            router.push("/dashboard");
        } catch (err) {
            console.log(err);
            setError(err.response?.data.msg || err.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles.auth}>
            <form className={styles.auth_form}>
                <h1>
                    Welcome Back!
                </h1>
                <div className={styles.auth_form_group}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        value={loginData.email}
                        onChange={e => {
                            setLoginData({ ...loginData, email: e.target.value })
                        }} type="email" name="email" id="email" required />
                </div>
                <div className={styles.auth_form_group}>
                    <label htmlFor="password">Password</label>
                    <input
                        value={loginData.password}
                        onChange={e => {
                            setLoginData({ ...loginData, password: e.target.value })
                        }}
                        type="password" name="password" id="password" required />
                </div>
                {error && <p className={styles.auth_error}>{error}</p>}
                <button type='submit' onClick={handleLogin}>Access Account</button>
            </form>
        </div>
    )
}

export default Authenticate