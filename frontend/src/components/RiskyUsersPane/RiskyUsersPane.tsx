import { CSSProperties } from 'react';
import classNames from "classnames";

import { RatioBarGraph } from "../../components/RatioBarGraph";
import { useRiskyUsersStore } from "../../api";

import styles from "./RiskyUsersPane.module.css";
import UserPic1 from "../../assets/user-1.png";
import UserPic2 from "../../assets/user-2.png";
import UserPic3 from "../../assets/user-3.png";
import UserPic4 from "../../assets/user-4.png";

export const RiskyUsersPane = () => {
    const [users, count] = useRiskyUsersStore((state) => [state.users, state.count]);
    
    return (
        <>
            <div className={styles.dataBlock}>
                <RatioBarGraph
                    title="Compromised Level"
                    style="wide"
                    data={[
                        { label: "Low", value: 0, color: "#8AC898" },
                        { label: "Medium", value: 2, color: "#FFA903" },
                        { label: "High", value: 2, color: "#E87474" }
                    ]}
                />
            </div>
            <div className={styles.userBlockContainer}>
                <div className={classNames(styles.userBlock, styles.dataBlock)}>
                    <img className={styles.userBlockImage} src={UserPic1} alt="" />
                    <span>Name</span>
                    <p className={styles.highlightText}>Jack Dorsey</p>
                    <span>Type</span>
                    <p>CEO</p>
                    <span>Attack Time</span>
                    <p>March 5</p>
                    <span>Compromised Level</span>
                    <div className={styles.userSeverity}>
                        <svg data-severity="High" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="8" height="8" rx="4" fill="currentColor" />
                        </svg>
                        <span>High</span>
                    </div>
                </div>
                <div className={classNames(styles.userBlock, styles.dataBlock)}>
                    <img className={styles.userBlockImage} src={UserPic2} alt="" />
                    <span>Name</span>
                    <p></p>
                    <span>Type</span>
                    <p></p>
                    <span>Attack Time</span>
                    <p></p>
                    <span>Compromised Level</span>
                    <div className={styles.userSeverity}>
                        <svg data-severity="High" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="8" height="8" rx="4" fill="currentColor" />
                        </svg>
                        <span>High</span>
                    </div>
                </div>
                <div className={classNames(styles.userBlock, styles.dataBlock)}>
                    <img className={styles.userBlockImage} src={UserPic3} alt="" />
                    <span>Name</span>
                    <p></p>
                    <span>Type</span>
                    <p></p>
                    <span>Attack Time</span>
                    <p></p>
                    <span>Compromised Level</span>
                    <div className={styles.userSeverity}>
                        <svg data-severity="Medium" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="8" height="8" rx="4" fill="currentColor" />
                        </svg>
                        <span>Medium</span>
                    </div>
                </div>
                <div className={classNames(styles.userBlock, styles.dataBlock)}>
                    <img className={styles.userBlockImage} src={UserPic4} alt="" />
                    <span>Name</span>
                    <p></p>
                    <span>Type</span>
                    <p></p>
                    <span>Attack Time</span>
                    <p></p>
                    <span>Compromised Level</span>
                    <div className={styles.userSeverity}>
                        <svg data-severity="Medium" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="8" height="8" rx="4" fill="currentColor" />
                        </svg>
                        <span>Medium</span>
                    </div>
                </div>
            </div>
        </>
    );
};