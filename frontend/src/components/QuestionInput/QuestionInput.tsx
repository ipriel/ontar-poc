import { useState } from "react";
import { Stack } from "@fluentui/react";
import styles from "./QuestionInput.module.css";

interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend }: Props) => {
    const [question, setQuestion] = useState<string>("");

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        onSend(question);

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        console.log(newValue);
        setQuestion(newValue || "");
    };

    const sendQuestionDisabled = disabled || !question.trim();

    return (
        <Stack horizontal className={styles.questionInputContainer}>
            <svg style={{ marginInline: "12px" }} width="35" height="31" viewBox="0 0 35 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.55835 12.3682C5.55835 10.159 7.34921 8.36816 9.55835 8.36816H25.5583C27.7675 8.36816 29.5583 10.159 29.5583 12.3682V21.1682C29.5583 23.3773 27.7675 25.1682 25.5584 25.1682H20.4397C19.7315 25.1682 19.036 25.3562 18.4243 25.713L12.1583 29.3682V25.1682H9.55835C7.34921 25.1682 5.55835 23.3773 5.55835 21.1682V12.3682Z" fill="#C792FF" fill-opacity="0.8" stroke="#C792FF" stroke-opacity="0.8" stroke-width="2" stroke-linejoin="round" />
                <circle cx="12.0583" cy="16.8682" r="2.5" fill="#201F27" />
                <circle cx="23.0583" cy="16.8682" r="2.5" fill="#201F27" />
                <circle cx="16.0583" cy="4.03483" r="1.66667" stroke="#C792FF" stroke-width="2" />
                <path d="M29.5583 14.3682H32.5583C33.6629 14.3682 34.5583 15.2636 34.5583 16.3682V17.3682C34.5583 18.4727 33.6629 19.3682 32.5583 19.3682H29.5583V14.3682Z" fill="#C792FF" fill-opacity="0.8" />
                <path d="M0.55835 16.3682C0.55835 15.2636 1.45378 14.3682 2.55835 14.3682H5.55835V19.3682H2.55835C1.45378 19.3682 0.55835 18.4727 0.55835 17.3682V16.3682Z" fill="#C792FF" fill-opacity="0.8" />
            </svg>
            <input
                className={styles.questionInputTextArea}
                placeholder={placeholder}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={onEnterPress}
            />
            <div className={styles.questionInputSendButtonContainer}
                role="button"
                tabIndex={0}
                aria-label="Ask question button"
                onClick={sendQuestion}
                onKeyDown={e => e.key === "Enter" || e.key === " " ? sendQuestion() : null}
            >
                <svg
                    className={styles.questionInputSendButton}
                    width="23"
                    height="21"
                    viewBox="0 0 23 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path stroke={sendQuestionDisabled ? "#5C5A73" : "#C792FF"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M11.5583 19.8682L11.4583 19.7181C10.7637 18.6761 10.4163 18.1551 9.95745 17.778C9.55121 17.4441 9.08311 17.1936 8.57995 17.0408C8.0116 16.8682 7.38546 16.8682 6.13317 16.8682H4.75835C3.63824 16.8682 3.07819 16.8682 2.65037 16.6502C2.27404 16.4584 1.96808 16.1525 1.77634 15.7761C1.55835 15.3483 1.55835 14.7883 1.55835 13.6682V5.06816C1.55835 3.94806 1.55835 3.38801 1.77634 2.96018C1.96808 2.58386 2.27404 2.2779 2.65037 2.08615C3.07819 1.86816 3.63824 1.86816 4.75835 1.86816H5.15835C7.39856 1.86816 8.51866 1.86816 9.37431 2.30414C10.127 2.68763 10.7389 3.29955 11.1224 4.0522C11.5583 4.90785 11.5583 6.02795 11.5583 8.26816M11.5583 19.8682V8.26816M11.5583 19.8682L11.6584 19.7181C12.353 18.6761 12.7004 18.1551 13.1592 17.778C13.5655 17.4441 14.0336 17.1936 14.5367 17.0408C15.1051 16.8682 15.7312 16.8682 16.9835 16.8682H18.3583C19.4785 16.8682 20.0385 16.8682 20.4663 16.6502C20.8427 16.4584 21.1486 16.1525 21.3404 15.7761C21.5583 15.3483 21.5583 14.7883 21.5583 13.6682V5.06816C21.5583 3.94806 21.5583 3.38801 21.3404 2.96018C21.1486 2.58386 20.8427 2.2779 20.4663 2.08615C20.0385 1.86816 19.4785 1.86816 18.3583 1.86816H17.9583C15.7181 1.86816 14.598 1.86816 13.7424 2.30414C12.9897 2.68763 12.3778 3.29955 11.9943 4.0522C11.5583 4.90785 11.5583 6.02795 11.5583 8.26816" />
                </svg>
            </div>
        </Stack>
    );
};
