import { useState, useRef, useEffect } from "react";
import { Icon, IconButton } from "@fluentui/react";
import { registerIcons } from '@fluentui/react/lib/Styling';
import { CodeBlock, dracula } from "react-code-blocks";
import ReactMarkdown from "react-markdown";
import classNames from "classnames";

import { RecommendationSlice, useRemediationsStore, isDefined } from "../../lib";
import { UserPuck } from "../UserPuck";

import styles from "./RecommendationPane.module.css";
import UserPic1 from "../../assets/user-1.png";
import { UserPuckGroup } from "../UserPuckGroup";
import { ShowIf } from "../ShowIf";

interface Props {
    data: RecommendationSlice;
}

const priority: { [k: string]: number } = {
    high: 1,
    medium: 2,
    low: 3
}

registerIcons({
    icons: {
        'InProgress': (
            <svg width="16" height="16" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.2071 0.892991C11.8166 0.502467 11.1834 0.502467 10.7929 0.892991C10.4024 1.28352 10.4024 1.91668 10.7929 2.3072L11.0897 2.60397C6.5118 3.28527 3 7.23252 3 12C3 15.1587 4.54258 17.9572 6.91114 19.6828C7.35752 20.0081 7.98302 19.9098 8.30824 19.4635C8.63345 19.0171 8.53523 18.3916 8.08885 18.0664C6.21475 16.701 5 14.4924 5 12C5 8.35575 7.59915 5.31856 11.0448 4.64107L10.7929 4.89299C10.4024 5.28352 10.4024 5.91668 10.7929 6.3072C11.1834 6.69773 11.8166 6.69773 12.2071 6.3072L14.2071 4.3072C14.5976 3.91668 14.5976 3.28352 14.2071 2.89299L12.2071 0.892991Z" fill="currentColor" />
                <path d="M18.0889 4.31708C17.6425 3.99186 17.017 4.09008 16.6918 4.53646C16.3665 4.98284 16.4648 5.60834 16.9111 5.93355C18.7853 7.29896 20 9.50753 20 11.9999C20 15.6441 17.4009 18.6813 13.9553 19.3588L14.2071 19.107C14.5976 18.7165 14.5976 18.0833 14.2071 17.6928C13.8166 17.3023 13.1834 17.3023 12.7929 17.6928L10.7929 19.6928C10.4024 20.0833 10.4024 20.7165 10.7929 21.107L12.7929 23.107C13.1834 23.4975 13.8166 23.4975 14.2071 23.107C14.5976 22.7165 14.5976 22.0833 14.2071 21.6928L13.9103 21.396C18.4882 20.7147 22 16.7674 22 11.9999C22 8.84123 20.4574 6.04273 18.0889 4.31708Z" fill="currentColor" />
            </svg>
        ),
        'AddSolid': (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5Z" fill="currentColor" />
            </svg>
        )
    }
});

function getLineCount(note: string) {
    if(note == null) return 0;

    return note.split("\n").length;
}

