import classNames from "classnames";
import styles from "./DataCard.module.css";
import { ImageNode } from "./DataCard";

interface Props {
    label: string;
    image?: JSX.Element;
}

export const FallbackCard = ({label, image}: Props) => {
    return (
        <div className={classNames(styles.dataCard, styles.fallbackCard)}>
            <div className={styles.loader}></div>
            <p className={styles.dataCardLabel}>{label}</p>
            <ImageNode className={styles.dataCardImage} image={image} />
        </div>
    )
}