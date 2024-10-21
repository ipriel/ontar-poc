import { Children, isValidElement, PropsWithChildren, useMemo } from "react";

import { DataCard, DataCardProps } from "./DataCard";
import styles from "./DataCard.module.css";
import classNames from "classnames";
import { isDefined } from "../../lib";

interface FlipCardProps {
    isActive: boolean;
    onClick?: () => void;
}

export const FlipCard = ({ isActive, onClick, children }: PropsWithChildren<FlipCardProps>) => {
    const [FrontCard, BackCard] = useMemo(() => {
        let FrontCard: JSX.Element | null = null;
        let BackCard: JSX.Element | null = null;

        if (Children.count(children) != 2) {
            throw "Error: Flipcard can only contain a single FlipCard.Front and a single FlipCard.Back element";
        }

        Children.forEach(children, (child) => {
            if (!isValidElement(child)) return;

            if (child.type === FlipCard.Front) {
                FrontCard = child;
            } else if (child.type === FlipCard.Back) {
                BackCard = child;
            } else {
                throw "Error: Flipcard can only contain a single FlipCard.Front and a single FlipCard.Back";
            }
        });

        return [FrontCard, BackCard];
    }, [children]);

    return (
        <div className={classNames({ [styles.flipCard]: isActive })} onClick={() => {
            if (isActive && isDefined(onClick)) onClick();
        }}>
            {FrontCard}
            {BackCard}
        </div>
    );
};

FlipCard.Front = ({
    children,
    className,
    ...props
}: PropsWithChildren<DataCardProps>) => {
    return (
        <DataCard {...props} className={classNames(className, styles.dataCardFront)}>
            {children}
        </DataCard>
    );
};

FlipCard.Back = ({
    children,
    className,
    ...props
}: PropsWithChildren<DataCardProps>) => {
    return (
        <DataCard {...props} className={classNames(className, styles.dataCardBack)}>
            {children}
        </DataCard>
    );
};