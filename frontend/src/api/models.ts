export type AskResponse = {
    answer: string;
    citations: Citation[];
    error?: string;
};

export type Citation = {
    content: string;
    id: string;
    title: string | null;
    filepath: string | null;
    url: string | null;
    metadata: string | null;
    chunk_id: string | null;
    reindex_id: string | null;
}

export type ToolMessageContent = {
    citations: Citation[];
    intent: string;
}

export type ChatMessage = {
    role: string;
    content: string;
    end_turn?: boolean;
};

export enum ChatCompletionType {
    ChatCompletion = "chat.completion",
    ChatCompletionChunk = "chat.completion.chunk"
}

export type ChatResponseChoice = {
    messages: ChatMessage[];
}

export type ChatResponse = {
    id: string;
    model: string;
    created: number;
    object: ChatCompletionType;
    choices: ChatResponseChoice[];
    error?: any;
}

export type ConversationRequest = {
    messages: ChatMessage[];
};

export type UserInfo = {
    access_token: string;
    expires_on: string;
    id_token: string;
    provider_name: string;
    user_claims: any[];
    user_id: string;
};

export type RiskyUser = {
    id: string;
    riskLastUpdatedDateTime: string;
    isProcessing: boolean;
    isDeleted: boolean;
    riskDetail: string;
    riskLevel: "low" | "medium" | "high";
    riskState: string;
    userDisplayName: string;
    userPrincipalName: string;
}

export type Alert = {
    additionalData: {
        AlertUri: string;
        "Attacked Port": {};
        "Attacked Protocol": string;
        "Attacker IP": string;
        "Business Impact": string;
        "Compromised Host": string;
        EffectiveAzureResourceId: string;
        EffectiveSubscriptionId: string;
        Intent: number;
        "Intent@odata.type": string;
        "Number of Connections": string;
        OriginalAlertProductName: string,
        OriginalAlertProviderName: string,
        ProcessingEndTime: {},
        ProductComponentName: string,
        TimeGenerated: {},
        "Victim IP": string
    },
    alertWebUrl: string;
    category: string;
    comments: string[];
    createdDateTime: string,
    description: string;
    detectionSource: string;
    detectorId: string;
    evidence: {
        "@odata.type": string;
        createdDateTime: string;
        defenderAvStatus: string;
        detailedRoles: string[];
        deviceDnsName: string;
        firstSeenDateTime: string;
        healthStatus: string;
        ipInterfaces: string[];
        lastIpAddress: string;
        loggedOnUsers: string[];
        mdeDeviceId: string;
        onboardingStatus: string;
        osBuild: number;
        osPlatform: string;
        rbacGroupId: number;
        remediationStatus: string;
        riskScore: string;
        roles: string[];
        tags: string[];
        verdict: string;
        version: string;
        vmMetadata: {
            cloudProvider: string;
            resourceId: string;
            vmId: string
        }
    }[],
    firstActivityDateTime: string;
    id: string;
    incidentId: string;
    incidentWebUrl: string;
    lastActivityDateTime: string;
    lastUpdateDateTime: string;
    mitreTechniques: string[];
    productName: string;
    providerAlertId: string;
    recommendedActions: string;
    serviceSource: string;
    severity: string;
    status: string;
    systemTags: string[];
    tenantId: string;
    title: string;
}

export type Recommendation = {
    id: string;
    productName: string;
    recommendationName: string;
    weaknesses: number;
    vendor: string;
    recommendedVersion: string;
    recommendedVendor: string;
    recommendedProgram: string;
    recommendationCategory: string;
    subCategory: string;
    severityScore: number;
    publicExploit: boolean;
    activeAlert: boolean;
    associatedThreats: string[];
    remediationType: string;
    status: string;
    configScoreImpact: number;
    exposureImpact: number;
    totalMachineCount: number;
    exposedMachinesCount: number;
    nonProductivityImpactedAssets: number;
    relatedComponent: string;
    hasUnpatchableCve: boolean;
    tags: string[];
    exposedCriticalDevices: number;
}

export type Remediation = {
    id: string;
    title: string;
    createdOn: string;
    requesterId: string;
    requesterEmail: string;
    status: string;
    statusLastModifiedOn: string;
    description: string;
    relatedComponent: string;
    targetDevices: number;
    rbacGroupNames: string[];
    fixedDevices: number;
    requesterNotes: null;
    dueOn: string;
    category: string;
    productivityImpactRemediationType: null;
    priority: "low" | "medium" | "high";
    completionMethod: null;
    completerId: null;
    completerEmail: null;
    scid: string;
    type: string;
    productId: null;
    vendorId: null;
    nameId: null;
    recommendedVersion: null;
    recommendedVendor: null;
    recommendedProgram: null;
    recommendationReference: string;
}

export type Incident = {
    "@odata.type": string;
    id: string;
    incidentWebUrl: string;
    redirectIncidentId: null;
    tenantId: string;
    displayName: string;
    createdDateTime: string;
    lastUpdateDateTime: string;
    assignedTo: string;
    classification: string;
    determination: string;
    status: string;
    severity: string;
    customTags: string[];
    comments: {
        comment: string;
        createdBy: string;
        createdTime: string;
    }[];
    systemTags: string[];
    description: string;
    recommendedActions: string;
    recommendedHuntingQueries: {
        "@odata.type": string;
        kqlText: string;
    }[];
    summary: string;
}

export type ServerPushEvent = {
	AttackType: string,
	SecurityScore: number,
	Alert: string,
	StartTime: Date
}

export type PushEvent = {
	attackType: string,
	securityScore: number,
	alert: string,
	startTime: Date
}

export type WebsocketMessage = {
    message_type: "new_event" | "update_event" | "close_event",
    payload: ServerPushEvent
}