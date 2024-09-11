import styles from "./CitationPane.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { isDefined } from "../../lib";
import { ShowIf } from "../ShowIf";

interface Props {
    content: string;
    title: string | null;
}

export const CitationPane = ({ content, title }: Props) => {
    return (
        <div className={styles.citationPanel} tabIndex={0} role="tabpanel" aria-label="Citations Panel">
                <ShowIf condition={isDefined(title)}>
                    <div className={styles.citationPanelHeader}>
                        {
                            title?.replace("url:", "||url:").split("||").map((header) => {
                                const [headerTitle, headerContent] = header.split(/(?<=^\w+):\s/);
                                return (
                                    <>
                                        <span className={styles.citationPanelHeaderTitle} tabIndex={0}>
                                            {headerTitle.charAt(0).toUpperCase() + headerTitle.slice(1)}:
                                        </span>
                                        <span className={styles.citationPanelHeaderContent}>{headerContent}</span>
                                    </>
                                );
                            })
                        }
                    </div>
                </ShowIf>
                <div className={styles.citationPanelContent} tabIndex={0}>
                    <ReactMarkdown
                        linkTarget="_blank"
                        children={content}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    />
                </div>
            </div>
    );
}