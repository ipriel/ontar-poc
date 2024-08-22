import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import "./index.css";

import Layout from "./pages/layout/Layout";
import NoPage from "./pages/NoPage";

initializeIcons();

/*export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Chat />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}*/

const router = createHashRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                async lazy() {
                    let { Chat } = await import("./pages/chat/Chat");
                    return {Component: Chat};
                }
            },
            {
                path: "/home",
                async lazy() {
                    let { Home } = await import("./pages/home/Home");
                    return {Component: Home};
                }
            },
            {
                path: "/chat",
                async lazy() {
                    let { Chat } = await import("./pages/chat/Chat");
                    return {Component: Chat};
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
        <RouterProvider router={router} />
    </React.StrictMode>
);
