import {
  ChatMessage,
  ChatResponse,
  conversationApi,
  ConversationRequest,
  MitigationData,
  ToolMessageContent,
} from "../../lib";
import user1Pic from "../../assets/user-1.png";
import user2Pic from "../../assets/user-2.png";
import user3Pic from "../../assets/user-3.png";
import user4Pic from "../../assets/user-4.png";
import { useRef, useState } from "react";

export const SAMPLE_QUESTIONS = [
  "What users were compromised?",
  "How can businesses defend against social engineering attacks like pretexting?",
  "How does ransomware work, and how can organizations protect against it?",
  "Define a DDoS attack and suggest strategies to mitigate its impact.",
  "Define a zero-day exploit and discuss how organizations can respond to it.",
  "What is phishing, and how can individuals avoid falling for it?",
  "What is a man-in-the-middle attack, and when might it occur?",
  "Explain the difference between a virus and a worm in cybersecurity.",
];

export const parseCitationFromMessage = (message: ChatMessage) => {
  if (message.role === "tool") {
    try {
      const toolMessage = JSON.parse(message.content) as ToolMessageContent;
      return toolMessage.citations;
    } catch {
      return [];
    }
  }
  return [];
};

export const getSystemBaseMessage = (): ChatMessage => {
  const content = JSON.stringify({
    title: "Here are the current impacted users from the phishing event",
    tableHeaders: [
      "",
      "Full name",
      "Email",
      "Type",
      "IDM",
      "Risk Potential",
      "Audit Trail",
    ],
    tableBody: [
      [
        "src:" + user1Pic,
        "Adam Berman",
        "adam@bank.com",
        "Super User",
        "Azure AD",
        "High",
        "Audit",
      ],
      [
        "The Superuser is a special user account with unrestricted access to all commands and files on the system. They have the highest level of control over the system and can perform any operation, including modifying critical system files and configurations.",
      ],
      [
        "src:" + user2Pic,
        "Nora Trek",
        "nora@bank.com",
        "Elevated User",
        "Azure AD",
        "Medium",
        "Audit",
      ],
      [
        "*Admins* have elevated privileges beyond regular users. They can manage system settings, install and uninstall software, and perform various administrative tasks. They are responsible for maintaining the system, ensuring its security, and managing user accounts.",
      ],
      [
        "src:" + user3Pic,
        "Will Orno",
        "will@bank.com",
        "User",
        "Azure AD",
        "Low",
        "Audit",
      ],
      [
        "Regular *Users* have limited permissions, typically only being able to access certain files, applications, and settings based on their user account's privileges.",
      ],
      [
        "src:" + user4Pic,
        "Sarah James",
        "Sarah@bank.com",
        "User",
        "Azure AD",
        "Low",
        "Audit",
      ],
      [
        "Regular *Users* have limited permissions, typically only being able to access certain files, applications, and settings based on their user account's privileges.",
      ],
    ],
  });

  return {
    role: "system-base",
    content,
  };
};

