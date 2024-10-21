import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@fluentui/react";

import { useModalManager, ModalContent } from "./Modal.utils";
import styles from "./Modal.module.css";
import { ShowIf, Then } from "../ShowIf";
import { TagGroup, TagData } from "../TagGroup";
import { AwaitQuery } from "../AwaitQuery";
import { isDefined } from "../../lib";

interface Props {
    title: string;
    tags?: TagData[]
    onClose: () => void;
}

const ModalElement = ({ title, tags, onClose, children }: PropsWithChildren<Props>) => {
    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h1 className={styles.modalTitle}>{title}</h1>
                    <ShowIf condition={isDefined(tags)}>
                        <Then using={tags}>
                            {(tags) => (
                                <TagGroup tags={tags} />
                            )}
                        </Then>
                    </ShowIf>
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