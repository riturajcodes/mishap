"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { postDataAPI } from "../utils/fetchData";
import { useAuth } from "@/contexts/authContext";

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { authState, updateAuthState } = useAuth();

    useEffect(() => {
        const verifyAuth = async () => {
            setLoading(true);
            if (authState.access_token) {
                setLoading(false);
            } else {
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
                    setLoading(false);
                } catch (err) {
                    router.push("/authenticate");
                }
            }
        };
        verifyAuth();
    }, [authState.access_token, updateAuthState]);
    return (
        <>
            {loading && !authState.access_token ? (
                <div className="loading_screen">
                    <svg
                        className="spinloader"
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clipPath="url(#clip0_6333_11551)">
                            <path
                                d="M7.74988 1.05554V3.27776"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.88"
                                d="M12.3072 2.94269L10.7356 4.51424"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.75"
                                d="M14.1943 7.5H11.972"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.63"
                                d="M12.3072 12.0573L10.7356 10.4858"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.5"
                                d="M7.74988 13.9445V11.7222"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.38"
                                d="M3.1925 12.0573L4.76406 10.4858"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.25"
                                d="M1.30542 7.5H3.52764"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.13"
                                d="M3.1925 2.94269L4.76406 4.51424"
                                stroke="#09090B"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_6333_11551">
                                <rect
                                    width="15"
                                    height="15"
                                    fill="white"
                                    transform="translate(0.249878)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default ProtectedRoute;