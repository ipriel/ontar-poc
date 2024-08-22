import { cloneElement } from "react";
import { getSVG } from "./SVG.utils";
import { isDefined } from "../../lib";

interface Props {
    svgName: string;
    className?: string;
    onClick?: () => void;
}

export const SVG = ({ svgName, className, onClick, ...props }: Props) => {
    const svg = getSVG(svgName);
    if(!isDefined(svg)) {
        console.error(`SVG not found: "${svgName}" does not match an SVG in the collection`)
        return null;
    }
    const SVGNode = cloneElement(svg, {className, onClick, ...props});
    return (<>{SVGNode}</>);
}