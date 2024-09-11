import { Stack } from "@fluentui/react";
import { Answer } from "../../components/Answer";
import { ChatMessage, Citation, Extend } from "../../lib";
import styles from "./Chat.module.css";
import { parseCitationFromMessage } from "./Chat.utils";
import { ErrorCircleRegular } from "@fluentui/react-icons";
import { useMemo } from "react";

interface Props {
    answer: ChatMessage;
}

export const UserMessage = ({ answer }: Props) => {
    return (
        <div className={styles.chatMessageUser} tabIndex={0}>
            <div className={styles.chatMessageUserMessage}>{answer.content}</div>
        </div>
    );
}

interface AssistantProps {
    answers: ChatMessage[];
    onShowCitation: (c: Citation) => void;
    index: number;
}

export const AssistantMessage = ({ answers, answer, index, onShowCitation }: Extend<Props, AssistantProps>) => {
    return (
        <div className={styles.chatMessageGpt}>
            <Answer
                answer={{
                    answer: answer.content,
                    citations: parseCitationFromMessage(answers[index - 1]),
                }}
                onCitationClicked={c => onShowCitation(c)}
            />
        </div>
    );
}

export const ErrorMessage = ({ answer }: Props) => {
    return (
        <div className={styles.chatMessageError}>
            <Stack horizontal className={styles.chatMessageErrorContent}>
                <ErrorCircleRegular className={styles.errorIcon} stroke="#b63443" />
                <span style={{ color: "#b63443" }}>Error</span>
            </Stack>
            <span className={styles.chatMessageErrorContent} style={{ color: "#706e86" }}>{answer.content}</span>
        </div>
    );
}

interface SystemBaseProps {
    onShowMitigation: () => void;
}

type Content = {
    title: string;
    tableHeaders: string[];
    tableBody: string[][];
}

export const SystemBaseMessage = ({ answer, onShowMitigation }: Extend<Props, SystemBaseProps>) => {
    const content = useMemo(() => {
        return JSON.parse(answer.content) as Content;
    }, [answer.content]);

    return (
        <div className={styles.chatMessageSystem} tabIndex={0}>
            <h1 className={styles.chatMessageSystemHeader}>{content.title}</h1>
            <table className={styles.chatMessageSystemTable}>
                <thead>
                    <tr className={styles.chatMessageSystemTableHeader}>
                        {content.tableHeaders.map((header: string) => (
                            <th>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={styles.chatMessageSystemTableBody}>
                    {content.tableBody.map((row: string[]) => (
                        <tr className={row.length == 1 ? styles.chatMessageSystemTableTooltip : styles.chatMessageSystemTableRow}>
                            {row.map(cell => (
                                <td
                                    colSpan={(content.tableHeaders.length > row.length) ? content.tableHeaders.length / row.length : undefined}
                                    data-severity={["high", "medium", "low"].includes(cell.toLowerCase()) ? cell.toLowerCase() : undefined}
                                >
                                    {cell.startsWith("src") ? <img src={cell.slice(4)}></img> : <p>{cell}</p>}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.chatMessageSystemFooter}>
                <button className={styles.chatMessageSystemButton} onClick={() => onShowMitigation()}>Mitigate Now</button>
            </div>
        </div>
    );
}