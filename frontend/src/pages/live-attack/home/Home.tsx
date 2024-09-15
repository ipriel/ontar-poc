import { useMemo } from 'react';
import { Icon, Stack } from '@fluentui/react';
import { ChevronDown24Regular as ChevronDownIcon } from "@fluentui/react-icons";
import { isPast, isToday } from "date-fns";
import classNames from 'classnames';

import { RiskyUsersPane } from "../../../components/RiskyUsersPane";
import { RecommendationPane, RecommendationType } from "../../../components/RecommendationPane";
import { UserPuckGroup } from "../../../components/UserPuckGroup";
import { RatioBarGraph } from "../../../components/RatioBarGraph";
import { SVG, registerSVGs } from "../../../components/SVG";
import { DataCard, FallbackCard, FlipCard } from "../../../components/DataCard";
import { ShowIf, Else } from "../../../components/ShowIf";
import { AwaitQuery } from "../../../components/AwaitQuery";
import { Table } from "../../../components/Table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/Tabs";
import { useModal } from '../../../components/Modal';
import { UserPuck } from '../../../components/UserPuck';
import { ADRecommendation, Recommendation, Remediation } from "../../../lib/models";
import { jsonQuery, queryClient, useJsonQuery, useLastEventQuery } from "../../../lib/react-query";
import { isDefined } from '../../../lib/utils';
import UserPic1 from "../../../assets/user-1.png";
import UserPic2 from "../../../assets/user-2.png";
import UserPic3 from "../../../assets/user-3.png";


import styles from "./Home.module.css";
import svgCollection from "./Home.data";
import { generateDueDate, getInterval, parseSeverity, riskyUserSelector, alertSelector } from "./Home.utils";

const severity: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"];
const improvement = [5, 10, 20];

registerSVGs(svgCollection);

