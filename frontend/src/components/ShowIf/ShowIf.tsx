import { Children, useMemo, PropsWithChildren, isValidElement } from "react";

interface Props {
    condition: boolean;
}

export const Else = ({ children }: PropsWithChildren) => {
    return (<>{children}</>);
};

export const ShowIf = ({ condition, children }: PropsWithChildren<Props>) => {
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