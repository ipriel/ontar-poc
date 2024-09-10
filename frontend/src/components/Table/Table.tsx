import { Children, isValidElement, MouseEventHandler, ReactNode } from "react";
import classNames from "classnames";

import { isDefined } from "../../lib";
import styles from "./Table.module.css";

interface TableProps {
    children: ReactNode;
    className?: string;
}
export const Table = ({ children, className, ...props }: TableProps) => {
    let Head: ReactNode;
    let Body: ReactNode;

    if (Children.count(children) != 2) throw "Table component requires exactly one Table.Head and one Table.Body component";

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;

        if (child.type === Table.Head) {
            Head = child;
        } else if (child.type === Table.Body) {
            Body = child;
        }
        else {
            throw `Unsupported child component in Table. ${child.type} is unsupported. Use either Table.Head or Table.Body`;
        }
    });

    if (Head == null) throw "Table.Head child component is missing in Table.";
    if (Body == null) throw "Table.Body child component is missing in Table.";

    return (
        <div className={classNames(className, styles.table)} {...props}>
            {Head}
            {Body}
        </div>
    );
}

interface HeadParamsBase {
    className?: string;
}
interface HeadWithParamProps extends HeadParamsBase {
    headers: string[];
}
interface HeadWithChildrenProps extends HeadParamsBase {
    children: ReactNode;
}
type HeadProps = HeadWithParamProps | HeadWithChildrenProps;

Table.Head = (props: HeadProps) => {
    let cells: ReactNode;
    let classes: string | undefined;
    let attrs = {};
    if ("headers" in props) {
        const { className, headers, ...otherProps } = props;
        cells = (
            <>
                {headers.map((header) => (
                    <Table.Cell value={header} />
                ))}
            </>
        );
        classes = className;
        attrs = otherProps;
    }
    else if ("children" in props) {
        const { className, children, ...otherProps } = props;
        cells = (
            <>
                {Children.map(props.children, (child) => {
                    if (!isValidElement(child)) return;
                    return (
                        <>
                            {child}
                        </>
                    );
                })}
            </>
        );
        classes = className;
        attrs = otherProps;
    }

    return (
        <div className={classNames(classes, styles.header)} {...attrs}>
            {cells}
        </div>
    );
}

interface ResolveRenderFunction<TFnArgument> {
    (data: TFnArgument): ReactNode | ReactNode[];
}
interface ResolveMapFunction<TFnArgument> {
    (value: NonNullable<TFnArgument>, index?: number, array?: TFnArgument[]): ReactNode | ReactNode[];
}
interface BodyPropsBase {
    className?: string;
}
interface BasicBodyProps<TData> extends BodyPropsBase {
    list?: TData[];
    children: ReactNode | ResolveRenderFunction<NonNullable<TData[]>>;
    map?: false;
}
interface MappingBodyProps<TData> extends BodyPropsBase {
    list: TData[];
    children: ResolveMapFunction<TData>;
    map: true;
}
type BodyProps<TData> = BasicBodyProps<TData> | MappingBodyProps<TData>;

Table.Body = <TData,>({ list, children, map, className, ...props }: BodyProps<TData>) => {
    let toRender: ReactNode = <></>;
    if (map === true) {
        toRender = <>
            {list.map((item, ...args) => children(item as NonNullable<TData>, ...args))}
        </>
    }
    else {
        toRender = typeof children === "function"
            ? <>
                {
                    list?.map(((item) => children(item as NonNullable<TData[]>)))
                }
            </>
            : children;
    }

    return (
        <div className={classNames(className, styles.body)} {...props}>
            {toRender}
        </div>
    );
}

interface RowProps {
    className?: string;
    onClick?: MouseEventHandler<HTMLTableRowElement>;
    children: ReactNode;
}
Table.Row = ({ className, onClick, children, ...props }: RowProps) => {
    return (
        <div className={classNames(className, styles.row, { [styles.clickable]: isDefined(onClick) })} onClick={onClick} {...props}>
            {children}
        </div>
    )
}

Table.FallbackRow = () => {
    return (
        <div className={styles.fallback}>
            <div className={styles.loader}></div>
        </div>
    )
}

interface CellProps<TData extends string | number | boolean> {
    className?: string;
    value?: TData;
    children?: ReactNode | ResolveRenderFunction<TData>;
}
Table.Cell = <TData extends string | number | boolean>({ className, value, children, ...props }: CellProps<TData>) => {
    if (isDefined(value) && !isDefined(children)) {
        return (
            <span className={classNames(className, styles.cell)} {...props}>
                {value}
            </span>
        );
    }

    return (
        <div className={classNames(className, styles.cell)} {...props}>
            <>
                {
                    !isDefined(value)
                        ? children
                        : typeof children === "function"
                            ? children(value)
                            : null
                }
            </>
        </div>
    )
}