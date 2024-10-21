import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { DataCard } from "../../../components/DataCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/Tabs";
import { TagGroup } from "../../../components/TagGroup";
import { UserPuckGroup } from '../../../components/UserPuckGroup';
import { UserPuck } from "../../../components/UserPuck";
import { Table } from "../../../components/Table";

import IranFlag from "../../../assets/flag-iran.png";
import UkraineFlag from "../../../assets/flag-ukraine.png";
import RussiaFlag from "../../../assets/flag-russia.png";
import UserPic6 from "../../../assets/user-6.png";
import UserPic7 from "../../../assets/user-7.png";
import UserPic8 from "../../../assets/user-8.png";
import UserPic9 from "../../../assets/user-9.png";

import InfoSummaryMap from "../../../assets/info-summary-map.png";
import InfoStatsDonut from "../../../assets/info-stats-donut.png";

import { countries, industries, group_description, attack_routine, attack_sources, attack_history, attack_types } from "./Info.data";
import styles from "./Info.module.css";
import { IconButton, registerIcons } from "@fluentui/react";
import classNames from "classnames";

registerIcons({
    icons: {
        FilterFunnelRegular: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.70504 3.72239C1.07476 3.01796 0.759615 2.66574 0.747728 2.3664C0.737402 2.10636 0.849148 1.85643 1.04982 1.69074C1.28083 1.5 1.75345 1.5 2.6987 1.5H15.0678C16.0131 1.5 16.4857 1.5 16.7167 1.69074C16.9174 1.85643 17.0291 2.10636 17.0188 2.3664C17.0069 2.66574 16.6917 3.01796 16.0615 3.72239L11.3063 9.03703C11.1806 9.17745 11.1178 9.24766 11.073 9.32756C11.0333 9.39843 11.0041 9.47473 10.9865 9.55403C10.9666 9.64345 10.9666 9.73766 10.9666 9.92609V14.382C10.9666 14.5449 10.9666 14.6264 10.9403 14.6969C10.9171 14.7591 10.8793 14.8149 10.8301 14.8596C10.7745 14.9102 10.6988 14.9404 10.5475 15.001L7.71418 16.1343C7.40789 16.2568 7.25475 16.3181 7.13181 16.2925C7.02431 16.2702 6.92996 16.2063 6.86929 16.1148C6.79992 16.0101 6.79992 15.8452 6.79992 15.5153V9.92609C6.79992 9.73766 6.79992 9.64345 6.78002 9.55403C6.76237 9.47473 6.73322 9.39843 6.69349 9.32756C6.6487 9.24766 6.58588 9.17745 6.46024 9.03703L1.70504 3.72239Z" stroke="#89859F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        )
    }
});

