import { useRef, useEffect } from "react";
import { Stack } from "@fluentui/react";
import { SquareFilled } from "@fluentui/react-icons";

import logo from '../../assets/logo-wide.png';
import styles from "./Chat.module.css";

import { getSystemMitigationData, SAMPLE_QUESTIONS, useChatApi } from './Chat.utils';
import { QuestionInput } from "../../components/QuestionInput";
import { useModal } from "../../components/Modal";
import { CitationPane } from "../../components/CitationPane";
import { ChatMitigationPane } from "../../components/ChatMitigationPane";
import { ShowIf, Else } from '../../components/ShowIf/ShowIf';
import { AssistantMessage, ErrorMessage, SystemBaseMessage, UserMessage } from "./ChatAnswers";
import classNames from "classnames";

export const Chat = () => {
    const [Modal, setModal] = useModal();
    const [{answers, isLoading}, makeApiRequest, stopGenerating] = useChatApi()

    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [answers.length]);

    return (
        <div className={styles.container} role="main">
            <Stack
                horizontal
                className={classNames(styles.chatRoot, {[styles.chatRootActive]: answers.length > 0})}
            >
                <div className={styles.chatContainer}>
                    <ShowIf condition={answers.length == 0}>
                        <Stack className={styles.chatEmptyState}>
                            <img src={logo} />
                            <h2 className={styles.chatEmptyStateSubtitle}>How can I help you today?</h2>
                        </Stack>
                        <Else>
                            <div className={styles.chatMessageStream} style={{ marginBottom: isLoading ? "40px" : "0px" }} role="log">
                                {answers.map((answer, index) => (
                                    <>
                                        <ShowIf condition={answer.role === "user"}>
                                            <UserMessage answer={answer} />
                                        </ShowIf>
                                        <ShowIf condition={answer.role === "assistant"}>
                                            <AssistantMessage
                                                answer={answer}
                                                answers={answers}
                                                index={index}
                                                onShowCitation={({ title, content }) => {
                                                    setModal({
                                                        title: "Citation",
                                                        component: <CitationPane title={title} content={content} />
                                                    });
                                                }}
                                            />
                                        </ShowIf>
                                        <ShowIf condition={answer.role === "error"}>
                                            <ErrorMessage answer={answer} />
                                        </ShowIf>
                                        <ShowIf condition={answer.role === "system-base"}>
                                            <SystemBaseMessage
                                                answer={answer}
                                                onShowMitigation={() => {
                                                    setModal({
                                                        title: "Mitigations",
                                                        component: <ChatMitigationPane content={getSystemMitigationData()} />
                                                    })
                                                }}
                                            />
                                        </ShowIf>
                                    </>
                                ))}
                                <div ref={chatMessageStreamEnd} />
                            </div>
                        </Else>
                    </ShowIf>
                    <Stack horizontal className={styles.chatInput}>
                        <ShowIf condition={isLoading}>
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
                        </ShowIf>
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a new question..."
                            disabled={isLoading}
                            onSend={question => makeApiRequest(question)}
                        />
                    </Stack>
                    <ShowIf condition={answers.length == 0}>
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
                    </ShowIf>
                </div>
            </Stack>
            <Modal />
        </div>
    );
};

export default Chat;