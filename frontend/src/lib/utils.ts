import { CSSProperties } from "react";

export type CSSVars = {
    [K: `--val-${number}`]: number;
    [K: `--color-${number}`]: string;
}

export interface CSSWithVars extends CSSProperties {
    [K: `--val-${number}`]: number;
    [K: `--color-${number}`]: string;
}

export function isDefined(obj: unknown) {
    return obj != null && typeof obj !== "undefined";
}