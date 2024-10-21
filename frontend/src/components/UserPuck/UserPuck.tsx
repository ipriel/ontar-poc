import classNames from "classnames";

import styles from "./UserPuck.module.css";
import { isDefined } from "../../lib";
import { useState } from "react";

type UserState = "online" | "offline" | "busy"

interface Props {
    imageSrc: string;
    imageAlt?: string;
    userState?: UserState;
    size?: "small" | "normal"
}

export const UserPuck = ({
    imageSrc,
    imageAlt = "",
    userState,
    size = "normal",
    ...attrs
}: Props) => {
    const [loaded, setLoaded] = useState<boolean>(false);

    if (!isDefined(userState))
        return (
            <img
                src={imageSrc}
                className={classNames(
                    styles.userAvatarPuck, 
                    { [styles.userAvatarPuckSmall]: size == "small" },
                    { [styles.loading]: !loaded }
                )}
                alt={imageAlt}
                {...attrs}
                onLoad={()=>setLoaded(true)}
            />
        );

    return (
        <div
            className={classNames(
                { [styles.hasBadge]: isDefined(userState) },
                { [styles.loading]: !loaded }
            )}
            data-status={userState}
        >
            <img
                src={imageSrc}
                className={classNames(styles.userAvatarPuck, { [styles.userAvatarPuckSmall]: size == "small" })}
                alt={imageAlt}
                {...attrs}
                onLoad={()=>setLoaded(true)}
            />
        </div>
    );
};