export const Info = () => {
    return (
        <div className={styles.subPageContainer}>
            <div className={styles.sidebar}>
                <div className={styles.groupLogoCard}>
                    <svg width="96" height="101" viewBox="0 0 96 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M94.1696 83.2151C91.5538 75.3333 89.3718 66.206 84.9986 58.3273C80.6347 50.4517 71.4638 48.891 71.4638 48.891C81.0718 42.7604 80.2789 35.5466 74.1639 29.0569C68.0488 22.5673 67.6087 14.6294 63.685 8.13662C59.755 1.64389 52.535 0.56073 47.8839 0.56073C43.2329 0.56073 36.0128 1.64389 32.0797 8.1335C28.1466 14.6262 27.7159 22.5642 21.6008 29.0538C15.4858 35.5434 14.693 42.7604 24.3009 48.8879C24.3009 48.8879 15.13 50.4486 10.7661 58.3242C6.396 66.1997 4.21094 75.327 1.59512 83.2119C-1.02694 91.0875 0.995791 94.3339 8.42185 94.3339C10.2011 94.3339 13.41 94.3339 17.237 94.3339C17.8769 92.9916 18.9257 91.8897 20.2929 91.2935L15.9447 61.6985C15.6825 59.9286 16.1882 58.1619 17.3213 56.8477C18.4544 55.5336 20.1244 54.7813 21.913 54.7813H73.8517C75.6435 54.7813 77.3135 55.5336 78.4497 56.8508C79.589 58.1619 80.0885 59.9286 79.8263 61.6985L75.478 91.2935C76.839 91.8866 77.8909 92.9916 78.5277 94.3339C82.3641 94.3339 85.5698 94.3339 87.3491 94.3339C94.772 94.3339 96.7917 91.0906 94.1696 83.2151ZM62.6268 28.8509C62.2803 32.2565 61.45 37.7972 59.5833 41.7958C56.7115 47.9545 50.5528 50.6921 47.8839 50.6921C45.215 50.6921 39.0563 47.9545 36.1783 41.7958C34.3179 37.7972 33.4907 32.2534 33.1348 28.8509C30.5502 30.5927 28.0436 32.8995 28.0436 32.8995C29.4889 29.5938 32.8913 25.7825 32.8913 25.7825C37.4113 18.3939 47.8839 15.1069 47.8839 15.1069C47.8839 15.1069 58.3534 18.3939 62.8703 25.7825C62.8703 25.7825 66.2789 29.597 67.718 32.8995C67.718 32.8995 65.2176 30.5927 62.6268 28.8509Z" fill="#706E86" />
                        <path d="M44.6029 81.6605C44.0472 83.6864 46.2978 83.5896 46.2978 83.1619C46.2978 82.1194 47.0283 79.7907 47.0283 79.7907C47.0283 79.7907 45.068 79.953 44.6029 81.6605Z" fill="#3C3C47" />
                        <path d="M51.1642 81.6605C50.7022 79.9499 48.7388 79.7907 48.7388 79.7907C48.7388 79.7907 49.4692 82.1194 49.4692 83.1619C49.4692 83.5927 51.7198 83.6895 51.1642 81.6605Z" fill="#3C3C47" />
                        <path d="M52.9064 77.5151C56.1683 76.7816 55.2974 72.5426 54.4234 73.0639C51.7826 74.659 48.8203 75.1896 48.8203 75.1896C49.3947 76.638 50.1345 78.1363 52.9064 77.5151Z" fill="#3C3C47" />
                        <path d="M42.8612 77.5151C45.6363 78.1332 46.3667 76.638 46.941 75.1896C46.941 75.1896 43.985 74.659 41.3442 73.0639C40.4702 72.5457 39.5993 76.7816 42.8612 77.5151Z" fill="#3C3C47" />
                        <path d="M73.0399 94.3338H71.4479L76.3206 61.1803C76.5516 59.6133 75.4372 58.3273 73.8515 58.3273H50.768C49.1822 58.3273 46.5851 58.3273 44.9994 58.3273H21.9128C20.327 58.3273 19.2189 59.6133 19.4499 61.1803L24.3226 94.3338H22.7306C21.3041 94.3338 20.1397 95.4919 20.1397 96.9216V97.8611C20.1397 99.2908 21.3041 100.449 22.7306 100.449H73.0399C74.4664 100.449 75.6245 99.2908 75.6245 97.8611V96.9216C75.6245 95.4919 74.4664 94.3338 73.0399 94.3338ZM47.8837 63.8492C51.7543 63.8492 58.272 66.0873 58.272 72.605C58.272 79.1227 56.8455 79.3038 56.0277 81.1673C56.0277 81.1673 57.8631 83.009 57.2544 84.3294C56.6395 85.6467 53.3838 84.3419 53.0779 86.3896C52.772 88.4373 52.363 88.8088 47.8837 88.8088C43.4043 88.8088 42.9954 88.4373 42.6895 86.3896C42.3836 84.3419 39.1279 85.6467 38.5129 84.3294C37.9042 83.009 39.7334 81.1673 39.7334 81.1673C38.9218 79.3007 37.4953 79.1227 37.4953 72.605C37.4953 66.0873 44.013 63.8492 47.8837 63.8492ZM63.9469 95.4108H31.8204C31.321 95.4108 30.9121 95.0018 30.9121 94.4993C30.9121 93.9998 31.321 93.5909 31.8204 93.5909H63.9501C64.4495 93.5909 64.8584 93.9998 64.8584 94.4993C64.8584 95.0018 64.4495 95.4108 63.9469 95.4108Z" fill="#E87474" />
                    </svg>
                    <h2>DoppelPaymer</h2>
                </div>
                <div className={styles.narrowCard} data-status="active">
                    <h3>Status</h3>
                    <p>Active</p>
                </div>
                <div className={styles.narrowCard}>
                    <h3>First seen date</h3>
                    <p>Jan 2016</p>
                </div>
                <div className={styles.narrowCard}>
                    <h3>Last seen date</h3>
                    <p>Aug 2023</p>
                </div>
                <div className={styles.narrowCard}>
                    <h3>Motivation</h3>
                    <p>Criminal</p>
                </div>
                <div className={styles.narrowCard}>
                    <h3>Origin</h3>
                    <p>Russia</p>
                </div>
                <div className={styles.narrowCard}>
                    <h3>Known Members</h3>
                    <UserPuckGroup>
                        <UserPuck imageSrc={UserPic6}></UserPuck>
                        <UserPuck imageSrc={UserPic7}></UserPuck>
                        <UserPuck imageSrc={UserPic8}></UserPuck>
                        <UserPuck imageSrc={UserPic9}></UserPuck>
                    </UserPuckGroup>
                </div>
            </div>
            <Tabs defaultValue="summary" className={styles.mainContent}>
                <TabsList className={styles.tabList}>
                    <TabsTrigger value="summary" className={styles.tabTrigger}>
                        <span>Summary</span>
                    </TabsTrigger>
                    <TabsTrigger value="description" className={styles.tabTrigger}>
                        <span>Group Description</span>
                    </TabsTrigger>
                    <TabsTrigger value="routine" className={styles.tabTrigger}>
                        <span>Attack Routine</span>
                    </TabsTrigger>
                    <TabsTrigger value="source" className={styles.tabTrigger}>
                        <span>Common Source Attack</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className={styles.tabTrigger}>
                        <span>Group Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="stats" className={styles.tabTrigger}>
                        <span>Statistics</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className={classNames(styles.tabContent, styles.col3)}>
                    <DataCard
                        heading="125"
                        subheading="Intel Reports"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="48"
                        subheading="Total Attacks"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="1,234"
                        subheading="Endpoints detection"
                        className={styles.dataCard}
                    />
                    <div className={classNames(styles.summaryContainer, styles.fullWidth)}>
                        <div className={styles.contentCard}>
                            <h3 className={styles.contentCardHeader}>Target Industries</h3>
                            <TagGroup tags={industries}></TagGroup>
                        </div>
                        <div className={classNames(styles.contentCard, styles.twoColumn)}>
                            <div>
                                <h3>Target Countries</h3>
                                <TagGroup tags={countries}></TagGroup>
                            </div>
                            {/* Map */}
                            <img src={InfoSummaryMap} aria-hidden="true" width={"618px"}></img>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="description" className={classNames(styles.tabContent, styles.col3)}>
                    <DataCard
                        heading="15"
                        subheading="Ransom"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="4"
                        subheading="Malware"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="4"
                        subheading="Users Compromised"
                        className={styles.dataCard}
                    />
                    <div className={classNames(styles.contentCard, styles.scrollableCard, styles.fullWidth)}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            children={group_description}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="routine" className={classNames(styles.tabContent, styles.col3)}>
                    <DataCard
                        heading="125"
                        subheading="Intel Reports"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="4"
                        subheading="Total Attacks"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="4"
                        subheading="Users Compromised"
                        className={styles.dataCard}
                    />
                    <div className={classNames(styles.contentCard, styles.scrollableCard, styles.fullWidth)}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            children={attack_routine}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="source" className={classNames(styles.tabContent, styles.col3)}>
                    <DataCard
                        heading="125"
                        subheading="IRAN"
                        image={<img src={IranFlag} alt="Filter attacks from Iran"></img>}
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="52"
                        subheading="UKRAINE"
                        image={<img src={UkraineFlag} alt="Filter attacks from Ukraine"></img>}
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="12"
                        subheading="RUSSIA"
                        image={<img src={RussiaFlag} alt="Filter attacks from Russia"></img>}
                        className={styles.dataCard}
                    />
                    <div className={classNames(styles.contentCard, styles.fullWidth)}>
                        <div className={styles.toolbar}>
                            <div>
                                <h3>Common Attack Source</h3>
                                <TagGroup tags={[{ label: "Iran", selected: true }]} />
                            </div>
                            <div>
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.55835 0.868164C4.14007 0.868164 0.55835 4.44989 0.55835 8.86816C0.55835 13.2864 4.14007 16.8682 8.55835 16.8682C10.4071 16.8682 12.1093 16.2411 13.464 15.188L18.8512 20.5753C19.2418 20.9658 19.8749 20.9658 20.2655 20.5753C20.656 20.1847 20.656 19.5516 20.2655 19.1611L14.8782 13.7738C15.9313 12.4191 16.5583 10.7169 16.5583 8.86816C16.5583 4.44989 12.9766 0.868164 8.55835 0.868164ZM2.55835 8.86816C2.55835 5.55446 5.24464 2.86816 8.55835 2.86816C11.8721 2.86816 14.5583 5.55446 14.5583 8.86816C14.5583 12.1819 11.8721 14.8682 8.55835 14.8682C5.24464 14.8682 2.55835 12.1819 2.55835 8.86816Z" fill="#89859F" />
                                </svg>
                                <IconButton
                                    iconProps={{ iconName: "FilterFunnelRegular" }}
                                />
                            </div>
                        </div>
                        <Table>
                            <Table.Head className={styles.attackTableHead}>
                                <Table.Cell value={"Task Name"} />
                                <Table.Cell value={"IP Address"} />
                                <Table.Cell value={"Attack Source"} />
                                <Table.Cell value={"Timestamp"} />
                                <Table.Cell value={"IP Status"} />
                                <Table.Cell value={"Actions"} />
                            </Table.Head>
                            <Table.Body className={styles.attackTableBody}>
                                {attack_sources.map(task =>
                                    <Table.Row
                                        key={task.address + "|" + task.timestamp}
                                        className={styles.attackTableRow}
                                    >
                                        <Table.Cell className={styles.dashboardTableMixedCell}>
                                            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.88379 5H5.89379M5.88379 17H5.89379M5.08379 9H18.6838C19.8039 9 20.3639 9 20.7918 8.78201C21.1681 8.59027 21.4741 8.28431 21.6658 7.90798C21.8838 7.48016 21.8838 6.92011 21.8838 5.8V4.2C21.8838 3.0799 21.8838 2.51984 21.6658 2.09202C21.4741 1.71569 21.1681 1.40973 20.7918 1.21799C20.3639 1 19.8039 1 18.6838 1H5.08379C3.96368 1 3.40363 1 2.97581 1.21799C2.59948 1.40973 2.29352 1.71569 2.10178 2.09202C1.88379 2.51984 1.88379 3.07989 1.88379 4.2V5.8C1.88379 6.92011 1.88379 7.48016 2.10178 7.90798C2.29352 8.28431 2.59948 8.59027 2.97581 8.78201C3.40363 9 3.96368 9 5.08379 9ZM5.08379 21H18.6838C19.8039 21 20.3639 21 20.7918 20.782C21.1681 20.5903 21.4741 20.2843 21.6658 19.908C21.8838 19.4802 21.8838 18.9201 21.8838 17.8V16.2C21.8838 15.0799 21.8838 14.5198 21.6658 14.092C21.4741 13.7157 21.1681 13.4097 20.7918 13.218C20.3639 13 19.8039 13 18.6838 13H5.08379C3.96368 13 3.40363 13 2.97581 13.218C2.59948 13.4097 2.29352 13.7157 2.10178 14.092C1.88379 14.5198 1.88379 15.0799 1.88379 16.2V17.8C1.88379 18.9201 1.88379 19.4802 2.10178 19.908C2.29352 20.2843 2.59948 20.5903 2.97581 20.782C3.40363 21 3.96368 21 5.08379 21Z" stroke="#E87474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <p>{task.name}</p>
                                        </Table.Cell>
                                        <Table.Cell value={"IP " + task.address} />
                                        <Table.Cell className={styles.dashboardTableMixedCell}>
                                            <img src={IranFlag} aria-hidden="true"></img>
                                            <p>{task.source.toUpperCase()}</p>
                                        </Table.Cell>
                                        <Table.Cell value={task.timestamp} />
                                        <Table.Cell className={styles.dashboardTablePill} value={task.status} data-status={task.status} />
                                        <Table.Cell>
                                            <svg width="44" height="58" viewBox="0 0 44 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.2168 10C20.2168 9.07952 20.963 8.33333 21.8835 8.33333C22.8039 8.33333 23.5501 9.07952 23.5501 10C23.5501 10.9205 22.8039 11.6667 21.8835 11.6667C20.963 11.6667 20.2168 10.9205 20.2168 10Z" fill="#5C5A73" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.2168 4.16667C20.2168 3.24619 20.963 2.5 21.8835 2.5C22.8039 2.5 23.5501 3.24619 23.5501 4.16667C23.5501 5.08714 22.8039 5.83333 21.8835 5.83333C20.963 5.83333 20.2168 5.08714 20.2168 4.16667Z" fill="#5C5A73" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.2168 15.8333C20.2168 14.9129 20.963 14.1667 21.8835 14.1667C22.8039 14.1667 23.5501 14.9129 23.5501 15.8333C23.5501 16.7538 22.8039 17.5 21.8835 17.5C20.963 17.5 20.2168 16.7538 20.2168 15.8333Z" fill="#5C5A73" />
                                            </svg>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="activity">
                    <div className={classNames(styles.contentCard, styles.fullWidth)}>
                        <div className={styles.contentCardHeader}>
                            <h3>Attack History</h3>
                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.55835 0.868164C4.14007 0.868164 0.55835 4.44989 0.55835 8.86816C0.55835 13.2864 4.14007 16.8682 8.55835 16.8682C10.4071 16.8682 12.1093 16.2411 13.464 15.188L18.8512 20.5753C19.2418 20.9658 19.8749 20.9658 20.2655 20.5753C20.656 20.1847 20.656 19.5516 20.2655 19.1611L14.8782 13.7738C15.9313 12.4191 16.5583 10.7169 16.5583 8.86816C16.5583 4.44989 12.9766 0.868164 8.55835 0.868164ZM2.55835 8.86816C2.55835 5.55446 5.24464 2.86816 8.55835 2.86816C11.8721 2.86816 14.5583 5.55446 14.5583 8.86816C14.5583 12.1819 11.8721 14.8682 8.55835 14.8682C5.24464 14.8682 2.55835 12.1819 2.55835 8.86816Z" fill="#89859F" />
                            </svg>
                        </div>
                        <div className={styles.dataGridContainer}>
                            {attack_history.map(attack =>
                                <div className={styles.dataGridCard}>
                                    <div className={styles.dataGridHeader}>
                                        <img
                                            className={styles.attackLogo}
                                            src={attack.logo}
                                            aria-hidden="true"
                                        />
                                        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8835 6.8335C11.8209 6.8335 7.7168 10.9376 7.7168 16.0002C7.7168 21.0628 11.8209 25.1668 16.8835 25.1668C21.9461 25.1668 26.0501 21.0628 26.0501 16.0002C26.0501 10.9376 21.9461 6.8335 16.8835 6.8335ZM16.8835 11.8335C16.4232 11.8335 16.0501 12.2066 16.0501 12.6668C16.0501 13.1271 16.4232 13.5002 16.8835 13.5002H16.8918C17.352 13.5002 17.7251 13.1271 17.7251 12.6668C17.7251 12.2066 17.352 11.8335 16.8918 11.8335H16.8835ZM17.7168 16.0002C17.7168 15.5399 17.3437 15.1668 16.8835 15.1668C16.4232 15.1668 16.0501 15.5399 16.0501 16.0002V19.3335C16.0501 19.7937 16.4232 20.1668 16.8835 20.1668C17.3437 20.1668 17.7168 19.7937 17.7168 19.3335V16.0002Z" fill="#89859F" />
                                        </svg>
                                    </div>
                                    <div className={styles.dataGrid}>
                                        <span>Type:</span>
                                        <span>{attack.type}</span>
                                        <span>Attack Group:</span>
                                        <span>{attack.attack_group}</span>
                                        <span>Name:</span>
                                        <span>{attack.name}</span>
                                        <span>Attack Type:</span>
                                        <span>{attack.attack_type}</span>
                                        <span>Cost:</span>
                                        <span>{attack.cost}</span>
                                        <span>Severity Level:</span>
                                        <div className={styles.dashboardTableMixedCell} data-severity={attack.severity_level}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L4.29289 11.2929C3.90237 11.6834 3.90237 12.3166 4.29289 12.7071C4.68342 13.0976 5.31658 13.0976 5.70711 12.7071L11 7.41421L11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19L13 7.41421L18.2929 12.7071C18.6834 13.0976 19.3166 13.0976 19.7071 12.7071C20.0976 12.3166 20.0976 11.6834 19.7071 11.2929L12.7071 4.29289Z" fill="currentColor" />
                                            </svg>
                                            <span>{attack.severity_level}</span>
                                        </div>
                                        <span>Status:</span>
                                        <span className={styles.dashboardTablePill} data-state="Paid">{attack.status}</span>
                                        <span>Attack Date:</span>
                                        <span>{attack.attack_date}</span>
                                        <span>Location:</span>
                                        <span>{attack.location}</span>
                                        <span>Resolution Date:</span>
                                        <span>{attack.resolution_date}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="stats" className={classNames(styles.tabContent, styles.col4)}>
                    <DataCard
                        heading="56%"
                        subheading="Data Recovery Estimate"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="70%"
                        subheading="Est. Sensitive Data Leak"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="13%"
                        subheading="Reoccurence Odds"
                        className={styles.dataCard}
                    />
                    <DataCard
                        heading="$550K"
                        subheading="Avg. Ransom Payout"
                        className={styles.dataCard}
                    />
                    <div className={classNames(styles.contentCard, styles.twoColumn, styles.hasDivider, styles.fullWidth)}>
                        <div className={styles.textBlock}>
                            <h3>DoppelPaymer</h3>
                            <p>
                                Believed to be based on the BitPaymer ransomware, DoppelPaymer ransom
                                demands for file decryption are sizeable, historically ranging anywhere
                                from <span className={styles.accent}>€23,000</span> to <span className={styles.accent}>€1.1 million</span>. According to Europol, victims paid at
                                least €40 million between May 2019 and March 2021.
                            </p>
                        </div>
                        {/* Pie Chart */}
                        <div className={styles.chartContainer}>
                            <div>
                                <h3>Ransomware Attack by Type</h3>
                                <h4>Q3 2024</h4>
                            </div>
                            <img
                                className={styles.chart}
                                src={InfoStatsDonut}
                                aria-hidden="true"
                            />
                            <div className={styles.chartLegend}>
                                {attack_types.map(type =>
                                    <>
                                        <i style={{ backgroundColor: type.color }}></i>
                                        <span>{type.name}</span>
                                        <span>{type.ratio}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}