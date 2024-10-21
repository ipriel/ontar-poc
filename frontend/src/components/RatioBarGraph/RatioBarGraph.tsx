import { useMemo } from "react";
import classNames from "classnames";

import { CSSVars, CSSWithVars } from "../../lib";
import styles from "./RatioBarGraph.module.css";

interface Props {
    style?: "wide" | "block";
    title: string
    data: { label: string, value: number, color: string }[]
}

export const RatioBarGraph = ({ style, title, data }: Props) => {
    const [graphVals, stopCount] = useMemo(() => {
        const filteredVals = data.filter((cat) => cat.value > 0);
        const total = filteredVals.reduce((sum, currCat) => sum + currCat.value, 0);
        let vals: CSSVars = {};
        const lastIndex = filteredVals.length - 1;
        // Loop over filteredVals, ignoring last item in array
        for (let i = 0; i < lastIndex; i++) {
            vals[`--val-${i + 1}`] = filteredVals[i].value / total;
            vals[`--color-${i + 1}`] = filteredVals[i].color;
        }
        // Handle last item (only the color variable is necessary here)
        // If data is empty, lastIndex is -1, which causes the assignment to throw an exception
        if(lastIndex >= 0) {
            vals[`--color-${lastIndex + 1}`] = filteredVals[lastIndex].color;
        }

        return [vals, lastIndex];
    }, [data]);

    return (
        <div className={classNames(
            styles.chartContainer,
            { [styles.wideStyle]: style == "wide" },
            { [styles.blockStyle]: style == "block" }
        )}>
            <p className={styles.chartTitle}>{title}</p>
            <div
                className={classNames(
                    styles.chartBar,
                    { [styles.twoTone]: stopCount == 1 },
                    { [styles.threeTone]: stopCount == 2 })
                }
                style={graphVals as CSSWithVars}
            ></div>
            <div className={styles.chartLegend}>
                {data && data.map((cat) =>
                    <div className={styles.chartLegendItem} key={cat.label}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="8" height="8" rx="4" fill={cat.color} />
                        </svg>
                        <span>{`${cat.label} (${cat.value})`}</span>
                    </div>
                )}
            </div>
        </div>
    );
};