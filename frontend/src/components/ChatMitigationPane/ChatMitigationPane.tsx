import { useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";

import { MitigationData } from "../../lib";

import styles from "./ChatMitigationPane.module.css";

interface Props {
    content: MitigationData;
}

export const ChatMitigationPane = ({ content }: Props) => {
    const [activeTab, setActiveTab] = useState<number>(1);

    return (
        <div className={styles.chatMessageSystemMitigation}>
            <div className={styles.tabLayout}>
                <div className={styles.tabSelectorContainer}>
                    {["Plan", "Scripts"].map((label, index) => (
                        <button
                            className={(activeTab === index + 1) ? styles.tabSelectorActive : styles.tabSelector}
                            onClick={() => setActiveTab(index + 1)}
                            data-tab={index + 1}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className={(activeTab === 1) ? styles.tabContainerActive : styles.tabContainer}>
                    <h1 className={styles.tabTitle}>Mitigation plan</h1>
                    <p>The mitigation flow is as follows:</p>
                    <ol className={styles.tabList}>
                        {content.plan.map((step) => (
                            <li className={styles.tabListItem}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div className={(activeTab === 2) ? styles.tabContainerActive : styles.tabContainer}>
                    <h1 className={styles.tabTitle}>Scripts</h1>
                    <p>Below are the necessary scripts to implement the mitigations:</p>
                    <div className={styles.codeBlock}>
                        <CopyBlock
                            language={content.scriptLang}
                            text={content.script}
                            showLineNumbers={true}
                            theme={dracula}
                            codeBlock
                        />
                    </div>
                </div>
            </div>
        </div >
    );
}