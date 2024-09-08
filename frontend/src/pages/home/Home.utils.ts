
import { RiskyUser, Alert } from "../../lib/models";
import { format, differenceInCalendarDays, isPast, isToday, addHours } from "date-fns";

// Utilities

export function generateDueDate() {
    const currDate = new Date();
    const lastDate = addHours(currDate, 96);
    const diff = lastDate.getTime() - currDate.getTime();
    let randDateTimestamp = currDate.getTime() + Math.random() * diff;
    return new Date(randDateTimestamp);
}

export function getInterval(targetDate: Date) {
    if (isPast(targetDate) && differenceInCalendarDays(new Date(), targetDate) == 1) {
        return `Yesterday ${format(targetDate, "h:mmaa")}`;
    }
    else if (!isPast(targetDate) && differenceInCalendarDays(targetDate, new Date()) == 1) {
        return `Tomorrow ${format(targetDate, "h:mmaa")}`;
    }
    else if (isToday(targetDate)) {
        return `Today ${format(targetDate, "h:mmaa")}`;
    }
    else {
        return format(targetDate, "d.M.yyyy h:mmaa");
    }
};

export function parseSeverity(severity: number) {
    return Math.floor(severity / 4);
}

// QuerySelectors

export function alertSelector(alerts: Alert[]) {
    let compromisedApps = 0;
    let compromisedNetworking = 0;
    let compromisedResources = 0;

    alerts
        .flatMap((alert) => alert.evidence)
        .forEach((alert) => {
            switch (alert["@odata.type"]) {
                case "#microsoft.graph.security.azureResourceEvidence":
                    ++compromisedApps;
                    break;
                case "#microsoft.graph.security.ipEvidence":
                    ++compromisedNetworking;
                    break;
                case "#microsoft.graph.security.deviceEvidence":
                    ++compromisedResources;
                    break;
            }
        });

    return { compromisedApps, compromisedNetworking, compromisedResources };
}

export function riskyUserSelector(users: RiskyUser[]) {
    let low = 0;
    let medium = 0;
    let high = 0;

    users.forEach((user) => {
        if (user.riskLevel == "high") ++high;
        else if (user.riskLevel == "medium") ++medium;
        else ++low; /* user.riskLevel == "low" */
    });

    return { users, count: { low, medium, high, total: low + medium + high } };
}