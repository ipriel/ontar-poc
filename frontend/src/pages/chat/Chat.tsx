import { useRef, useState, useEffect } from "react";
import { IconButton, Stack } from "@fluentui/react";
import { SquareFilled, ShieldLockRegular, ErrorCircleRegular } from "@fluentui/react-icons";

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";

import styles from "./Chat.module.css";
import Ontar from "../../assets/ocf-white.svg";

import {
    ChatMessage,
    ConversationRequest,
    conversationApi,
    Citation,
    ToolMessageContent,
    ChatResponse,
    getUserInfo
} from "../../api";
import { Answer } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";

const Chat = () => {
    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
    const [activeCitation, setActiveCitation] = useState<[content: string, id: string, title: string, filepath: string, url: string, metadata: string]>();
    const [isCitationPanelOpen, setIsCitationPanelOpen] = useState<boolean>(false);
    const [answers, setAnswers] = useState<ChatMessage[]>([]);
    const abortFuncs = useRef([] as AbortController[]);
    const [showAuthMessage, setShowAuthMessage] = useState<boolean>(true);

    const getUserInfoList = async () => {
        const userInfoList = await getUserInfo();
        if (userInfoList.length === 0 && window.location.hostname !== "127.0.0.1") {
            setShowAuthMessage(true);
        }
        else {
            setShowAuthMessage(false);
        }
    }

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

        if (["What users were compromised?", "What servers were compromised?"].includes(question)) {
            let result: ChatMessage[] = [];
            if(question == "What users were compromised?") {
                result.push({ role: "system-base", content: "You have 4 compromised users:\n1. Jack Smith\n2. Mary Brown\n3. Paul Gold\n4. Alastor Jameson\n\nHowever, only 2 users require your immediate attention:"});
                result.push({ role: "system-issue", content: "# Alastor Jameson\nThis user is a System Admin and by being compromised an attacker can have the following privileges:\n1. Delete data\n2. Shutdown building access\n3. Delete Backups\n" });
                result.push({ role: "system-issue", content: "# Mary Brown\nThis user is an Admin and by being compromised an attacker can have the following privileges:\n1. Change policies\n2. Reset admin passwords\n3. Create additional users\n" });
            } else if (question == "What servers were compromised?") {
                result.push({ role: "system-base", content: "You have 4 compromised servers:\n1. vmware_124\n2. dc_01\n3. exch_02a\n4. erp254\n\nHowever, only 2 servers require your immediate attention:"});
                result.push({ role: "system-issue", content: "# dc_01\nThis server is a Domain Controller and by being compromised an attacker can have the following privileges:\n1. Access authentication keys\n2. Reset or create Priviledged Service Accounts\n3. Delete or corrupt Active Directory\n" });
                result.push({ role: "system-issue", content: "# exch_02a\nThis user is an Exchange Server and by being compromised an attacker can have the following privileges:\n1. Access internal communications and files\n2. Use trusted email addresses to spread attack to partners\n" });
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

    useEffect(() => {
        getUserInfoList();
    }, []);

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [showLoadingMessage]);

    const onShowCitation = (citation: Citation) => {
        setActiveCitation([citation.content, citation.id, citation.title ?? "", citation.filepath ?? "", "", ""]);
        setIsCitationPanelOpen(true);
    };

    const parseCitationFromMessage = (message: ChatMessage) => {
        if (message.role === "tool") {
            try {
                const toolMessage = JSON.parse(message.content) as ToolMessageContent;
                return toolMessage.citations;
            }
            catch {
                return [];
            }
        }
        return [];
    }

    const sampleQuestions = [
        "What users were compromised?",
        "What servers were compromised?",
        "How can businesses defend against social engineering attacks like pretexting?",
        "How does ransomware work, and how can organizations protect against it?",
        "Define a DDoS attack and suggest strategies to mitigate its impact.",
        "Define a zero-day exploit and discuss how organizations can respond to it.",
        "What is fishing, and how can individuals avoid falling for it?",
        "Explain the difference between a virus and a worm in cybersecurity."
    ]

    return (
        <div className={styles.container} role="main">
            {showAuthMessage ? (
                <Stack className={styles.chatEmptyState}>
                    <ShieldLockRegular className={styles.chatIcon} style={{ color: 'darkorange', height: "200px", width: "200px" }} />
                    <h1 className={styles.chatEmptyStateTitle}>Authentication Not Configured</h1>
                    <h2 className={styles.chatEmptyStateSubtitle}>
                        This app does not have authentication configured. Please add an identity provider by finding your app in the
                        <a href="https://portal.azure.com/" target="_blank"> Azure Portal </a>
                        and following
                        <a href="https://learn.microsoft.com/en-us/azure/app-service/scenario-secure-app-authentication-app-service#3-configure-authentication-and-authorization" target="_blank"> these instructions</a>.
                    </h2>
                    <h2 className={styles.chatEmptyStateSubtitle} style={{ fontSize: "20px" }}><strong>Authentication configuration takes a few minutes to apply. </strong></h2>
                    <h2 className={styles.chatEmptyStateSubtitle} style={{ fontSize: "20px" }}><strong>If you deployed in the last 10 minutes, please wait and reload the page after 10 minutes.</strong></h2>
                </Stack>
            ) : (
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
                                <div className={styles.logoContainer}>
                                    <svg width="44" height="55" viewBox="0 0 44 55" fill="#B955E3" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M37.9995 11.7211L21.5583 5.82193L5.11717 11.7211V25.6155C5.11717 32.2997 8.31162 38.5672 13.6831 42.4218L21.5583 48.0731L29.4337 42.4218C34.8051 38.5672 37.9995 32.2997 37.9995 25.6155V11.7211ZM21.5583 54.3682L32.3508 46.6233C39.0652 41.8049 43.0583 33.9708 43.0583 25.6155V8.08245L21.5583 0.368164L0.0583496 8.08245V25.6155C0.0583496 33.9708 4.05141 41.8049 10.7658 46.6233L21.5583 54.3682Z" fill="#B955E3" />
                                    </svg>
                                    <h1 className={styles.logoText}><span className={styles.logoTextHighlight}>ON</span>TAR</h1>
                                </div>
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
                                                    <span className={styles.chatMessageErrorContent}>{answer.content}</span>
                                                </div>
                                            ) : answer.role === "system-base" ? (
                                                <div className={styles.chatMessageSystem} tabIndex={0}>
                                                    <ReactMarkdown
                                                        linkTarget="_blank"
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeRaw]}
                                                        children={answer.content}
                                                        className={styles.chatMessageSystemMessage}
                                                    />
                                                </div>
                                            ) : answer.role === "system-issue" ? (
                                                <div className={styles.chatMessageSystem}>
                                                    <ReactMarkdown
                                                        linkTarget="_blank"
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeRaw]}
                                                        children={answer.content}
                                                        className={styles.chatMessageSystemIssue}
                                                    />
                                                    <div className={styles.chatMessageSystemFooter}>
                                                        <button className={styles.chatMessageSystemButton}>Mitigate Now</button>
                                                    </div>
                                                </div>
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
                                    {sampleQuestions.map((question) => (
                                        <div className={styles.sampleQuestionItem} onClick={e => makeApiRequest(question)}>
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
                                <Stack aria-label="Citations Panel Header Container" horizontal className={styles.citationPanelHeaderContainer} horizontalAlign="space-between" verticalAlign="center">
                                    <span aria-label="Citations" className={styles.citationPanelHeader}>Citations</span>
                                    <IconButton className={styles.citationPanelDismiss} iconProps={{ iconName: 'Cancel' }} aria-label="Close citations panel" onClick={() => setIsCitationPanelOpen(false)} />
                                </Stack>
                                <h5 className={styles.citationPanelTitle} tabIndex={0}>{activeCitation[2]}</h5>
                                <div className={styles.citationPanelContent} tabIndex={0}>
                                    <ReactMarkdown
                                        linkTarget="_blank"
                                        className={styles.citationPanelContent}
                                        children={activeCitation[0]}
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    />
                                </div>
                            </div>
                        </Stack.Item>
                    )}
                </Stack>
            )}
        </div>
    );
};

export default Chat;
