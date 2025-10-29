"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/Sidebar.module.css";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import { usePathname, useRouter } from "next/navigation";
import { postDataAPI } from "@/utils/fetchData";

const adminLinks = [
    {
        name: "Dashboard",
        url: "/dashboard",
        svg: (
            <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_974_756)">
                    <path
                        d="M2.29163 6.45841V3.95841C2.29163 3.03758 3.03746 2.29175 3.95829 2.29175H5.58413C6.08996 2.29175 6.56746 2.52091 6.88413 2.91508L7.38663 3.54175H11.875C12.7958 3.54175 13.5416 4.28758 13.5416 5.20841V6.45841"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M2.66827 6.45825H13.1649C13.9866 6.45825 14.5841 7.23658 14.3724 8.02992L13.4549 11.4708C13.2608 12.2008 12.5999 12.7083 11.8449 12.7083H3.9891C3.2341 12.7083 2.57327 12.2008 2.3791 11.4708L1.4616 8.02992C1.24993 7.23658 1.84827 6.45825 2.6691 6.45825H2.66827Z"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_974_756">
                        <rect
                            width="15"
                            height="15"
                            fill="white"
                            transform="translate(0.416626)"
                        />
                    </clipPath>
                </defs>
            </svg>
        ),
        short: "d",
    },
    // {
    //     name: "Admins",
    //     url: "/admins",
    //     svg: (
    //         <svg
    //             width="16"
    //             height="15"
    //             viewBox="0 0 16 15"
    //             fill="none"
    //             xmlns="http://www.w3.org/2000/svg"
    //         >
    //             <path
    //                 d="M8.25002 5.94443C9.60005 5.94443 10.6945 4.85002 10.6945 3.49999C10.6945 2.14996 9.60005 1.05554 8.25002 1.05554C6.89999 1.05554 5.80557 2.14996 5.80557 3.49999C5.80557 4.85002 6.89999 5.94443 8.25002 5.94443Z"
    //                 stroke="#09090B"
    //                 strokeWidth="1.5"
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //             />
    //             <path
    //                 d="M12.4829 13.292C13.2473 13.0511 13.6491 12.2066 13.3246 11.4742C12.4624 9.52663 10.5166 8.16663 8.24998 8.16663C5.98331 8.16663 4.03753 9.52663 3.17531 11.4742C2.85087 12.2075 3.25264 13.0511 4.01709 13.292C5.10598 13.6351 6.54687 13.9444 8.24998 13.9444C9.95309 13.9444 11.394 13.6351 12.4829 13.292Z"
    //                 stroke="#09090B"
    //                 strokeWidth="1.5"
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //             />
    //         </svg>
    //     ),
    //     short: "a",
    // },
    {
        name: "Manage Assets",
        url: "/manage-assets",
        svg: (
            <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_487_965)">
                    <path
                        d="M7.13885 13.9444V6.38889C7.13885 5.89822 7.53708 5.5 8.02774 5.5H12.9166C13.4073 5.5 13.8055 5.89822 13.8055 6.38889V13.9444"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M2.69443 13.9444V3.42177C2.69443 3.06444 2.90776 2.74177 3.23665 2.6031L7.23665 0.911546C7.82243 0.663546 8.47221 1.09377 8.47221 1.73021V3.27777"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M1.80551 13.9445H14.6944"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.36108 8.61107V8.16663"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M11.5833 8.61107V8.16663"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.36108 11.2778V10.8334"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M11.5833 11.2778V10.8334"
                        stroke="#09090B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_487_965">
                        <rect
                            width="15"
                            height="15"
                            fill="white"
                            transform="translate(0.749969)"
                        />
                    </clipPath>
                </defs>
            </svg>
        ),
        short: "f",
    },
    {
        name: "Intelligence Platform",
        url: "/assistant",
        svg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>

        ),
        short: "a",
    },
];

