import { Children, useMemo, PropsWithChildren, isValidElement, ReactNode } from "react";

interface ResolveRenderFunction<TFnArgument> {
    (data: TFnArgument): void | ReactNode | ReactNode[];
}

interface ThenProps<TData> {
    using: TData
    children: ReactNode | ResolveRenderFunction<NonNullable<TData>>;
}

export const Then = <TData,>({children, using}: ThenProps<TData>) => {
    if(using == null) return null;
    const toRender = typeof children === "function" ? children(using) : children;
    return (<>{toRender}</>);
}

export const Else = ({ children }: PropsWithChildren) => {
    return (<>{children}</>);
};

interface ShowProps {
    condition: boolean;
}

export const ShowIf = ({ condition, children }: PropsWithChildren<ShowProps>) => {
    const blocks = useMemo(() => {
        const ifTrueChildren: JSX.Element[] = [];
        let elseChild: JSX.Element | null = null;

        Children.forEach(children, (child) => {
            if (!isValidElement(child)) return;

            if (child.type === Else) {
                elseChild = child;
            } else {
                ifTrueChildren.push(child);
            }
        });

        return { true: <>{ifTrueChildren}</>, false: elseChild }
    }, [children]);

    const result = useMemo(() => {
        if (condition) {
            return blocks.true;
        }
        return blocks.false;
    }, [condition, blocks]);

    return result;
};