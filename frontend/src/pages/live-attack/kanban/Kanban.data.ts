import UserPic1 from "../../../assets/user-1.png";
import UserPic2 from "../../../assets/user-2.png";
import UserPic3 from "../../../assets/user-3.png";

type UserData = {
    uri: string;
    state: "online" | "offline" | "busy";
}

export type CardData = {
    title: String;
    target: {
        type: string;
        uri: string;
    };
    duration: string;
    users: UserData[];
    score: number;
    severity: "Low" | "Medium" | "High";
    category: "Assessment" | "In Progress" | "In Review" | "Done";
}

export const cards: CardData[] = [
    {
        title: "Sensitive Action Taken In Your Account",
        target: {
            type: "Mail Server",
            uri: "111.26.152.12"
        },
        duration: "1 hours ago",
        users: [{uri: UserPic1, state: "online"}],
        score: 20,
        severity: "High",
        category: "Assessment"
    },
    {
        title: "Contain Compromised Email Addresses",
        target: {
            type: "Mail Server",
            uri: "111.26.152.13"
        },
        duration: "2 hours ago",
        users: [{uri: UserPic2, state: "offline"}],
        score: 20,
        severity: "High",
        category: "In Progress"
    },
    {
        title: "IAM Passwords Reset",
        target: {
            type: "Mail Server",
            uri: "111.26.152.14"
        },
        duration: "2 hours ago",
        users: [{uri: UserPic3, state: "busy"}],
        score: 20,
        severity: "High",
        category: "In Review"
    },
    {
        title: "Unfamiliar Signing Property",
        target: {
            type: "Mail Server",
            uri: "111.26.152.15"
        },
        duration: "2 hours ago",
        users: [{uri: UserPic1, state: "online"}],
        score: 20,
        severity: "High",
        category: "In Review"
    },
    {
        title: "Block Attacker IP Range in WAF",
        target: {
            type: "Mail Server",
            uri: "111.26.152.16"
        },
        duration: "3 hours ago",
        users: [{uri: UserPic1, state: "online"}],
        score: 20,
        severity: "High",
        category: "Done"
    }
];