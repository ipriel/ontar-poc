import { PropsWithChildren } from "react";
import classNames from "classnames";

import styles from "./UserPuckGroup.module.css";
import { Else, ShowIf } from "../ShowIf";

interface Props {
    style?: "dense" | "normal";
    editable?: boolean;
}

export const UserPuckGroup = ({ style, editable, children }: PropsWithChildren<Props>) => {
    editable = editable ?? true;
    return (
        <div className={classNames(styles.userPuckGroup, { [styles.dense]: style == "dense" })}>
            {children}
            <ShowIf condition={editable}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#66637B" stroke-dasharray="2 2" />
                    <path d="M16.8333 10.1667C16.8333 9.70644 16.4602 9.33334 15.9999 9.33334C15.5397 9.33334 15.1666 9.70644 15.1666 10.1667V15.1667H10.1666C9.70635 15.1667 9.33325 15.5398 9.33325 16C9.33325 16.4602 9.70635 16.8333 10.1666 16.8333H15.1666V21.8333C15.1666 22.2936 15.5397 22.6667 15.9999 22.6667C16.4602 22.6667 16.8333 22.2936 16.8333 21.8333V16.8333H21.8333C22.2935 16.8333 22.6666 16.4602 22.6666 16C22.6666 15.5398 22.2935 15.1667 21.8333 15.1667H16.8333V10.1667Z" fill="#66637B" />
                </svg>
                <Else>
                    <p className={styles.overflowIndicator}>+4</p>
                </Else>
            </ShowIf>
        </div>
    );
};