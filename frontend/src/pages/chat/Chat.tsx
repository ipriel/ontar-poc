import { useRef, useState, useEffect } from "react";
import { IconButton, Stack } from "@fluentui/react";
import { SquareFilled, ErrorCircleRegular } from "@fluentui/react-icons";

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import { CopyBlock, dracula } from "react-code-blocks";

import logo from '../../assets/logo-wide.png';
import styles from "./Chat.module.css";

import {
    ChatMessage,
    ConversationRequest,
    conversationApi,
    ChatResponse
} from "../../lib";
import { getSystemBaseMessage, getSystemMitigationMessage, parseCitationFromMessage, SAMPLE_QUESTIONS } from './Chat.utils';
import { Answer } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { Citation } from '../../lib/models';

export const Chat = () => {
    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
    const [activeCitation, setActiveCitation] = useState<[content: string, id: string, title: string, filepath: string, url: string, metadata: string]>();
    const [isCitationPanelOpen, setIsCitationPanelOpen] = useState<boolean>(false);
    const [activeMitigation, setActiveMitigation] = useState<number>(-1);
    const [activeTab, setActiveTab] = useState<number>(1);
    const [answers, setAnswers] = useState<ChatMessage[]>([]);
    const abortFuncs = useRef([] as AbortController[]);

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        setIsLoading(true);
        setShowLoadingMessage(true);
        const abortController = new AbortController();
        abortFuncs.current.unshift(abortController);

        const userMessage: ChatMessage = {
            role: "user",
            content: question
        };

        if (["What users were compromised?"].includes(question)) {
            let result: ChatMessage[] = [];
            if (question == "What users were compromised?") {
                result.push(getSystemBaseMessage());
                result.push(getSystemMitigationMessage());
            }

            setAnswers([...answers, userMessage, ...result]);
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
            return abortController.abort();
        }

        const request: ConversationRequest = {
            messages: [...answers.filter((answer) => ["user", "assistant"].includes(answer.role)), userMessage]
        };

        let result = {} as ChatResponse;
        try {
            const response = await conversationApi(request, abortController.signal);
            if (response?.body) {

                const reader = response.body.getReader();
                let runningText = "";
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    var text = new TextDecoder("utf-8").decode(value);
                    const objects = text.split("\n");
                    objects.forEach((obj) => {
                        try {
                            runningText += obj;
                            result = JSON.parse(runningText);
                            setShowLoadingMessage(false);
                            setAnswers([...answers, userMessage, ...result.choices[0].messages]);
                            runningText = "";
                        }
                        catch { }
                    });
                }
                setAnswers([...answers, userMessage, ...result.choices[0].messages]);
            }

        } catch (e) {
            if (!abortController.signal.aborted) {
                console.error(result);
                let errorMessage = "An error occurred. Please try again. If the problem persists, please contact the site administrator.";
                if (result.error?.message) {
                    errorMessage = result.error.message;
                }
                else if (typeof result.error === "string") {
                    errorMessage = result.error;
                }
                setAnswers([...answers, userMessage, {
                    role: "error",
                    content: errorMessage
                }]);
            } else {
                setAnswers([...answers, userMessage]);
            }
        } finally {
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
        }

        return abortController.abort();
    };

    const stopGenerating = () => {
        abortFuncs.current.forEach(a => a.abort());
        setShowLoadingMessage(false);
        setIsLoading(false);
    }

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [showLoadingMessage]);

    const onShowCitation = (citation: Citation) => {
        setActiveCitation([citation.content, citation.id, citation.title ?? "", citation.filepath ?? "", "", ""]);
        setIsCitationPanelOpen(true);
    };

    return (
        <div className={styles.container} role="main">
            <Stack
                horizontal
                className={styles.chatRoot}
                style={{
                    flex: lastQuestionRef.current ? 1 : 0
                }}
            >
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <Stack className={styles.chatEmptyState}>
                            <img src={logo} />
                            <h2 className={styles.chatEmptyStateSubtitle}>How can I help you today?</h2>
                        </Stack>
                    ) : (
                        <div className={styles.chatMessageStream} style={{ marginBottom: isLoading ? "40px" : "0px" }} role="log">
                            {answers.map((answer, index) => (
                                <>
                                    {
                                        answer.role === "user" ? (
                                            <div className={styles.chatMessageUser} tabIndex={0}>
                                                <div className={styles.chatMessageUserMessage}>{answer.content}</div>
                                            </div>
                                        ) : answer.role === "assistant" ? (
                                            <div className={styles.chatMessageGpt}>
                                                <Answer
                                                    answer={{
                                                        answer: answer.content,
                                                        citations: parseCitationFromMessage(answers[index - 1]),
                                                    }}
                                                    onCitationClicked={c => onShowCitation(c)}
                                                />
                                            </div>
                                        ) : answer.role === "error" ? (
                                            <div className={styles.chatMessageError}>
                                                <Stack horizontal className={styles.chatMessageErrorContent}>
                                                    <ErrorCircleRegular className={styles.errorIcon} stroke="#b63443" />
                                                    <span style={{ color: "#b63443" }}>Error</span>
                                                </Stack>
                                                <span className={styles.chatMessageErrorContent} style={{ color: "#706e86" }}>{answer.content}</span>
                                            </div>
                                        ) : answer.role === "system-base" ? (
                                            <div className={styles.chatMessageSystem} tabIndex={0}>
                                                {[JSON.parse(answer.content)].map(content => (
                                                    <>
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
                                                    </>
                                                ))}
                                                <div className={styles.chatMessageSystemFooter}>
                                                    <button className={styles.chatMessageSystemButton} onClick={() => setActiveMitigation(index + 1)}>Mitigate Now</button>
                                                </div>
                                            </div>
                                        ) : answer.role === "system-mitigation" && activeMitigation === index ? (
                                            <div className={styles.chatMessageSystemMitigation}>
                                                {[JSON.parse(answer.content)].map(content => (
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
                                                        <IconButton
                                                            className={styles.tabLayoutDismiss}
                                                            iconProps={{ iconName: 'Cancel' }}
                                                            aria-label="Close mitigations panel"
                                                            onClick={() => {
                                                                setActiveMitigation(-1);
                                                                setActiveTab(1);
                                                            }}
                                                        />
                                                        <div className={(activeTab === 1) ? styles.tabContainerActive : styles.tabContainer}>
                                                            <h1 className={styles.tabTitle}>Mitigation plan</h1>
                                                            <p>The mitigation flow is as follows:</p>
                                                            <ol className={styles.tabList}>
                                                                {content.plan.map((step: string) => (
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
                                                ))}
                                            </div >
                                        ) : null
                                    }
                                </>
                            ))}
                            {showLoadingMessage && (
                                <>
                                    <div className={styles.chatMessageUser}>
                                        <div className={styles.chatMessageUserMessage}>{lastQuestionRef.current}</div>
                                    </div>
                                    <div className={styles.chatMessageGpt}>
                                        <Answer
                                            answer={{
                                                answer: "Generating answer...",
                                                citations: []
                                            }}
                                            onCitationClicked={() => null}
                                        />
                                    </div>
                                </>
                            )}
                            <div ref={chatMessageStreamEnd} />
                        </div>
                    )}

                    <Stack horizontal className={styles.chatInput}>
                        {isLoading && (
                            <Stack
                                horizontal
                                className={styles.stopGeneratingContainer}
                                role="button"
                                aria-label="Stop generating"
                                tabIndex={0}
                                onClick={stopGenerating}
                                onKeyDown={e => e.key === "Enter" || e.key === " " ? stopGenerating() : null}
                            >
                                <SquareFilled className={styles.stopGeneratingIcon} aria-hidden="true" />
                                <span className={styles.stopGeneratingText} aria-hidden="true">Stop generating</span>
                            </Stack>
                        )}
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a new question..."
                            disabled={isLoading}
                            onSend={question => makeApiRequest(question)}
                        />
                    </Stack>
                    {!lastQuestionRef.current && (
                        <>
                            <Stack horizontal className={styles.suggestionHeaderContainer}>
                                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5583 18.8682L10.4583 18.7181C9.76365 17.6761 9.41633 17.1551 8.95745 16.778C8.55121 16.4441 8.08311 16.1936 7.57995 16.0408C7.0116 15.8682 6.38546 15.8682 5.13317 15.8682H3.75835C2.63824 15.8682 2.07819 15.8682 1.65037 15.6502C1.27404 15.4584 0.968083 15.1525 0.776337 14.7761C0.55835 14.3483 0.55835 13.7883 0.55835 12.6682V4.06816C0.55835 2.94806 0.55835 2.38801 0.776337 1.96018C0.968083 1.58386 1.27404 1.2779 1.65037 1.08615C2.07819 0.868164 2.63824 0.868164 3.75835 0.868164H4.15835C6.39856 0.868164 7.51866 0.868164 8.37431 1.30414C9.12696 1.68763 9.73888 2.29955 10.1224 3.0522C10.5583 3.90785 10.5583 5.02795 10.5583 7.26816M10.5583 18.8682V7.26816M10.5583 18.8682L10.6584 18.7181C11.353 17.6761 11.7004 17.1551 12.1592 16.778C12.5655 16.4441 13.0336 16.1936 13.5367 16.0408C14.1051 15.8682 14.7312 15.8682 15.9835 15.8682H17.3583C18.4785 15.8682 19.0385 15.8682 19.4663 15.6502C19.8427 15.4584 20.1486 15.1525 20.3404 14.7761C20.5583 14.3483 20.5583 13.7883 20.5583 12.6682V4.06816C20.5583 2.94806 20.5583 2.38801 20.3404 1.96018C20.1486 1.58386 19.8427 1.2779 19.4663 1.08615C19.0385 0.868164 18.4785 0.868164 17.3583 0.868164H16.9583C14.7181 0.868164 13.598 0.868164 12.7424 1.30414C11.9897 1.68763 11.3778 2.29955 10.9943 3.0522C10.5583 3.90785 10.5583 5.02795 10.5583 7.26816" stroke="#C792FF" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className={styles.suggestionHeaderTitle}><span className={styles.suggestionHeaderTitleEmphasis}>Cyber Sentinel Q&A: </span>Unveiling Digital Threats</p>
                                <svg className={styles.suggestionHeaderSearchIcon} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.55835 0.868164C4.14007 0.868164 0.55835 4.44989 0.55835 8.86816C0.55835 13.2864 4.14007 16.8682 8.55835 16.8682C10.4071 16.8682 12.1093 16.2411 13.464 15.188L18.8512 20.5753C19.2418 20.9658 19.8749 20.9658 20.2655 20.5753C20.656 20.1847 20.656 19.5516 20.2655 19.1611L14.8782 13.7738C15.9313 12.4191 16.5583 10.7169 16.5583 8.86816C16.5583 4.44989 12.9766 0.868164 8.55835 0.868164ZM2.55835 8.86816C2.55835 5.55446 5.24464 2.86816 8.55835 2.86816C11.8721 2.86816 14.5583 5.55446 14.5583 8.86816C14.5583 12.1819 11.8721 14.8682 8.55835 14.8682C5.24464 14.8682 2.55835 12.1819 2.55835 8.86816Z" fill="#89859F" />
                                </svg>
                            </Stack>
                            <div className={styles.sampleQuestionGrid}>
                                {SAMPLE_QUESTIONS.map((question) => (
                                    <div className={styles.sampleQuestionItem} onClick={() => makeApiRequest(question)}>
                                        <p className={styles.sampleQuestionText}>{question}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                {answers.length > 0 && isCitationPanelOpen && activeCitation && (
                    <Stack.Item className={styles.citationPanelWrapper}>
                        <div className={styles.citationPanel} tabIndex={0} role="tabpanel" aria-label="Citations Panel">
                            <Stack aria-label="Citations Panel Header Container" horizontal className={styles.citationPanelTitleContainer} horizontalAlign="space-between" verticalAlign="center">
                                <span aria-label="Citations" className={styles.citationPanelTitle}>Citations</span>
                                <IconButton className={styles.citationPanelDismiss} iconProps={{ iconName: 'Cancel' }} aria-label="Close citations panel" onClick={() => setIsCitationPanelOpen(false)} />
                            </Stack>
                            <div className={styles.citationPanelHeader}>
                                {
                                    activeCitation[2].replace("url:", "||url:").split("||").map(header => header.split(/(?<=^\w+):\s/)).map((header => (
                                        <>
                                            <span className={styles.citationPanelHeaderTitle} tabIndex={0}>{header[0].charAt(0).toUpperCase() + header[0].slice(1)}: </span>
                                            <span className={styles.citationPanelHeaderContent}>{header[1]}</span>
                                        </>
                                    )))
                                }
                            </div>
                            <div className={styles.citationPanelContent} tabIndex={0}>
                                <ReactMarkdown
                                    linkTarget="_blank"
                                    children={activeCitation[0]}
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                />
                            </div>
                        </div>
                    </Stack.Item>
                )}
            </Stack>
        </div>
    );
};

export default Chat;