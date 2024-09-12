import { CopyBlock, dracula } from "react-code-blocks";

import { MitigationData } from "../../lib";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/Tabs";

import styles from "./ChatMitigationPane.module.css";
import { Code24Regular, Play24Regular } from "@fluentui/react-icons";

interface Props {
    content: MitigationData;
}

export const ChatMitigationPane = ({ content }: Props) => {
    return (
        <div className={styles.chatMessageSystemMitigation}>
            <Tabs defaultValue="plan">
                <TabsList className={styles.tabTriggerContainer}>
                    <TabsTrigger value="plan">
                        <Play24Regular />
                        <span>Plan</span>
                    </TabsTrigger>
                    <TabsTrigger value="script">
                        <Code24Regular />
                        <span>Script</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="plan" className={styles.tabPanel}>
                    <div className={styles.stage}>
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.75 8.73183C8.75 7.03229 8.75 6.18253 9.10436 5.7141C9.41307 5.30602 9.88491 5.05349 10.3957 5.023C10.982 4.98799 11.6891 5.45935 13.1032 6.40209L31.5054 18.6702C32.6738 19.4492 33.2581 19.8387 33.4617 20.3296C33.6396 20.7588 33.6396 21.2412 33.4617 21.6704C33.2581 22.1613 32.6738 22.5508 31.5054 23.3297L13.1032 35.5979C11.6891 36.5406 10.982 37.012 10.3957 36.977C9.88491 36.9465 9.41307 36.6939 9.10436 36.2859C8.75 35.8174 8.75 34.9677 8.75 33.2681V8.73183Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <h1>Mitigation plan</h1>
                        <p>The mitigation flow is as follows:</p>
                    </div>
                    <div className={styles.tabList}>
                        {content.plan.map((step, i) => (
                            <div className={styles.tabListItem} key={`title-${i}`}>
                                <div className={styles.tabListMarker}>
                                    <svg viewBox="0 16.28 46.826 7.343" width="46.826px" height="7.343px" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <line x1="20.6074" y1="19.743" x2="46.6274" y2="19.743" stroke="#C792FF" transform="matrix(1.0000000000000002, 0, 0, 1.0000000000000002, 0, 0)" />
                                        <circle cx="20.3179" cy="20" r="3.37256" fill="#C792FF" transform="matrix(1.0000000000000002, 0, 0, 1.0000000000000002, 0, 0)" />
                                    </svg>
                                    <p className={styles.tabListCounter}>{i}</p>
                                </div>
                                <p className={styles.tabListLabel}>{step}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="script" className={styles.tabPanel}>
                    <div className={styles.stage}>
                        <svg viewBox="0 0 42 42" width="42px" height="42px" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(0.537482976913, 0, 0, 0.733760118484, 4.982603273967, 2.742209699961)" style={{transformOrigin: "-4.9826px -2.74221px"}}>
                                <path fill="currentColor" d="M 23.809 46.43 C 28.359 36.6 41.324 9.407 43.964 4.072 C 44.196 4.184 46.523 5.266 46.585 5.291 C 42.428 13.991 28.887 42.191 26.414 47.683 C 26.368 47.665 24.072 46.576 23.809 46.43 Z" />
                                <path fill="currentColor" d="M 63.855 27.297 C 64.035 27.316 50.678 41.018 49.315 42.143 C 48.682 41.58 47.837 40.633 47.548 40.382 C 51.44 36.288 60.516 27.432 60.516 27.432 C 60.516 27.432 51.516 18.364 47.351 14.024 C 47.79 13.586 49.252 12.231 49.281 12.21 C 51.82 15.332 63.68 26.295 63.855 27.297 Z"/>
                                <path fill="currentColor" d="M 4.32 26.487 C 4.613 26.113 17.635 13.799 19.343 12.093 C 19.418 12.159 20.788 13.489 21.152 13.791 C 17.904 17.316 7.945 26.259 7.734 26.781 C 7.584 27.151 18.496 38.554 20.171 40.287 C 19.906 40.792 18.99 41.355 18.568 41.744 C 16.359 40.28 7.708 30.144 4.32 26.487 Z" />
                            </g>
                        </svg>
                        <h1 className={styles.tabTitle}>Scripts</h1>
                        <p>Below are the necessary scripts to implement the mitigations:</p>
                    </div>
                    <div className={styles.codeBlock}>
                        <CopyBlock
                            language={content.scriptLang}
                            text={content.script}
                            showLineNumbers={true}
                            theme={dracula}
                            codeBlock
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
}