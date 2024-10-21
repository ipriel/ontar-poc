
import { TagGroup, TagData } from "../../../components/TagGroup";
import { UserPuck } from "../../../components/UserPuck";
import { UserPuckGroup } from "../../../components/UserPuckGroup";

import { cards, CardData } from "./Kanban.data";
import styles from "./Kanban.module.css";

interface Props {
    data: CardData
}
const KanbanCard = ({ data }: Props) => {
    const tags: TagData[] = [
        { label: `+ ${data.score}` },
        { label: data.severity, severity: data.severity }
    ]
    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>{data.title}</h2>
            <div className={styles.cardData}>
                <svg viewBox="0 0 18 18" width="18px" height="18px" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75 6.75V6C6.75 5.40326 6.98705 4.83097 7.40901 4.40901C7.83097 3.98705 8.40326 3.75 9 3.75C9.59674 3.75 10.169 3.98705 10.591 4.40901C11.0129 4.83097 11.25 5.40326 11.25 6V6.75" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6 6.75H12C12.4467 7.41944 12.7057 8.19643 12.75 9V11.25C12.75 12.2446 12.3549 13.1984 11.6517 13.9017C10.9484 14.6049 9.99456 15 9 15C8.00544 15 7.05161 14.6049 6.34835 13.9017C5.64509 13.1984 5.25 12.2446 5.25 11.25V9C5.2943 8.19643 5.5533 7.41944 6 6.75Z" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M2.25 9.75H5.25" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.75 9.75H15.75" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 15V10.5" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 14.25L5.5125 12.75" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15 14.25L12.4875 12.75" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 5.25L5.8125 7.05" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15 5.25L12.1875 7.05" stroke="#E87474" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>{data.target.type}</span> → <span className={styles.accent}>{data.target.uri}</span>
            </div>
            <div className={styles.cardData}>
                <svg viewBox="0 0 18 18" width="18px" height="18px" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 9 4.2 L 9 9 L 12.2 10.6 M 17 9 C 17 13.418 13.418 17 9 17 C 4.582 17 1 13.418 1 9 C 1 4.582 4.582 1 9 1 C 13.418 1 17 4.582 17 9 Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -4.440892098500626e-16, 0)" />
                </svg>
                <span>{data.duration}</span>
            </div>
            <div className={styles.footer}>
                <UserPuckGroup>
                    {data.users.map((user, i) => (
                        <UserPuck imageSrc={user.uri} key={`user-${i}`} userState={user.state} />
                    ))}
                </UserPuckGroup>
                <TagGroup tags={tags} />
            </div>
        </div>
    );
}

export const Kanban = () => {
    return (
        <div className={styles.container}>
            {["Assessment", "In Progress", "In Review", "Done"].map((category) => (
                <div key={category}>
                    <div className={styles.header}>
                        <h1 className={styles.categoryTitle}>{category}</h1>
                        <button>+</button>
                    </div>
                    <div className={styles.cardContainer}>
                        {(cards).filter((card) => card.category == category).map((card) => (
                            <KanbanCard data={card}></KanbanCard>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Kanban;