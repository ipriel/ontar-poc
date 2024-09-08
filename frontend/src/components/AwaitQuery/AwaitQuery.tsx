import { UseQueryResult } from "@tanstack/react-query";
import { ReactNode } from "react";

interface ResolveRenderFunction<TFnArgument> {
    (data: TFnArgument): ReactNode | ReactNode[];
}

interface ErrorRenderFunction {
    (error: Error): ReactNode;
}

interface Props<TData> {
    query: UseQueryResult<TData, Error>,
    fallback?: ReactNode
    error?: ReactNode | ErrorRenderFunction,
    children: ReactNode | ResolveRenderFunction<NonNullable<TData>>
}

export const AwaitQuery = <TQueryReturn,>({ query, fallback, error, children }: Props<TQueryReturn>) => {
    const { data, isLoading, isError, error: errorMsg } = query;

    if (isLoading) return (<>{ fallback }</>);
    if (error && isError) {
        const renderedError = typeof error === "function" ? error(errorMsg as Error) : error;
        return (<>{ renderedError }</>)
    };
    const toRender = typeof children === "function" ? children(data as NonNullable<TQueryReturn>) : children;
    return (<>{toRender}</>);
}

export default AwaitQuery;