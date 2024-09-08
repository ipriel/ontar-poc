import { QueryClient, useQuery, UndefinedInitialDataOptions, QueryKey } from "@tanstack/react-query";
import { PushEvent } from './models';
import { defer } from "react-router-dom";

const queryKey = ["events"];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      structuralSharing: false
    },
  },
});

const _LoaderWithQuery = (queryClient: QueryClient) =>
  async (queries: (queryClient: QueryClient) => Record<string,Promise<unknown>>) => 
    async () => {
      const loaderData = queries(queryClient);
      // ⬇️ return data or fetch it
      return defer(loaderData)
    };

export const LoaderWithQuery = _LoaderWithQuery(queryClient);

export function jsonQuery<TQueryReturn, TSelectedData = TQueryReturn>(url: string, queryKey: string[], select?: (data: TQueryReturn)=>TSelectedData): UndefinedInitialDataOptions<TQueryReturn, Error, TSelectedData, QueryKey> {
  return {
    queryKey,
    queryFn: async () => fetch(url).then(data => data.json() as TQueryReturn),
    structuralSharing: false,
    select,
  };
};

export function useJsonQuery<TQueryReturn, TSelectedData = TQueryReturn>(url: string, queryKey: string[], select?: (data: TQueryReturn)=>TSelectedData) {
  const query = jsonQuery<TQueryReturn, TSelectedData>(url, queryKey, select);
  useQuery({
    queryKey: ["a"],
    queryFn: ()=>{}
  })
  return useQuery(query);
}
  
export const useLastEventQuery = () => useQuery({
  queryKey, 
  queryFn: (()=>[] as PushEvent[]), 
  select: (data: PushEvent[]) => ({
    isLiveAttack: (data.length > 0),
    firstEvent: data[0]
  })
});