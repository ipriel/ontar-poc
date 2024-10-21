import { NavLink, Outlet } from "react-router-dom";
import { Stack } from '@fluentui/react';
import classNames from "classnames";

import { UserPuck } from "../../../components/UserPuck";
import { UserPuckGroup } from "../../../components/UserPuckGroup";
import { SVG, registerSVGs } from "../../../components/SVG";
import UserPic1 from "../../../assets/user-1.png";
import UserPic2 from "../../../assets/user-2.png";
import UserPic3 from "../../../assets/user-3.png";

import styles from "./Layout.module.css";
import svgCollection from "./Layout.data";

registerSVGs(svgCollection);

const routes = [
    {svg: "dashboard_home", uri: "home", importPath: "../home/Home" },
    {svg: "dashboard_kanban", uri: "kanban", importPath: "../kanban/Kanban" },
    {svg: "dashboard_gantt", uri: "gantt"},
    {svg: "hacker_small", uri: "info", importPath: "../info/Info"},
    {svg: "dashboard_attack_flow", uri: "flow"},
    {svg: "dashboard_server_tree", uri: "servers"},
    {svg: "dashboard_map", uri: "map"}
];

(async () => {
    await import("../home/Home");
    await import("../kanban/Kanban");
    await import("../info/Info");
    await import("../flow/Flow");
    await import("../servers/Servers");
    await import("../map/Map");
})()

export const Layout = () => {
    return (
        <div className={styles.container} role="main">
            <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="space-between"
                className={styles.rulerContainer}
            >
                <div className={styles.rulerSectionContainer}>
                    <div className={styles.rulerSearchbar}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.16669 0.666656C4.02455 0.666656 0.666687 4.02452 0.666687 8.16666C0.666687 12.3088 4.02455 15.6667 8.16669 15.6667C9.93753 15.6667 11.565 15.0529 12.8481 14.0266L15.9108 17.0892C16.2362 17.4147 16.7638 17.4147 17.0893 17.0892C17.4147 16.7638 17.4147 16.2362 17.0893 15.9107L14.0266 12.8481C15.053 11.565 15.6667 9.9375 15.6667 8.16666C15.6667 4.02452 12.3088 0.666656 8.16669 0.666656ZM2.33335 8.16666C2.33335 4.945 4.94503 2.33332 8.16669 2.33332C11.3883 2.33332 14 4.945 14 8.16666C14 11.3883 11.3883 14 8.16669 14C4.94503 14 2.33335 11.3883 2.33335 8.16666Z" fill="#89859F" />
                        </svg>
                        <input type="search" name="" id="" placeholder="Search" />
                    </div>
                    <div className={styles.avatarGroup}>
                        <UserPuckGroup style="dense">
                            <UserPuck imageSrc={UserPic1} userState={"online"}></UserPuck>
                            <UserPuck imageSrc={UserPic2} userState={"offline"}></UserPuck>
                            <UserPuck imageSrc={UserPic3} userState={"online"}></UserPuck>
                        </UserPuckGroup>
                    </div>
                </div>
                <div className={classNames(styles.rulerSectionContainer, styles.rulerSectionButtonContainer)}>
                    {routes.map((route) => (
                        <NavLink to={'/attack/'+route.uri} className={styles.link}>
                            <SVG svgName={route.svg} key={route.uri} />
                        </NavLink>
                    ))}
                </div>
            </Stack>
            <Outlet />
        </div>
    );
};

export default Layout;