const Sidebar = () => {
    const { authState, updateAuthState } = useAuth();
    const pathname = usePathname();

    const router = useRouter();

    const [modalOpen, setModalOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logout = async () => {
        try {
            // Step 1: Send a request to the backend to clear the refresh token
            await postDataAPI(
                "/api/v1/logout",
                {},
                true, // withCredentials to include cookies in the request
                "",
                "application/json"
            );

            // Step 3: Clear the authentication state in the frontend
            updateAuthState({ access_token: "", user: {} });

            // Step 4: Redirect to the login page
            router.push("/authenticate");

            console.log("User successfully logged out and redirected to /login.");
        } catch (err) {
            // Handle any error during the logout process
            console.error("Error during logout:", err);
            toast.error("An error occurred while logging out.");
        }
    };

    return (
        <>
            <nav className={styles.sidebar}>
                <Link href={"/"} className={styles.sidebar_logo}>
                    <p className={styles.mobile_hide}>Mishap</p>
                    <small className={styles.mobile_hide}>v0.1.2</small>
                </Link>
                <div className={styles.sidebar_middle}>

                    <ul>
                        {adminLinks.map((link, id) => (
                            <li key={id}>
                                <Link
                                    className={
                                        pathname.startsWith(link.url)
                                            ? styles.sidebar_active_link
                                            : ``
                                    }
                                    href={link.url}
                                >
                                    {link.svg}
                                    <p className={styles.mobile_hide}>{link.name}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div ref={modalRef} className={styles.sidebar_bottom}>
                    <div
                        className={styles.sidebar_bottom_inner}
                        onClick={() => setModalOpen(!modalOpen)}
                    >
                        <img src={"/profile.png"} alt="Profile Photo" />
                        <p className={styles.mobile_hide}>{authState.user?.name}</p>
                        <svg
                            className={styles.mobile_hide}
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            fill="none"
                        >
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M6.306 7.5a1.194 1.194 0 1 1 2.389 0 1.194 1.194 0 0 1-2.39 0M1.194 7.5a1.194 1.194 0 1 1 2.39 0 1.194 1.194 0 0 1-2.39 0M11.417 7.5a1.194 1.194 0 1 1 2.389 0 1.194 1.194 0 0 1-2.39 0"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <div
                        className={`${modalOpen ? styles.sidebar_bottom_modal_active : ""
                            } ${styles.sidebar_bottom_modal}`}
                    >
                        <div className={styles.sidebar_bottom_modal_top}>
                            <p>{authState.user?.name}</p>
                            <small>{authState.user?.email}</small>
                        </div>
                        <div className={styles.sidebar_bottom_modal_middle}>
                            <Link href={"/profile"} onClick={() => setModalOpen(!modalOpen)}>
                                <svg
                                    width="16"
                                    height="15"
                                    viewBox="0 0 16 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_590_1252)">
                                        <path
                                            d="M4.18274 2.13201C4.87429 1.67156 5.66007 1.3409 6.50452 1.17645"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M1.42004 6.2831C1.58449 5.42266 1.9196 4.62355 2.38982 3.92133"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M4.18274 12.868C4.87429 13.3285 5.66007 13.6591 6.50452 13.8236"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M1.42004 8.71689C1.58449 9.57733 1.9196 10.3764 2.38982 11.0787"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M8.99524 1.17645C9.83968 1.3409 10.6255 1.67156 11.317 2.13201"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M13.1099 3.92133C13.5801 4.62355 13.9152 5.42266 14.0796 6.2831"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M8.99524 13.8236C9.83968 13.6591 10.6255 13.3285 11.317 12.868"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M13.1099 11.0787C13.5801 10.3764 13.9152 9.57733 14.0796 8.71689"
                                            stroke="#ffffffff"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_590_1252">
                                            <rect
                                                width="15"
                                                height="15"
                                                fill="white"
                                                transform="translate(0.249878)"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span>View Profile</span>
                            </Link>
                            <button
                                onClick={async () => await logout()}
                                className={styles.sidebar_bottom_modal_middle_logout}
                            >
                                <svg
                                    width="16"
                                    height="15"
                                    viewBox="0 0 16 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.58331 1.94434H11.6944C12.6766 1.94434 13.4722 2.73989 13.4722 3.72211V11.2777C13.4722 12.2599 12.6766 13.0554 11.6944 13.0554H8.58331"
                                        stroke="rgb(255, 238, 238)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M5.4722 4.38867L2.36108 7.49978L5.4722 10.6109"
                                        stroke="rgb(255, 238, 238)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2.36108 7.49976H9.02775"
                                        stroke="rgb(255, 238, 238)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;