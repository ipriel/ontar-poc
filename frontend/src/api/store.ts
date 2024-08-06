import { DocumentLandscapeSplitHint24Filled } from "@fluentui/react-icons";
import { create } from "zustand";
import { RiskyUser, Alert, Incident, Recommendation, Remediation } from './models';
import { compareAsc } from "date-fns";

type RiskyUserState = {
  count: number
}

export const useRiskyUsersStore = create<RiskyUserState>((set) => ({
  count: 0,
  calcCount: (data: RiskyUser[]) => set({ count: data.length }),
  resetCount: () => set({ count: 0 }),
}));

type AlertState = {
  compromisedApps: number;
  compromisedNetworking: number;
  compromisedIot_Resources: number;
}

export const useAlertsStore = create<AlertState>((set) => ({
  compromisedApps: 0,
  compromisedNetworking: 0,
  compromisedIot_Resources: 0,
  calcCompromisedDevices: (alerts: Alert[]) => {
    alerts.flatMap(alert => alert.evidence).forEach(alert => {
      switch(alert["@odata.type"]) {
        case "azureResouceEvidence":
          set((state) => ({ compromisedApps: state.compromisedApps + 1 }))
          break;
        case "ipEvidence":
          set((state) => ({ compromisedNetworking: state.compromisedNetworking + 1 }))
          break;
        case "deviceEvidence":
          set((state) => ({ compromisedIot_Resources: state.compromisedIot_Resources + 1 }))
          break;
      }
    });
  },
  reset: () => set({
      compromisedApps: 0,
      compromisedNetworking: 0,
      compromisedIot_Resources: 0
    }),
}));

type IncidentState = {
  count: number;
  startDate: Date | null;
  description: string | null;
  name: string | null;
}

export const useIncidentsStore = create<IncidentState>((set) => ({
  count: 1/*0*/,
  startDate: new Date("8/6/2024 17:00")/*null*/,
  description: null,
  name: null,
  calcCount: (data: Incident[]) => set({count: data.length}),
  setMainIncident: (data: Incident[]) => {
    const mainIncident = data
      .map((incident) => ({
        startDate: new Date(incident.createdDateTime),
        description: incident.displayName,
        name: incident.determination.replaceAll(/(?<=[a-z])([A-Z])/," $1")
      }))
      .sort((a, b)=>compareAsc(a.startDate, b.startDate))[0];
    
      set({
        startDate: mainIncident.startDate,
        description: mainIncident.description,
        name: mainIncident.name
      });
  },
  reset: () => set({
    count: 0,
    startDate: null,
    description: null,
    name: null,
  }),
}));

type RecommendationSlice = {
  name: string;
  severity: number;
  scoreImprovement: number;
}

type RecommendationState = {
  recommendations: RecommendationSlice[]
}

export const useRecommendationsStore = create<RecommendationState>((set) => ({
  recommendations: [],
  setRecommendations: (data: Recommendation[]) => {
    const list = data.map((recommendation) => ({
      name: recommendation.recommendationName,
      severity: recommendation.severityScore,
      scoreImprovement: recommendation.configScoreImpact
    }));

    set({ recommendations: list });
  },
  reset: () => set({
    recommendations: [],
  }),
}));

type RemediationSlice = {
  name: string;
  date: Date;
  severity: number;
  assignedTo: string;
}

type RemediationsState = {
  remediations: RemediationSlice[]
}

function severityToInt(severity: "low" | "medium" | "high"): number {
  if(severity == "low") return 3;
  else if(severity == "medium") return 7;
  else /* severity == "high" */ return 10;
}

export const useRemediationsStore = create<RemediationsState>((set) => ({
  remediations: [],
  setRemediations: (data: Remediation[]) => {
    const list = data.map((remediation) => ({
      name: remediation.title,
      date: new Date(remediation.dueOn),
      severity: severityToInt(remediation.priority),
      assignedTo: remediation.requesterId
    }));

    set({ remediations: list });
  },
  reset: () => set({
    remediations: [],
  }),
}));
