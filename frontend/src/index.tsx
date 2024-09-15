import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";
import { QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { queryClient, WebsocketProvider } from "./lib";

import NoPage from "./pages/NoPage";

const Layout = lazy(() => 
    import("./pages/layout/Layout")
);

const Chat = lazy(() => 
    import("./pages/chat/Chat")
);

const Home = lazy(() => 
    import("./pages/home/Home")
);

initializeIcons();

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                Component: Chat
            },
            {
                path: "/home",
                Component: HomeLayout
            },
            {
                path: "/chat",
                Component: Chat
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
