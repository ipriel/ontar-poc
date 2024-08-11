import classNames from "classnames";

import styles from "./UserPuck.module.css";
import { HashRouter } from 'react-router-dom';

type UserState = "online" | "offline" | "busy"

interface Props {
    imageSrc: string;
    imageAlt?: string;
    userState?: UserState;
}

export const UserPuck = ({
    imageSrc,
    imageAlt = "",
    userState,
    ...attrs
}: Props) => {
    return (
        (userState != undefined) ? (
            <div className={classNames({[styles.hasBadge]: (userState != undefined)})} data-status={userState}>
                <img src={imageSrc} className={styles.userAvatarPuck} alt={imageAlt} {...attrs}></img>
            </div>
        ) : (
            <img src={imageSrc} className={styles.userAvatarPuck} alt={imageAlt} {...attrs}></img>
        )
    )
};