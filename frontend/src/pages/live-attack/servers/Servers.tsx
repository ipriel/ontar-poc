import styles from "./Servers.module.css";
import ServerTree from "../../../assets/server-tree.png";

export const Servers = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.containerTitle}>Server Attack View</h2>
            <img
                className={styles.diagram} 
                src={ServerTree} 
                alt="Server Attack View" 
            />
        </div>
    );
}

export default Servers;