export const Home = () => {
    const recommendationQuery = useJsonQuery<Recommendation[]>('/api/recommendations', ["live-attack", "recommendations"]);
    const riskyUserQuery = useJsonQuery('/api/riskyUsers', ["live-attack", "riskyUsers"], riskyUserSelector);
    const alertQuery = useJsonQuery('/api/alerts', ["live-attack", "alerts"], alertSelector);
    queryClient.prefetchQuery(jsonQuery<Remediation[]>('/api/remediations', ["live-attack", "remediations"]));
    const adRecommendationQuery = useJsonQuery<ADRecommendation[]>('/api/adRecommendations', ["live-attack", "adRecommendations"]);

    const { data: serverEvent } = useLastEventQuery();
    const { isLiveAttack, firstEvent } = useMemo(() => {
        if (isDefined(serverEvent)) return serverEvent;

        return { isLiveAttack: false, firstEvent: undefined };
    }, [serverEvent?.firstEvent, serverEvent?.isLiveAttack]);

    const [Modal, setModal] = useModal();

    return (
        <>
            <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="space-between"
                className={classNames(styles.notificationContainer, { [styles.notificationContainerActive]: isLiveAttack })}
            >
                <div className={styles.notificationMessage}>
                    <p style={{ color: "#E87474" }}>You are under attack!</p>
                    <p style={{ color: "#9896B3" }}>{firstEvent?.alert}</p>
                </div>
                <ChevronDownIcon style={{ color: "#5C5A73" }} />
            </Stack>
            <div className={styles.dataCardContainer}>
                <div className={classNames(styles.dataCard, styles.dataCardTall)}>
                    <p className={classNames(styles.dataCardLabel, styles.dataCardAccent)}>{firstEvent?.attackType}</p>
                    <SVG svgName="attack_globe" className={styles.dataCardImage} />
                </div>
                <AwaitQuery
                    query={alertQuery}
                    fallback={
                        <FallbackCard
                            label="ComputeApps"
                            image={<SVG svgName="compromised_apps" />}
                        />
                    }
                >
                    {(count) =>
                        <DataCard
                            heading={`${count.compromisedApps}`}
                            subheading="Compute Apps"
                            image={<SVG svgName="compromised_apps" />}
                            className={classNames({ [styles.dataCardAccent]: count.compromisedApps > 0 })}
                        />
                    }
                </AwaitQuery>
                <AwaitQuery
                    query={alertQuery}
                    fallback={
                        <FallbackCard
                            label="Networking"
                            image={<SVG svgName="compromised_networking" />}
                        />
                    }
                >
                    {(count) =>
                        <DataCard
                            heading={`${count.compromisedNetworking}`}
                            subheading="Networking"
                            image={<SVG svgName="compromised_networking" />}
                            className={classNames({ [styles.dataCardAccent]: count.compromisedNetworking > 0 })}
                        />
                    }
                </AwaitQuery>
                <DataCard
                    heading={`${0}`}
                    subheading="Data & Storage"
                    image={<SVG svgName="compromised_storage" />}
                // className={classNames({[styles.dataCardAccent]: compromisedStorageCount > 0})}
                />
                <AwaitQuery
                    query={riskyUserQuery}
                    fallback={
                        <FallbackCard
                            label="Users Compromised"
                            image={<SVG svgName="hacker_large" />}
                        />
                    }
                >
                    {({ users, count }) =>
                        <FlipCard
                            isActive={count.total > 0}
                            onClick={() => {
                                if (count.total == 0) return;
                                setModal({
                                    title: "Compromised Users",
                                    component: <RiskyUsersPane users={users} count={count} />
                                });
                            }}
                        >
                            <FlipCard.Front
                                heading={`${count.total}`}
                                subheading="Users Compromised"
                                image={<SVG svgName="hacker_large" />}
                                className={classNames({ [styles.dataCardAccent]: count.total > 0 })}
                            />
                            <FlipCard.Back
                                badgeIconName="OpenInNewWindow"
                                badgeClick={() => {
                                    setModal({
                                        title: "Compromised Users",
                                        component: <RiskyUsersPane users={users} count={count} />
                                    });
                                }}
                            >
                                <RatioBarGraph
                                    title="Compromised Level"
                                    style="block"
                                    data={[
                                        { label: "Low", value: count.low, color: "#8AC898" },
                                        { label: "Medium", value: count.medium, color: "#FFA903" },
                                        { label: "High", value: count.high, color: "#E87474" }
                                    ]}
                                />
                            </FlipCard.Back>
                        </FlipCard>
                    }
                </AwaitQuery>
                <AwaitQuery
                    query={alertQuery}
                    fallback={
                        <FallbackCard
                            label="IoT Hubs & Resources"
                            image={<SVG svgName="compromised_resources" />}
                        />
                    }
                >
                    {(count) =>
                        <DataCard
                            heading={`${count.compromisedResources}`}
                            subheading="IoT Hubs & Resources"
                            image={<SVG svgName="compromised_resources" />}
                            className={classNames({ [styles.dataCardAccent]: count.compromisedResources > 0 })}
                        />
                    }
                </AwaitQuery>
                <DataCard
                    heading={`${0}`}
                    subheading="Identity & Access"
                    image={<SVG svgName="compromised_access" />}
                // className={classNames({[styles.dataCardAccent]: compromisedAccessCount > 0})}
                />
            </div>
            <Tabs defaultValue="actions">
                <TabsList>
                    <TabsTrigger value="actions">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.4944 1.00012L8.45941 0.999871C8.33255 0.998618 8.06944 0.99602 7.81988 1.0821C7.60969 1.1546 7.41825 1.27292 7.25941 1.42849C7.07081 1.61321 6.95546 1.84971 6.89985 1.96373L6.88443 1.99513L2.67028 10.4234C2.58696 10.5899 2.49673 10.7703 2.43463 10.9293C2.36951 11.096 2.27511 11.381 2.32509 11.7194C2.3854 12.1275 2.61117 12.4928 2.94927 12.7293C3.22952 12.9253 3.52672 12.9684 3.70493 12.9847C3.87491 13.0002 4.07655 13.0002 4.26277 13.0001L9.15594 13.0001L6.54214 21.7128C6.40953 22.1548 6.59665 22.6302 6.99501 22.8633C7.39336 23.0963 7.89946 23.0265 8.21981 22.6943L20.4386 10.023C20.6218 9.83296 20.8031 9.64503 20.936 9.48021C21.056 9.33128 21.2921 9.02216 21.32 8.59877C21.3513 8.12348 21.155 7.66157 20.7912 7.35421C20.467 7.08041 20.0806 7.03579 19.8901 7.01882C19.6792 7.00003 19.4181 7.00007 19.1541 7.00011L13.443 7.00012L15.1863 2.35124C15.3015 2.04414 15.2587 1.7001 15.0719 1.43052C14.8851 1.16095 14.5779 1.00012 14.25 1.00012H8.4944Z" fill="currentColor" />
                        </svg>
                        <span>Immediate Actions</span>
                    </TabsTrigger>
                    <TabsTrigger value="collaborators">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5836 14.8768C18.7213 14.3419 19.2664 14.0199 19.8013 14.1576C21.9576 14.7126 23.552 16.6688 23.552 19V21C23.552 21.5523 23.1043 22 22.552 22C21.9998 22 21.552 21.5523 21.552 21V19C21.552 17.6035 20.5969 16.4275 19.3028 16.0945C18.7679 15.9568 18.4459 15.4116 18.5836 14.8768Z" fill="currentColor" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1251 2.91554C15.3323 2.40361 15.9153 2.1566 16.4273 2.36382C18.2578 3.10481 19.552 4.90006 19.552 7C19.552 9.09994 18.2578 10.8952 16.4273 11.6362C15.9153 11.8434 15.3323 11.5964 15.1251 11.0845C14.9179 10.5725 15.1649 9.98953 15.6768 9.7823C16.7781 9.33652 17.552 8.25744 17.552 7C17.552 5.74256 16.7781 4.66348 15.6768 4.2177C15.1649 4.01047 14.9179 3.42748 15.1251 2.91554Z" fill="currentColor" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.73098 14C9.27835 14.0005 10.8257 14.0005 12.3731 14C13.4637 13.9996 14.2079 13.9994 14.8461 14.1704C16.5716 14.6327 17.9193 15.9804 18.3817 17.7059C18.6119 18.5652 18.5453 19.4836 18.5522 20.3641C18.5531 20.471 18.5548 20.6872 18.5009 20.8882C18.3622 21.4059 17.9579 21.8102 17.4403 21.9489C17.2393 22.0028 17.023 22.001 16.9161 22.0002C12.3411 21.9637 7.76296 21.9637 3.18795 22.0002C3.08104 22.001 2.86483 22.0028 2.66381 21.9489C2.14617 21.8102 1.74185 21.4059 1.60315 20.8882C1.54929 20.6872 1.55101 20.471 1.55186 20.3641C1.55887 19.4858 1.49252 18.5639 1.72241 17.7059C2.18475 15.9804 3.53248 14.6327 5.25794 14.1704C5.89616 13.9994 6.64036 13.9996 7.73098 14Z" fill="currentColor" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.05204 7C5.05204 4.23858 7.29062 2 10.052 2C12.8135 2 15.052 4.23858 15.052 7C15.052 9.76142 12.8135 12 10.052 12C7.29062 12 5.05204 9.76142 5.05204 7Z" fill="currentColor" />
                        </svg>

                        <span>Collaborators</span>
                        <svg style={{ "margin": "-2px" }} width="29" height="28" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.052" y="0.5" width="31" height="31" rx="15.5" stroke="#66637B" stroke-dasharray="2 2" />
                            <path d="M17.3853 10.1666C17.3853 9.70641 17.0122 9.33331 16.5519 9.33331C16.0917 9.33331 15.7186 9.70641 15.7186 10.1666V15.1666H10.7186C10.2583 15.1666 9.88525 15.5397 9.88525 16C9.88525 16.4602 10.2583 16.8333 10.7186 16.8333H15.7186V21.8333C15.7186 22.2936 16.0917 22.6666 16.5519 22.6666C17.0122 22.6666 17.3853 22.2936 17.3853 21.8333V16.8333H22.3853C22.8455 16.8333 23.2186 16.4602 23.2186 16C23.2186 15.5397 22.8455 15.1666 22.3853 15.1666H17.3853V10.1666Z" fill="#66637B" />
                        </svg>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="actions">
                    <Table>
                        <Table.Head>
                            <Table.Cell value={"Task Name"} />
                            <Table.Cell value={"Due Date"} />
                            <Table.Cell value={"Severity Level"} />
                            <Table.Cell className={styles.dashboardCenteredHeader} value={"Score Improvement"} />
                            <Table.Cell value={"Assigned"} />
                        </Table.Head>
                        <Table.Body className={styles.dashboardTableBody}>
                            <AwaitQuery
                                query={recommendationQuery}
                                fallback={<Table.FallbackRow />}
                            >
                                {(recommendations) => (
                                    <>
                                        {recommendations.map((row, i) => {
                                            const dueDate = generateDueDate();
                                            const severityIndex = parseSeverity(row.severityScore);
                                            return (
                                                <Table.Row
                                                    className={classNames(styles.dashboardTableRow, styles.clickable)}
                                                    key={`recommendation-${i}`}
                                                    onClick={() => {
                                                        setModal({
                                                            title: row.recommendationName,
                                                            tags: [
                                                                { label: `ID: ${row.id}` },
                                                                { label: `${severity[severityIndex]} Risk`, severity: severity[severityIndex] }
                                                            ],
                                                            component: <RecommendationPane recommendationId={row.id} type={RecommendationType.RECOMMENDATION} />
                                                        });
                                                    }}
                                                >
                                                    <Table.Cell value={row.recommendationName} />
                                                    <Table.Cell>
                                                        <div className={styles.dashboardTableMixedCell}>
                                                            <ShowIf condition={isPast(dueDate) || isToday(dueDate)}>
                                                                <SVG svgName="clock_snooze" />
                                                                <Else>
                                                                    <SVG svgName="clock_alarm" />
                                                                </Else>
                                                            </ShowIf>
                                                            <p>{getInterval(dueDate)}</p>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className={styles.dashboardTableMixedCell}>
                                                            <svg data-severity={severity[severityIndex]} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L4.29289 11.2929C3.90237 11.6834 3.90237 12.3166 4.29289 12.7071C4.68342 13.0976 5.31658 13.0976 5.70711 12.7071L11 7.41421L11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19L13 7.41421L18.2929 12.7071C18.6834 13.0976 19.3166 13.0976 19.7071 12.7071C20.0976 12.3166 20.0976 11.6834 19.7071 11.2929L12.7071 4.29289Z" fill="currentColor" />
                                                            </svg>
                                                            <p>{severity[severityIndex]}</p>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className={styles.dashboardTablePillMini}>
                                                            <Icon iconName="Add" />
                                                            <span>{improvement[severityIndex]}</span>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <UserPuckGroup style="normal">
                                                            <UserPuck imageSrc={UserPic1} userState={"offline"}></UserPuck>
                                                        </UserPuckGroup>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </>
                                )}
                            </AwaitQuery>
                            <AwaitQuery
                                query={adRecommendationQuery}
                                fallback={<Table.FallbackRow />}
                            >
                                {(recommendations) => (
                                    <>
                                        {recommendations.map((row, i) => {
                                            const dueDate = generateDueDate();
                                            const severityScore = row.priority.charAt(0).toUpperCase() + row.priority.slice(1) as Capitalize<typeof row.priority>;
                                            const improvementScore = improvement[severity.indexOf(severityScore)]
                                            return (
                                                <Table.Row
                                                    className={classNames(styles.dashboardTableRow, styles.clickable)}
                                                    key={`recommendation-${i}`}
                                                    onClick={() => {
                                                        setModal({
                                                            title: row.displayName,
                                                            tags: [
                                                                { label: `ID: ${row.id}` },
                                                                { label: `${severityScore} Risk`, severity: severityScore }
                                                            ],
                                                            component:
                                                                <RecommendationPane
                                                                    recommendationId={row.id}
                                                                    data={row.actionSteps}
                                                                    type={RecommendationType.AD_RECOMMENDATION}
                                                                />
                                                        });
                                                    }}
                                                >
                                                    <Table.Cell value={row.displayName} />
                                                    <Table.Cell>
                                                        <div className={styles.dashboardTableMixedCell}>
                                                            <ShowIf condition={isPast(dueDate) || isToday(dueDate)}>
                                                                <SVG svgName="clock_snooze" />
                                                                <Else>
                                                                    <SVG svgName="clock_alarm" />
                                                                </Else>
                                                            </ShowIf>
                                                            <p>{getInterval(dueDate)}</p>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className={styles.dashboardTableMixedCell}>
                                                            <svg data-severity={severityScore} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L4.29289 11.2929C3.90237 11.6834 3.90237 12.3166 4.29289 12.7071C4.68342 13.0976 5.31658 13.0976 5.70711 12.7071L11 7.41421L11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19L13 7.41421L18.2929 12.7071C18.6834 13.0976 19.3166 13.0976 19.7071 12.7071C20.0976 12.3166 20.0976 11.6834 19.7071 11.2929L12.7071 4.29289Z" fill="currentColor" />
                                                            </svg>
                                                            <p>{severityScore}</p>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className={styles.dashboardTablePillMini}>
                                                            <Icon iconName="Add" />
                                                            <span>{improvementScore}</span>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <UserPuckGroup style="normal">
                                                            <UserPuck imageSrc={UserPic1} userState={"offline"}></UserPuck>
                                                        </UserPuckGroup>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </>
                                )}
                            </AwaitQuery>
                        </Table.Body>
                    </Table>
                </TabsContent>
                <TabsContent value="collaborators">
                    <Table>
                        <Table.Head>
                            <Table.Cell>Name</Table.Cell>
                            <Table.Cell>Role</Table.Cell>
                            <Table.Cell>Date Started</Table.Cell>
                            <Table.Cell>Status</Table.Cell>
                            <Table.Cell>Actions</Table.Cell>
                        </Table.Head>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell className={styles.dashboardTableMixedCell}>
                                    <UserPuck imageSrc={UserPic1}></UserPuck>
                                    <p>Cameron Williamson</p>
                                </Table.Cell>
                                <Table.Cell>CEO</Table.Cell>
                                <Table.Cell>Jan 20, 2022</Table.Cell>
                                <Table.Cell>
                                    <p className={styles.dashboardTablePill} data-state="Active">Active</p>
                                </Table.Cell>
                                <Table.Cell className={styles.dashboardTableActionContainer}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 15L6.92474 18.1137C6.49579 18.548 6.28131 18.7652 6.09695 18.7805C5.93701 18.7938 5.78042 18.7295 5.67596 18.6076C5.55556 18.4672 5.55556 18.162 5.55556 17.5515V15.9916C5.55556 15.444 5.10707 15.0477 4.5652 14.9683V14.9683C3.25374 14.7762 2.22378 13.7463 2.03168 12.4348C2 12.2186 2 11.9605 2 11.4444V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H14.2C15.8802 2 16.7202 2 17.362 2.32698C17.9265 2.6146 18.3854 3.07354 18.673 3.63803C19 4.27976 19 5.11984 19 6.8V11M19 22L16.8236 20.4869C16.5177 20.2742 16.3647 20.1678 16.1982 20.0924C16.0504 20.0255 15.8951 19.9768 15.7356 19.9474C15.5558 19.9143 15.3695 19.9143 14.9969 19.9143H13.2C12.0799 19.9143 11.5198 19.9143 11.092 19.6963C10.7157 19.5046 10.4097 19.1986 10.218 18.8223C10 18.3944 10 17.8344 10 16.7143V14.2C10 13.0799 10 12.5198 10.218 12.092C10.4097 11.7157 10.7157 11.4097 11.092 11.218C11.5198 11 12.0799 11 13.2 11H18.8C19.9201 11 20.4802 11 20.908 11.218C21.2843 11.4097 21.5903 11.7157 21.782 12.092C22 12.5198 22 13.0799 22 14.2V16.9143C22 17.8462 22 18.3121 21.8478 18.6797C21.6448 19.1697 21.2554 19.5591 20.7654 19.762C20.3978 19.9143 19.9319 19.9143 19 19.9143V22Z" stroke="#88859F" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 5V4.2C14 3.0799 14 2.51984 13.782 2.09202C13.5903 1.71569 13.2843 1.40973 12.908 1.21799C12.4802 1 11.9201 1 10.8 1H9.2C8.07989 1 7.51984 1 7.09202 1.21799C6.71569 1.40973 6.40973 1.71569 6.21799 2.09202C6 2.51984 6 3.0799 6 4.2V5M1 5H19M17 5V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V5" stroke="#88859F" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 7.89543 0.89543 7 2 7C3.10457 7 4 7.89543 4 9C4 10.1046 3.10457 11 2 11C0.89543 11 0 10.1046 0 9Z" fill="#88859F" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2Z" fill="#88859F" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16C0 14.8954 0.89543 14 2 14C3.10457 14 4 14.8954 4 16C4 17.1046 3.10457 18 2 18C0.89543 18 0 17.1046 0 16Z" fill="#88859F" />
                                    </svg>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell className={styles.dashboardTableMixedCell}>
                                    <UserPuck imageSrc={UserPic3}></UserPuck>
                                    <p>Sam Brown</p>
                                </Table.Cell>
                                <Table.Cell>Cyber Expert</Table.Cell>
                                <Table.Cell>April 1, 2024</Table.Cell>
                                <Table.Cell>
                                    <p className={styles.dashboardTablePill} data-state="Pending">Pending</p>
                                </Table.Cell>
                                <Table.Cell className={styles.dashboardTableActionContainer}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 15L6.92474 18.1137C6.49579 18.548 6.28131 18.7652 6.09695 18.7805C5.93701 18.7938 5.78042 18.7295 5.67596 18.6076C5.55556 18.4672 5.55556 18.162 5.55556 17.5515V15.9916C5.55556 15.444 5.10707 15.0477 4.5652 14.9683V14.9683C3.25374 14.7762 2.22378 13.7463 2.03168 12.4348C2 12.2186 2 11.9605 2 11.4444V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H14.2C15.8802 2 16.7202 2 17.362 2.32698C17.9265 2.6146 18.3854 3.07354 18.673 3.63803C19 4.27976 19 5.11984 19 6.8V11M19 22L16.8236 20.4869C16.5177 20.2742 16.3647 20.1678 16.1982 20.0924C16.0504 20.0255 15.8951 19.9768 15.7356 19.9474C15.5558 19.9143 15.3695 19.9143 14.9969 19.9143H13.2C12.0799 19.9143 11.5198 19.9143 11.092 19.6963C10.7157 19.5046 10.4097 19.1986 10.218 18.8223C10 18.3944 10 17.8344 10 16.7143V14.2C10 13.0799 10 12.5198 10.218 12.092C10.4097 11.7157 10.7157 11.4097 11.092 11.218C11.5198 11 12.0799 11 13.2 11H18.8C19.9201 11 20.4802 11 20.908 11.218C21.2843 11.4097 21.5903 11.7157 21.782 12.092C22 12.5198 22 13.0799 22 14.2V16.9143C22 17.8462 22 18.3121 21.8478 18.6797C21.6448 19.1697 21.2554 19.5591 20.7654 19.762C20.3978 19.9143 19.9319 19.9143 19 19.9143V22Z" stroke="#88859F" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 5V4.2C14 3.0799 14 2.51984 13.782 2.09202C13.5903 1.71569 13.2843 1.40973 12.908 1.21799C12.4802 1 11.9201 1 10.8 1H9.2C8.07989 1 7.51984 1 7.09202 1.21799C6.71569 1.40973 6.40973 1.71569 6.21799 2.09202C6 2.51984 6 3.0799 6 4.2V5M1 5H19M17 5V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V5" stroke="#88859F" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 7.89543 0.89543 7 2 7C3.10457 7 4 7.89543 4 9C4 10.1046 3.10457 11 2 11C0.89543 11 0 10.1046 0 9Z" fill="#88859F" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2Z" fill="#88859F" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16C0 14.8954 0.89543 14 2 14C3.10457 14 4 14.8954 4 16C4 17.1046 3.10457 18 2 18C0.89543 18 0 17.1046 0 16Z" fill="#88859F" />
                                    </svg>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell className={styles.dashboardTableMixedCell}>
                                    <UserPuck imageSrc={UserPic2}></UserPuck>
                                    <p>Leslie Alexander</p>
                                </Table.Cell>
                                <Table.Cell>WAF Admin</Table.Cell>
                                <Table.Cell>November 5, 2023</Table.Cell>
                                <Table.Cell>
                                    <p className={styles.dashboardTablePill} data-state="Active">Active</p>
                                </Table.Cell>
                                <Table.Cell className={styles.dashboardTableActionContainer}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 15L6.92474 18.1137C6.49579 18.548 6.28131 18.7652 6.09695 18.7805C5.93701 18.7938 5.78042 18.7295 5.67596 18.6076C5.55556 18.4672 5.55556 18.162 5.55556 17.5515V15.9916C5.55556 15.444 5.10707 15.0477 4.5652 14.9683V14.9683C3.25374 14.7762 2.22378 13.7463 2.03168 12.4348C2 12.2186 2 11.9605 2 11.4444V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H14.2C15.8802 2 16.7202 2 17.362 2.32698C17.9265 2.6146 18.3854 3.07354 18.673 3.63803C19 4.27976 19 5.11984 19 6.8V11M19 22L16.8236 20.4869C16.5177 20.2742 16.3647 20.1678 16.1982 20.0924C16.0504 20.0255 15.8951 19.9768 15.7356 19.9474C15.5558 19.9143 15.3695 19.9143 14.9969 19.9143H13.2C12.0799 19.9143 11.5198 19.9143 11.092 19.6963C10.7157 19.5046 10.4097 19.1986 10.218 18.8223C10 18.3944 10 17.8344 10 16.7143V14.2C10 13.0799 10 12.5198 10.218 12.092C10.4097 11.7157 10.7157 11.4097 11.092 11.218C11.5198 11 12.0799 11 13.2 11H18.8C19.9201 11 20.4802 11 20.908 11.218C21.2843 11.4097 21.5903 11.7157 21.782 12.092C22 12.5198 22 13.0799 22 14.2V16.9143C22 17.8462 22 18.3121 21.8478 18.6797C21.6448 19.1697 21.2554 19.5591 20.7654 19.762C20.3978 19.9143 19.9319 19.9143 19 19.9143V22Z" stroke="#88859F" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 5V4.2C14 3.0799 14 2.51984 13.782 2.09202C13.5903 1.71569 13.2843 1.40973 12.908 1.21799C12.4802 1 11.9201 1 10.8 1H9.2C8.07989 1 7.51984 1 7.09202 1.21799C6.71569 1.40973 6.40973 1.71569 6.21799 2.09202C6 2.51984 6 3.0799 6 4.2V5M1 5H19M17 5V16.2C17 17.8802 17 18.7202 16.673 19.362C16.3854 19.9265 15.9265 20.3854 15.362 20.673C14.7202 21 13.8802 21 12.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V5" stroke="#88859F" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 7.89543 0.89543 7 2 7C3.10457 7 4 7.89543 4 9C4 10.1046 3.10457 11 2 11C0.89543 11 0 10.1046 0 9Z" fill="#88859F" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2Z" fill="#88859F" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16C0 14.8954 0.89543 14 2 14C3.10457 14 4 14.8954 4 16C4 17.1046 3.10457 18 2 18C0.89543 18 0 17.1046 0 16Z" fill="#88859F" />
                                    </svg>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </TabsContent>
            </Tabs>
            <Modal />
        </>
    );
}

export default Home;