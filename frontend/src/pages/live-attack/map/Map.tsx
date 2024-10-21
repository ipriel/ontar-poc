import styles from "./Map.module.css";
import AttackMap from "../../../assets/attack-map.png";

export const Map = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.containerTitle}>Map View</h2>
            <img
                className={styles.diagram} 
                src={AttackMap} 
                alt="Map View" 
            />
        </div>
    );
}

export default Map;