import styles from "./hero.module.css";

export default function Hero() {
  return (
    <header className={styles.hero} role="banner">
      <div className={styles.bg} />
      <div className={styles.card}>
        <h1 className={styles.app_name}>Ambiance Maker</h1>
        <p className={styles.tagline}>
          Set the tone <span className={styles.circle}>●</span> Stay in flow
        </p>
        <p className={styles.subtitle}>
          Mix YouTube videos into immersive background soundscapes
        </p>
      </div>
    </header>
  );
}
