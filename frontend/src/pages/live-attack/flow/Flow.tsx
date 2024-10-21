import styles from "./Flow.module.css";
import AttackFlow from "../../../assets/attack-flow.png";

export const Flow = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.containerTitle}>Attack Flow</h2>
            <img
                className={styles.diagram} 
                src={AttackFlow} 
                alt="Attack Flow" 
            />
        </div>
    );
}

export default Flow;