export const getSystemMitigationData = (): MitigationData => {
  const script = `#Read security group details from CSV file
  $CSVRecords = Import-CSV "C:\Temp\SecurityGroups.csv"
  $TotalItems = $CSVRecords.Count
  $i = 0
  
  #Iterate groups one by one and create
  ForEach ($CSVRecord in $CSVRecords) {
  $GroupName = $CSVRecord."GroupName"
  $GroupDescription = $CSVRecord."GroupDescription"
  #Split owners and members by semi-colon separator (;) and set in array
  $Owners = If ($CSVRecord."Owners") { $CSVRecord."Owners" -split ';' } Else { $null }
  $Members = If ($CSVRecord."Members") { $CSVRecord."Members" -split ';' } Else { $null }
  
  Try {
  $i++;
  Write-Progress -Activity "Creating group $GroupName" -Status  "$i out of $TotalItems groups completed" -Id 1
  
  #Create a new security group
  $NewGroupObj = New-AzureADGroup -DisplayName $GroupName -SecurityEnabled $true -Description $GroupDescription  -MailEnabled $false -MailNickName "NotSet" -ErrorAction Stop
  
  #Add owners
  if ($Owners) {
  $TotalOwners = $Owners.Count
  $OW = 0
  ForEach ($Owner in $Owners) {
  $OW++
  Write-Progress -Activity "Adding owner $Owner" -Status  "$OW out of $TotalOwners owners completed" -ParentId 1
  Try {
  $UserObj = Get-AzureADUser -ObjectId $Owner -ErrorAction Stop
  #Add owner to the new group
  Add-AzureADGroupOwner -ObjectId $NewGroupObj.ObjectId -RefObjectId $UserObj.ObjectId -ErrorAction Stop
  }
  catch {
  Write-Host "Error occurred for $Owner" -f Yellow
  Write-Host $_ -f Red
  }
  }
  }
  #Add members 
  if ($Members) {
  $TotalMembers = $Members.Count
  $m = 0
  ForEach ($Member in $Members) {
  $m++;
  Write-Progress -Activity "Adding member $Member" -Status  "$m out of $TotalMembers members completed" -ParentId 1
  Try {
  $UserObj = Get-AzureADUser -ObjectId $Member -ErrorAction Stop
  #Add a member to the new group
  Add-AzureADGroupMember -ObjectId $NewGroupObj.ObjectId -RefObjectId $UserObj.ObjectId -ErrorAction Stop
  }
  catch {
  Write-Host "Error occurred for $Member" -f Yellow
  Write-Host $_ -f Red
  }
  }
  }
  }
  catch {
  Write-Host "Error occurred while creating group: $GroupName" -f Yellow
  Write-Host $_ -f Red
  }
  }
  `;

  return {
    plan: [
      "Revoke users active sessions and MFA tokens",
      "Re-Register users to MFA ",
      "Create a Conditional access policy to allow access only from NY offices and NY geo region ",
      "Block direct and indirect users ",
      "Reset users password ",
      "Recall phishing emails sent by them to the organization boxes",
      "Enable users ",
      "Notify users of the login details ",
    ],
    scriptLang: "powershell",
    script: script.toString(),
  };
};

const loadingMessage: ChatMessage[] = [
  { role: "tool", content: "[]" },
  { role: "assistant", content: "Generating answer..." },
];

export const useChatApi = (): [
    {answers: ChatMessage[], isLoading: boolean},
    (question: string) => Promise<void>,
    () => void
] => {
  const abortFuncs = useRef([] as AbortController[]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<ChatMessage[]>([]);

  const makeApiRequest = async (question: string) => {
    setIsLoading(true);

    const userMessage: ChatMessage = {
      role: "user",
      content: question,
    };

    const newAnswers = [...answers, userMessage];
    setAnswers([...newAnswers, ...loadingMessage]);

    if (question == "What users were compromised?") {
      let result: ChatMessage[] = [];
      if (question == "What users were compromised?") {
        result.push(getSystemBaseMessage());
      }

      setAnswers([...newAnswers, getSystemBaseMessage()]);
      setIsLoading(false);
      return;
    }

    const request: ConversationRequest = {
      messages: [
        ...newAnswers.filter((answer) =>
          ["user", "assistant"].includes(answer.role)
        ),
        userMessage,
      ],
    };

    const abortController = new AbortController();
    abortFuncs.current.unshift(abortController);

    let result = {} as ChatResponse;
    try {
      const response = await conversationApi(request, abortController.signal);
      if (response?.body) {
        const reader = response.body.getReader();
        let runningText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          var text = new TextDecoder("utf-8").decode(value);
          const objects = text.split("\n");
          objects.forEach((obj) => {
            try {
              runningText += obj;
              result = JSON.parse(runningText);
              setAnswers([...newAnswers, ...result.choices[0].messages]);
              runningText = "";
            } catch {}
          });
        }
        setAnswers([...newAnswers, ...result.choices[0].messages]);
      }
    } catch (e) {
      if (!abortController.signal.aborted) {
        console.error(result);
        let errorMessage =
          "An error occurred. Please try again. If the problem persists, please contact the site administrator.";
        if (result.error?.message) {
          errorMessage = result.error.message;
        } else if (typeof result.error === "string") {
          errorMessage = result.error;
        }
        setAnswers([
          ...newAnswers,
          {
            role: "error",
            content: errorMessage,
          },
        ]);
      } else {
        setAnswers(newAnswers);
      }
    } finally {
      setIsLoading(false);
      abortFuncs.current = abortFuncs.current.filter(
        (a) => a !== abortController
      );
    }

    return abortController.abort();
  };

  const stopGenerating = () => {
    abortFuncs.current.forEach((a) => a.abort());
    setIsLoading(false);
  };

  const data = { answers, isLoading };
  return [data, makeApiRequest, stopGenerating];
  //return {answers, isLoading, makeApiRequest, stopGenerating}
};