export const RecommendationPane = ({ data }: Props) => {
    const [comment, setComment] = useState<string>("");
    const [comments, setComments] = useState<string[]>(["**Note:** this action was taken 2 times"]);
    const remediations = useRemediationsStore((state) => {
        return state.remediations
            .filter(item =>
                item.recommendationRef == data.id &&
                item.status.toLowerCase() == "active"
            )
            .sort((a, b) => {
                const aNum = priority[a.priority.toLowerCase()];
                const bNum = priority[b.priority.toLowerCase()];
                if (aNum < bNum) return -1;
                else if (aNum > bNum) return 1;
                return 0;
            })
    });
    const commentListEndRef = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = () => {
        commentListEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (comments.length > 1)
            scrollToBottom()
    }, [comments]);

    function postComment(text: string) {
        if (text.length == 0) return;

        text = "**John Snow:** " + text;
        setComments([...comments, text]);
        setComment("");
    }

    return (
        <>
            <div className={styles.leftRightFlex}>
                <div>
                    <UserPuckGroup>
                        <UserPuck imageSrc={UserPic1}></UserPuck>
                    </UserPuckGroup>
                </div>
                <div className={styles.actionGroup}>
                    <button>
                        <Icon iconName="AddSolid" />
                        <span>Assign Task</span>
                    </button>
                    <button className={styles.accentButton}>
                        <Icon iconName="InProgress" />
                        <span>In Progress</span>
                        <Icon iconName="ChevronDown" />
                    </button>
                </div>
            </div>
            <div className={styles.stage}>
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 28V21M21 14H21.0175M5.25 13.8975V28.1025C5.25 28.7021 5.25 29.0019 5.33835 29.2693C5.41651 29.5059 5.54428 29.723 5.71311 29.9062C5.90395 30.1133 6.16603 30.2589 6.6902 30.5501L19.6402 37.7445C20.1365 38.0203 20.3847 38.1581 20.6475 38.2122C20.8801 38.26 21.1199 38.26 21.3525 38.2122C21.6153 38.1581 21.8635 38.0203 22.3598 37.7445L35.3098 30.5501C35.834 30.2589 36.0961 30.1133 36.2869 29.9062C36.4557 29.723 36.5835 29.5059 36.6617 29.2693C36.75 29.0019 36.75 28.7021 36.75 28.1025V13.8975C36.75 13.2979 36.75 12.9981 36.6617 12.7307C36.5835 12.4941 36.4557 12.277 36.2869 12.0938C36.0961 11.8867 35.834 11.7411 35.3098 11.4499L22.3598 4.25544C21.8635 3.97971 21.6153 3.84185 21.3525 3.7878C21.1199 3.73996 20.8801 3.73996 20.6475 3.7878C20.3847 3.84185 20.1365 3.97971 19.6402 4.25544L6.6902 11.4499C6.16603 11.7411 5.90395 11.8867 5.71311 12.0938C5.54428 12.277 5.41651 12.4941 5.33835 12.7307C5.25 12.9981 5.25 13.2979 5.25 13.8975Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p>What just happened?</p>
                <span><b>Note:</b> this action was taken 2 times</span>
            </div>
            <div className={styles.stage}>
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.75 8.73183C8.75 7.03229 8.75 6.18253 9.10436 5.7141C9.41307 5.30602 9.88491 5.05349 10.3957 5.023C10.982 4.98799 11.6891 5.45935 13.1032 6.40209L31.5054 18.6702C32.6738 19.4492 33.2581 19.8387 33.4617 20.3296C33.6396 20.7588 33.6396 21.2412 33.4617 21.6704C33.2581 22.1613 32.6738 22.5508 31.5054 23.3297L13.1032 35.5979C11.6891 36.5406 10.982 37.012 10.3957 36.977C9.88491 36.9465 9.41307 36.6939 9.10436 36.2859C8.75 35.8174 8.75 34.9677 8.75 33.2681V8.73183Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p>Mitigation steps</p>
                <span><b>Note:</b>{` You have to take ${remediations.length > 1 ? `these ${remediations.length} steps` : 'this step'} in the next few hours`}</span>
            </div>
            <div className={styles.remediationList}>
                <ShowIf condition={isDefined(remediations)}>
                    {remediations.map((remediation, i) =>
                        <div className={styles.leftRightFlex} key={`title-${i}`}>
                            <div className={styles.remediationItemContainer}>
                                <svg viewBox="0 16.28 46.826 7.343" width="46.826px" height="7.343px" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="20.6074" y1="19.743" x2="46.6274" y2="19.743" stroke="#C792FF" transform="matrix(1.0000000000000002, 0, 0, 1.0000000000000002, 0, 0)" />
                                    <circle cx="20.3179" cy="20" r="3.37256" fill="#C792FF" transform="matrix(1.0000000000000002, 0, 0, 1.0000000000000002, 0, 0)" />
                                </svg>
                                <p className={styles.remediationCounter}>{i + 1}</p>
                                <p className={styles.remediationLabel}>{remediation.name}</p>
                            </div>
                            <div>
                                <UserPuckGroup>
                                    <UserPuck imageSrc={UserPic1}></UserPuck>
                                </UserPuckGroup>
                            </div>
                        </div>
                    )}
                </ShowIf>
            </div>
            <div className={styles.codeBlock}>
                <div className={styles.codeBlockTitle}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="1" width="44" height="44" rx="8" fill="#141419" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M28.2929 17.2929C28.6834 16.9023 29.3166 16.9023 29.7071 17.2929L34.7071 22.2929C35.0976 22.6834 35.0976 23.3166 34.7071 23.7071L29.7071 28.7071C29.3166 29.0976 28.6834 29.0976 28.2929 28.7071C27.9024 28.3166 27.9024 27.6834 28.2929 27.2929L32.5858 23L28.2929 18.7071C27.9024 18.3166 27.9024 17.6834 28.2929 17.2929Z" fill="#E87474" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7071 17.2929C20.0976 17.6834 20.0976 18.3166 19.7071 18.7071L15.4142 23L19.7071 27.2929C20.0976 27.6834 20.0976 28.3166 19.7071 28.7071C19.3166 29.0976 18.6834 29.0976 18.2929 28.7071L13.2929 23.7071C12.9024 23.3166 12.9024 22.6834 13.2929 22.2929L18.2929 17.2929C18.6834 16.9023 19.3166 16.9023 19.7071 17.2929Z" fill="#E87474" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M26.2169 13.0238C26.7561 13.1436 27.096 13.6778 26.9762 14.2169L22.9762 32.2169C22.8564 32.756 22.3222 33.096 21.7831 32.9762C21.2439 32.8563 20.904 32.3222 21.0238 31.783L25.0238 13.783C25.1436 13.2439 25.6778 12.904 26.2169 13.0238Z" fill="#E87474" />
                    </svg>
                    <p>Copy this script!</p>
                </div>
                <ShowIf condition={isDefined(remediations)}>
                    <div className={styles.codeBlockContainer}>
                        {remediations.map((remediation, i) => 
                            <div className={styles.codeSectionContainer}>
                                <CodeBlock
                                    codeContainerStyle={{ background: "#141419" }}
                                    language={remediation.language}
                                    text={remediation.notes}
                                    theme={dracula}
                                    key={`note-${i}`}
                                    startingLineNumber={getLineCount(remediations[i-1]?.notes)+1}
                                />
                            </div>
                        )}
                    </div>
                </ShowIf>
            </div>
            <div className={classNames(styles.stage, styles.commentList)}>
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.25 14.875H21M12.25 21H26.25M16.9466 31.5H28.35C31.2903 31.5 32.7604 31.5 33.8834 30.9278C34.8713 30.4244 35.6744 29.6213 36.1778 28.6335C36.75 27.5104 36.75 26.0403 36.75 23.1V13.65C36.75 10.7097 36.75 9.23959 36.1778 8.11655C35.6744 7.1287 34.8713 6.32555 33.8834 5.82222C32.7604 5.25 31.2903 5.25 28.35 5.25H13.65C10.7097 5.25 9.23959 5.25 8.11655 5.82222C7.1287 6.32555 6.32555 7.1287 5.82222 8.11655C5.25 9.23959 5.25 10.7097 5.25 13.65V35.5871C5.25 36.5196 5.25 36.9859 5.44115 37.2253C5.60739 37.4336 5.85947 37.5547 6.12594 37.5545C6.43235 37.5541 6.79642 37.2629 7.52457 36.6803L11.6991 33.3407C12.5519 32.6585 12.9783 32.3174 13.4531 32.0748C13.8743 31.8596 14.3227 31.7023 14.7861 31.6072C15.3084 31.5 15.8545 31.5 16.9466 31.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p>Comments</p>
                <div className={styles.commentListContainer}>
                    {isDefined(comments) && comments.map(comment =>
                        <ReactMarkdown
                            children={comment}
                        />
                    )}
                    <div ref={commentListEndRef} />
                </div>
            </div>
            <div className={styles.commentInputField}>
                <Icon iconName="Emoji2" />
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => (e.key === "Enter" && !e.shiftKey) ? postComment(comment) : null}
                />
                <IconButton
                    iconProps={{ iconName: 'Send' }}
                    aria-label="Post comment"
                    onClick={() => setComments([...comments, comment])}
                    onKeyDown={e => (e.key === "Enter" || e.key === " ") ? postComment(comment) : null}
                />
            </div>
        </>
    );
};