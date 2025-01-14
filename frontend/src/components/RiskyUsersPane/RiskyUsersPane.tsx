import { useMemo } from "react";
import classNames from "classnames";
import { intlFormatDistance } from "date-fns";

import { RatioBarGraph } from "../../components/RatioBarGraph";
import { RiskyUser } from "../../lib";

import styles from "./RiskyUsersPane.module.css";
import UserPic1 from "../../assets/user-1.png";
import UserPic2 from "../../assets/user-2.png";
import UserPic3 from "../../assets/user-3.png";
import UserPic4 from "../../assets/user-4.png";
import UserPic5 from "../../assets/user-5.png";
import UserPic6 from "../../assets/user-6.png";
import UserPic7 from "../../assets/user-7.png";
import UserPic8 from "../../assets/user-8.png";
import UserPic9 from "../../assets/user-9.png";
import UserPic10 from "../../assets/profile.png";

const imageList = [UserPic1, UserPic2, UserPic3, UserPic4, UserPic5, UserPic6, UserPic7, UserPic8, UserPic9, UserPic10];
const jobList = ["Sysadmin", "Admin", "Operator", "Creator"];


interface UserBlockProps {
    user: RiskyUser;
}

const UserBlock = ({ user }: UserBlockProps) => {
    const riskLevel = useMemo(
        () => (user.riskLevel as string).charAt(0).toUpperCase() + (user.riskLevel as string).slice(1),
        [user]
    );

    const parsedDate = useMemo(
        () => intlFormatDistance(
            new Date(user.riskLastUpdatedDateTime),
            new Date()
        ),
        [user]
    );

    const userPic = useMemo(() => {
        const index = Math.floor(Math.random() * 10);
        return imageList[index];
    }, [user.id]);

    const userJob = useMemo(() => {
        const index = Math.floor(Math.random() * 4);
        return jobList[index];
    }, [user.id]);

    return (
        <div className={classNames(styles.userBlock, styles.dataBlock)}>
            <img className={styles.userBlockImage} src={userPic} alt="" />
            <span>Name</span>
            <p className={styles.highlightText}>{user.userDisplayName}</p>
            <span>Type</span>
            <p>{userJob}</p>
            <span>Attack Time</span>
            <p>{parsedDate}</p>
            <span>Compromised Level</span>
            <div className={styles.userSeverity}>
                <svg data-severity="High" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="8" height="8" rx="4" fill="currentColor" />
                </svg>
                <span>{riskLevel}</span>
            </div>
        </div>
    );
};

interface RiskyUsersPaneProps {
    users: RiskyUser[];
    count: {
        low: number,
        medium: number,
        high: number,
        total: number
    }
}

export const RiskyUsersPane = ({users, count}: RiskyUsersPaneProps) => {
    return (
        <>
            <div className={styles.dataBlock}>
                <RatioBarGraph
                    title="Compromised Level"
                    style="wide"
                    data={[
                        { label: "Low", value: count.low, color: "#8AC898" },
                        { label: "Medium", value: count.medium, color: "#FFA903" },
                        { label: "High", value: count.high, color: "#E87474" }
                    ]}
                />
            </div>
            <div className={styles.userBlockContainer}>
                {users && users.map(user =>
                    <UserBlock user={user}/>
                )}
            </div>
        </>
    );
};