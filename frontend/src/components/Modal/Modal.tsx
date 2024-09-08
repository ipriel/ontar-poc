import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@fluentui/react";

import { useModalManager, ModalContent } from "./Modal.utils";
import styles from "./Modal.module.css";
import { ShowIf, Then } from "../ShowIf";
import { AwaitQuery } from "../AwaitQuery";

interface Props {
    title: string;
    tags?: { label: string, severity?: "Low" | "Medium" | "High" }[]
    onClose: () => void;
}

const ModalElement = ({ title, tags, onClose, children }: PropsWithChildren<Props>) => {
    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h1 className={styles.modalTitle}>{title}</h1>
                    {tags &&
                        <div className={styles.tagContainer}>
                            {tags.map((tag, i) =>
                                <div className={styles.tag} key={`tag-${i}`} {...(tag.severity ? { "data-severity": tag.severity } : {})}>
                                    {tag.severity ?
                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.00049 6V8.66667M8.00049 11.3333H8.00715M7.07737 2.59448L1.59411 12.0656C1.28997 12.5909 1.1379 12.8536 1.16038 13.0691C1.17998 13.2572 1.2785 13.428 1.4314 13.5392C1.60671 13.6667 1.91022 13.6667 2.51723 13.6667H13.4837C14.0908 13.6667 14.3943 13.6667 14.5696 13.5392C14.7225 13.428 14.821 13.2572 14.8406 13.0691C14.8631 12.8536 14.711 12.5909 14.4069 12.0656L8.92361 2.59448C8.62056 2.07104 8.46904 1.80932 8.27135 1.72142C8.09892 1.64474 7.90206 1.64474 7.72962 1.72142C7.53194 1.80932 7.38041 2.07104 7.07737 2.59448Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> : null}
                                    <span>{tag.label}</span>
                                </div>
                            )}
                        </div>}
                    <IconButton
                        className={styles.modalDismissButton}
                        iconProps={{ iconName: 'Cancel' }}
                        aria-label="Close mitigations panel"
                        onClick={onClose}
                    />
                </div>
                {children}
            </div>
        </div>
    );
};

const Modal = () => {
    const { close, useModalQuery } = useModalManager();
    const query = useModalQuery();
    
    return (
        <AwaitQuery query={query}>
            {(data) =>
                <ShowIf condition={data.isVisible}>
                    <Then using={data.content}>
                        {({ title, tags, component }) =>
                            createPortal(
                                <ModalElement title={title} {...(tags ? { tags: tags } : {})} onClose={close}>
                                    {component}
                                </ModalElement>,
                                document.body
                            )
                        }
                    </Then>
                </ShowIf>
            }
        </AwaitQuery>
    );
}

export const ModalFallback = () => {
    return <div className={styles.loader}></div>;
}

export function useModal(): [() => JSX.Element | null, (content?: ModalContent) => void] {
    const { open: setModal } = useModalManager();
    return [Modal, setModal];
}