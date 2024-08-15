import { create } from "zustand";
import { RiskyUser, Alert, Incident, Recommendation, Remediation, ServerPushEvent, PushEvent } from './models';
import { compareAsc, addHours } from "date-fns";

type RiskyUserState = {
  users: RiskyUser[];
  count: {
    high: number;
    medium: number;
    low: number;
  };
  parseUsers: (data: RiskyUser[]) => void;
  reset: () => void;
};

export const useRiskyUsersStore = create<RiskyUserState>((set) => ({
  users: [],
  count: {
    high: 0,
    medium: 0,
    low: 0,
  },
  parseUsers: (data: RiskyUser[]) => {
    let counter = { high: 0, medium: 0, low: 0 };
    data.forEach((user) => {
      if (user.riskLevel == "high") ++counter.high;
      else if (user.riskLevel == "medium") ++counter.medium;
      else /* user.riskLevel == "low" */ ++counter.low;
    });
    set({ users: [...data], count: Object.assign({}, counter) });
  },
  reset: () =>
    set({
      users: [],
      count: Object.assign({}, { high: 0, medium: 0, low: 0 }),
    }),
}));

type AlertState = {
  compromisedApps: number;
  compromisedNetworking: number;
  compromisedIot_Resources: number;
  calcCompromisedDevices: (alerts: Alert[]) => void;
  reset: () => void;
};

export const useAlertsStore = create<AlertState>((set) => ({
  compromisedApps: 0,
  compromisedNetworking: 0,
  compromisedIot_Resources: 0,
  calcCompromisedDevices: (alerts: Alert[]) => {
    alerts
      .flatMap((alert) => alert.evidence)
      .forEach((alert) => {
        switch (alert["@odata.type"]) {
          case "#microsoft.graph.security.azureResouceEvidence":
            set((state) => ({ compromisedApps: state.compromisedApps + 1 }));
            break;
          case "#microsoft.graph.security.ipEvidence":
            set((state) => ({
              compromisedNetworking: state.compromisedNetworking + 1,
            }));
            break;
          case "#microsoft.graph.security.deviceEvidence":
            set((state) => ({
              compromisedIot_Resources: state.compromisedIot_Resources + 1,
            }));
            break;
        }
      });
  },
  reset: () =>
    set({
      compromisedApps: 0,
      compromisedNetworking: 0,
      compromisedIot_Resources: 0,
    }),
}));

type IncidentState = {
  count: number;
  startDate: Date | null;
  description: string | null;
  name: string | null;
  calcCount: (data: Incident[]) => void;
  setMainIncident: (data: Incident[]) => void;
  reset: () => void;
};

export const useIncidentsStore = create<IncidentState>((set) => ({
  count: 0,
  startDate: null,
  description: null,
  name: null,
  calcCount: (data: Incident[]) => set({ count: data.length }),
  setMainIncident: (data: Incident[]) => {
    const mainIncident = data
      .map((incident) => ({
        startDate: new Date(incident.createdDateTime),
        description: incident.displayName,
        name: incident.determination.replaceAll(/(?<=[a-z])([A-Z])/, " $1"),
      }))
      .sort((a, b) => compareAsc(a.startDate, b.startDate))[0];

    set({
      startDate: mainIncident.startDate,
      description: mainIncident.description,
      name: mainIncident.name,
      count: data.length,
    });
  },
  reset: () =>
    set({
      count: 0,
      startDate: null,
      description: null,
      name: null,
    }),
}));

export type RecommendationSlice = {
  id: string;
  name: string;
  severity: number;
  scoreImprovement: number;
  dueDate: Date;
};

type RecommendationState = {
  recommendations: RecommendationSlice[];
  setRecommendations: (data: Recommendation[]) => void;
  reset: () => void;
};

function generateDueDate() {
  const currDate = new Date();
  const lastDate = addHours(currDate, 96);
  const diff = lastDate.getTime() - currDate.getTime();
  let randDateTimestamp = currDate.getTime() + Math.random() * diff;
  return new Date(randDateTimestamp);
}

export const useRecommendationsStore = create<RecommendationState>((set) => ({
  recommendations: [],
  setRecommendations: (data: Recommendation[]) => {
    const list = data.map((recommendation) => ({
      id: recommendation.id.slice(5),
      name: recommendation.recommendationName,
      severity: recommendation.severityScore,
      scoreImprovement: recommendation.configScoreImpact,
      dueDate: generateDueDate(),
    }));

    set({ recommendations: list });
  },
  reset: () =>
    set({
      recommendations: [],
    }),
}));

type RemediationSlice = {
  name: string;
  description: string;
  assignedTo: string;
  recommendationRef: string;
};

type RemediationsState = {
  remediations: RemediationSlice[];
  setRemediations: (data: Remediation[]) => void;
  reset: () => void;
};

export const useRemediationsStore = create<RemediationsState>((set) => ({
  remediations: [],
  setRemediations: (data: Remediation[]) => {
    const list = data.map((remediation) => ({
      name: remediation.title,
      description: remediation.description,
      assignedTo: remediation.requesterId,
      recommendationRef: remediation.recommendationReference.slice(5),
    }));

    set({ remediations: list });
  },
  reset: () =>
    set({
      remediations: [],
    }),
}));

function convertEvent(event: ServerPushEvent | Partial<ServerPushEvent>): PushEvent | Partial<PushEvent> {
  let entries = Object.entries(event);
  entries = entries.map(entry => {
    entry[0] = entry[0].charAt(0).toLowerCase() + entry[0].slice(1);
    return entry
  }); 
  return Object.fromEntries(entries);
}

type PushEventState = {
  events: PushEvent[];
  pushEvent: (event: ServerPushEvent) => void;
  updateEvent: (event: Partial<ServerPushEvent>) => void;
  reset: () => void;
};

export const useEventStore = create<PushEventState>((set) => ({
  events: [],
  pushEvent: (event: ServerPushEvent) => {
    const newEvent = convertEvent(event) as PushEvent;
    set((state) => ({ events: [...state.events, newEvent] }));
  },
  updateEvent: (update: Partial<ServerPushEvent>) =>
    set((state) => {
      const lastIndex = state.events.length - 1;
      const newEvent = {...state.events[lastIndex], ...(convertEvent(update) as Partial<PushEvent>)}; 
      state.events.pop()
      return { events: [...state.events, newEvent] };
    }),
  reset: () =>
    set({
      events: [],
    }),
}));

type Tag = {
  label: string;
  severity?: "Low" | "Medium" | "High";
};

type ModalContent = {
  title: string;
  tags?: Tag[];
  component?: JSX.Element;
};

type ModalState = {
  isVisible: boolean;
  content: ModalContent | null;
  open: (content?: ModalContent) => void;
  close: () => void;
  setContent: (content: ModalContent) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isVisible: false,
  content: null,
  open: (content) => {
    if(content)
      set({content})

    set((state) => {
      if (state.content == null)
        return state;

      return {isVisible: true};
    })
  },
  close: () =>
    set({
      isVisible: false,
      content: null
    }),
  setContent: (content: ModalContent) => {
    set({content});
  },
}));
