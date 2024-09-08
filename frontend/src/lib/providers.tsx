import {
    createContext,
    useEffect,
    PropsWithChildren,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useQueryClient } from "@tanstack/react-query";
import { PushEvent, ServerPushEvent, WebsocketMessage } from './models';

const queryKey = ["events"];

async function getWSUrl() {
    const protocol = "ws" + window.location.protocol.slice(4);
    return `${protocol}//${window.location.host}/notifier`;
}

function convertEvent(
    event: ServerPushEvent | Partial<ServerPushEvent>
): PushEvent | Partial<PushEvent> {
    let entries = Object.entries(event);
    entries = entries.map((entry) => {
        entry[0] = entry[0].charAt(0).toLowerCase() + entry[0].slice(1);
        return entry;
    });
    return Object.fromEntries(entries);
}

export const WebsocketContext = createContext<{ isReady: boolean }>({
    isReady: false
});

export const WebsocketProvider = ({ children }: PropsWithChildren<{}>) => {
    const { lastMessage, readyState } = useWebSocket(getWSUrl, {
        share: true,
        shouldReconnect: () => true,
    });
    const queryClient = useQueryClient();

    const isReady = readyState === ReadyState.OPEN;

    useEffect(() => {
        if (lastMessage && lastMessage.data) {
            let data: WebsocketMessage;
            try {
                data = JSON.parse(lastMessage.data);
            }
            catch {
                console.log("[WS] Received: " + lastMessage.data)
                return;
            }

            if (data.message_type == "close_event") {
                queryClient.setQueryData(queryKey, () => {
                    return [];
                });
            }
            else {
                if (data.message_type == "new_event") {
                    queryClient.setQueryData(queryKey, (oldData: PushEvent[]) => {
                        const newEvent = convertEvent(data.payload) as PushEvent;
                        oldData = oldData ?? [];
                        return [...oldData, newEvent];
                    });
                } /* data.message_type == "update_event" */ else {
                    queryClient.setQueryData(queryKey, (oldData: PushEvent[]) => {
                        const oldItem: PushEvent = oldData.pop() as PushEvent;
                        const newData = convertEvent(data.payload);
                        const newEvent: PushEvent = Object.assign(oldItem ?? {}, newData);
                        return [...oldData, newEvent];
                    });
                }

                queryClient.invalidateQueries({ queryKey: ["live-attack"] })
            }
        }
    }, [lastMessage, queryClient]);

    return (
        <WebsocketContext.Provider value={{ isReady }}>
            {children}
        </WebsocketContext.Provider>
    );
};