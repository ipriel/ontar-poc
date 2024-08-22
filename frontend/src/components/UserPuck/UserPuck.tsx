import classNames from "classnames";

import styles from "./UserPuck.module.css";

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
    return (
        (userState != undefined) ? (
            <div className={classNames({ [styles.hasBadge]: (userState != undefined) })} data-status={userState}>
                <img src={imageSrc} className={classNames(styles.userAvatarPuck, { [styles.userAvatarPuckSmall]: size == "small" })} alt={imageAlt} {...attrs}></img>
            </div>
        ) : (
            <img src={imageSrc} className={classNames(styles.userAvatarPuck, { [styles.userAvatarPuckSmall]: size == "small" })} alt={imageAlt} {...attrs}></img>
        )
    )
};