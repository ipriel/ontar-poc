import { DocumentLandscapeSplitHint24Filled } from "@fluentui/react-icons";
import { create } from "zustand";
import { RiskyUser, Alert, Incident, Recommendation, Remediation, PushEvent } from './models';
import { compareAsc } from "date-fns";

type RiskyUserState = {
  users: RiskyUser[];
  count: {
    high: number;
    medium: number;
    low: number;
  };
  parseUsers: (data: RiskyUser[]) => void;
  reset: () => void;
}

export const useRiskyUsersStore = create<RiskyUserState>((set) => ({
  users: [
    {
      "id": "c2b6c2b9-dddc-acd0-2b39-d519d803dbc3",
      "riskLastUpdatedDateTime": "2016-01-29T20:03:57.7872426Z",
      "isProcessing": true,
      "isDeleted": true,
      "riskDetail": "adminConfirmedSigninCompromised",
      "riskLevel": "high",
      "riskState": "atRisk",
      "userDisplayName": "Alex Wilbur",
      "userPrincipalName": "alexw@contoso.com"
  }
  ],
  count: {
    high: 1/*0*/,
    medium: 0,
    low: 0
  },
  parseUsers: (data: RiskyUser[]) => {
    let counter = {high: 0, medium: 0, low: 0};
    data.forEach(user => {
      if(user.riskLevel == "high") ++counter.high;
      else if(user.riskLevel == "medium") ++counter.medium;
      else /* user.riskLevel == "low" */ ++counter.low;
    });
    set({users: [...data], count: Object.assign({}, counter)});
  },
  reset: () => set({
    users: [],
    count: Object.assign({}, { high: 0, medium: 0, low: 0 })
  }),
}));

type AlertState = {
  compromisedApps: number;
  compromisedNetworking: number;
  compromisedIot_Resources: number;
  calcCompromisedDevices: (alerts: Alert[]) => void;
  reset: () => void;
}

export const useAlertsStore = create<AlertState>((set) => ({
  compromisedApps: 0,
  compromisedNetworking: 6/*0*/,
  compromisedIot_Resources: 2/*0*/,
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
  calcCount: (data: Incident[]) => void;
  setMainIncident: (data: Incident[]) => void;
  reset: () => void;
}

export const useIncidentsStore = create<IncidentState>((set) => ({
  count: 1/*0*/,
  startDate: new Date("8/6/2024 17:00")/*null*/,
  description: "Unauthorized Access from Iranian and Russian Hackers Immediate Action Required"/*null*/,
  name: "Phishing Attack"/*null*/,
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

export type RecommendationSlice = {
  id: string;
  name: string;
  severity: number;
  scoreImprovement: number;
}

type RecommendationState = {
  recommendations: RecommendationSlice[];
  setRecommendations: (data: Recommendation[]) => void;
  reset: () => void;
}

export const useRecommendationsStore = create<RecommendationState>((set) => ({
  recommendations: [
    {id: "scid-2090", name: "Turn on Microsoft Defender for Endpoint sensor", severity: 10, scoreImprovement: 10}, 
    {id: "scid-2091", name: "Fix Microsoft Defender for Endpoint sensor data collection", severity: 6, scoreImprovement: 10}
  ]/*[]*/,
  setRecommendations: (data: Recommendation[]) => {
    const list = data.map((recommendation) => ({
      id: recommendation.id.slice(6),
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
  description: string;
  assignedTo: string;
  recommendationRef: string;
}

type RemediationsState = {
  remediations: RemediationSlice[];
  setRemediations: (data: Remediation[]) => void;
  reset: () => void;
}

function severityToInt(severity: "low" | "medium" | "high"): number {
  if(severity == "low") return 3;
  else if(severity == "medium") return 7;
  else /* severity == "high" */ return 10;
}

export const useRemediationsStore = create<RemediationsState>((set) => ({
  remediations: [
    {name: "Encrypt all BitLocker-supported drives", description: "See <a href=\"https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview\" target=\"_blank\">BitLocker overview</a> for additional information.<br/>",
        "relatedComponent": "Security controls (Bitlocker)", assignedTo: "9a3b090b-a1bf-4f7c-9faf-260f4e970e3d", recommendationRef: "scid-2090"},
    {name: "Open SentinalOne XDR", description: "See <a href=\"https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-overview\" target=\"_blank\">BitLocker overview</a> for additional information.<br/>",
        "relatedComponent": "Security controls (Bitlocker)", assignedTo: "9a3b090b-a1bf-4f7c-9faf-260f4e970e3d", recommendationRef: "scid-2091"}
  ]/*[]*/,
  setRemediations: (data: Remediation[]) => {
    const list = data.map((remediation) => ({
      name: remediation.title,
      description: remediation.description,
      assignedTo: remediation.requesterId,
      recommendationRef: remediation.recommendationReference.slice(5)
    }));

    set({ remediations: list });
  },
  reset: () => set({
    remediations: [],
  }),
}));

type PushEventState = {
  events: PushEvent[];
  pushEvent: (event: PushEvent) => void;
}

export const useEventStore = create<PushEventState>((set) => ({
  events: [{
    attackType: "Phishing",
    securityScore: 46,
    alert: "Security alert: Uncovering unauthorized access...",
    startTime: new Date("2024-07-22T12:45:00Z")
  }]/*[]*/,
  pushEvent: (event: PushEvent) => set((state) => ({events: [...state.events, event]}))
}));
