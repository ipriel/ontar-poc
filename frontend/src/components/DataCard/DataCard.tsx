import { cloneElement, PropsWithChildren } from "react";
import { Icon } from "@fluentui/react";
import classNames from "classnames";

import styles from "./DataCard.module.css";
import { ShowIf } from "../ShowIf";
import { CSSWithVars, isDefined } from "../../lib";

export type TextData = string | {
    value: string;
    hasAccent: boolean;
    accentColor?: string;
}

interface GenericNodeProps {
    className: string;
}

interface TextNodeProps extends GenericNodeProps {
    data: TextData | undefined;
}

const TextNode = ({ className, data }: TextNodeProps) => {
    if (!isDefined(data)) return null;
    if (typeof data === "string") {
        return <p className={className}>{data}</p>;
    }

    return (
        <p
            className={className}
            style={data.hasAccent ? { color: data.accentColor || "#E87474" } : undefined}
        >{data.value}</p>
    );
}

interface ImageNodeProps extends GenericNodeProps {
    image: JSX.Element | undefined;
}

const ImageNode = ({ className, image, ...props }: ImageNodeProps) => {
    if (!isDefined(image)) return null;
    const Child = cloneElement(image, { className: className, ...props })
    return (<>{Child}</>);
}

export interface DataCardProps {
    heading?: TextData;
    subheading?: TextData;
    image?: JSX.Element;
    className?: string;
    badgeIconName?: string;
    badgeColor?: string;
    cardClick?: () => void;
    badgeClick?: () => void;
}

export const DataCard = ({
    heading,
    subheading,
    image,
    className,
    badgeIconName,
    badgeColor,
    cardClick,
    badgeClick,
    children
}: PropsWithChildren<DataCardProps>) => {
    return (
        <div
            className={classNames(
                styles.dataCard,
                className,
                { [styles.hasBadge]: badgeIconName == null && badgeColor != null }
            )}
            style={{ '--color': badgeColor } as CSSWithVars}
            onClick={isDefined(cardClick) ? () => cardClick() : undefined}
        >
            <ShowIf condition={badgeIconName != null}>
                <Icon
                    iconName={badgeIconName}
                    aria-label="Open compromised user details"
                    onClick={isDefined(badgeClick) ? () => badgeClick() : undefined}
                    className={styles.dataCardIcon}
                    style={{ color: badgeColor }}
                />
            </ShowIf>
            <TextNode className={styles.dataCardValue} data={heading} />
            <TextNode className={styles.dataCardLabel} data={subheading} />
            <ImageNode className={styles.dataCardImage} image={image} data-test={"foo"} />
            {children}
        </div>
    );
};