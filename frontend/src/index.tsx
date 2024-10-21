import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import { QueryClientProvider } from "@tanstack/react-query";

import Layout from "./pages/layout/Layout";
import LiveAttackLayout from "./pages/live-attack/layout/Layout";

import "./index.css";
import { queryClient, WebsocketProvider } from "./lib";

import NoPage from "./pages/NoPage";

initializeIcons();

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                index: true,
                lazy: async () => {
                    const { Chat } = await import("./pages/chat/Chat")
                    return { Component: Chat }
                }
            },
            {
                path: "attack",
                Component: LiveAttackLayout,
                children: [
                    {
                        index: true,
                        lazy: async () => {
                            const { Home } = await import("./pages/live-attack/home/Home")
                            return { Component: Home }
                        }
                    },
                    {
                        path: "home",
                        lazy: async () => {
                            const { Home } = await import("./pages/live-attack/home/Home")
                            return { Component: Home }
                        }
                    },
                    {
                        path: "kanban",
                        lazy: async () => {
                            const { Kanban } = await import("./pages/live-attack/kanban/Kanban")
                            return { Component: Kanban }
                        }
                    },
                    {
                        path: "info",
                        lazy: async () => {
                            const { Info } = await import("./pages/live-attack/info/Info")
                            return { Component: Info }
                        }
                    },
                    {
                        path: "flow",
                        lazy: async () => {
                            const { Flow } = await import("./pages/live-attack/flow/Flow")
                            return { Component: Flow }
                        }
                    },
                    {
                        path: "servers",
                        lazy: async () => {
                            const { Servers } = await import("./pages/live-attack/servers/Servers")
                            return { Component: Servers }
                        }
                    },
                    {
                        path: "map",
                        lazy: async () => {
                            const { Map } = await import("./pages/live-attack/map/Map")
                            return { Component: Map }
                        }
                    },
                    {
                        path: "*",
                        Component: NoPage
                    }
                ]
            },
            {
                path: "chat",
                lazy: async () => {
                    const { Chat } = await import("./pages/chat/Chat")
                    return { Component: Chat }
                }
            },
            {
                path: "*",
                Component: NoPage
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <WebsocketProvider>
                <RouterProvider router={router} />
            </WebsocketProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
