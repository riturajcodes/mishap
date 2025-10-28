import React from 'react'
import styles from "@/styles/Home.module.css";
import Link from 'next/link';

const Home = () => {
  return (
    <main className={styles.landing_cover}>
      <section className={styles.landing}>
        <div className={styles.landing_inner}>

          <p className={styles.landing_logo}>Mishap</p>

          <h1>
            The Operating System for Disaster Intelligence.
          </h1>
          <p className={styles.landing_tagline}>
            From floods to heatwaves — anticipate risk, safeguard assets, and coordinate response from a single unified platform.
          </p>

          <Link href={"/authenticate"}>
            Authenticate
          </Link>
        </div>

      </section>
      <video src="/herolanding.mp4" autoPlay loop muted></video>
    </main>

  )
}

export default Home;