import { useRef, useState, useEffect } from "react";
import { IconButton, Stack } from "@fluentui/react";
import { SquareFilled, ShieldLockRegular, ErrorCircleRegular } from "@fluentui/react-icons";

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import { CopyBlock, dracula } from "react-code-blocks";

import styles from "./Chat.module.css";
// import Ontar from "../../assets/ocf-white.svg";

import {
    ChatMessage,
    ConversationRequest,
    conversationApi,
    ToolMessageContent,
    ChatResponse,
    getUserInfo
} from "../../api";
import { Answer } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { Citation } from '../../api/models';

const Chat = () => {
    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
    const [activeCitation, setActiveCitation] = useState<[content: string, id: string, title: string, filepath: string, url: string, metadata: string]>();
    const [isCitationPanelOpen, setIsCitationPanelOpen] = useState<boolean>(false);
    const [activeMitigation, setActiveMitigation] = useState<number>(-1);
    const [activeTab, setActiveTab] = useState<number>(1);
    const [answers, setAnswers] = useState<ChatMessage[]>([]);
    const abortFuncs = useRef([] as AbortController[]);
    const [showAuthMessage, setShowAuthMessage] = useState<boolean>(true);

    const getUserInfoList = async () => {
        const userInfoList = await getUserInfo();
        if (userInfoList.length === 0 && window.location.hostname !== "127.0.0.1") {
            setShowAuthMessage(true);
        }
        else {
            setShowAuthMessage(false);
        }
    }

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        setIsLoading(true);
        setShowLoadingMessage(true);
        const abortController = new AbortController();
        abortFuncs.current.unshift(abortController);

        const userMessage: ChatMessage = {
            role: "user",
            content: question
        };

        if (["What users were compromised?"].includes(question)) {
            let result: ChatMessage[] = [];
            if (question == "What users were compromised?") {
                result.push({
                    role: "system-base", content: JSON.stringify({
                        title: "Here are the current impacted users by the phishing event",
                        tableHeaders: ["Full name", "Email", "Type", "IDM", "Risk Potential", "Audit Trail"],
                        tableBody: [
                            ["Adam Berman", "adam@bank.com", "Super User", "Azure AD", "High", "Audit"],
                            ["The Superuser is a special user account with unrestricted access to all commands and files on the system. They have the highest level of control over the system and can perform any operation, including modifying critical system files and configurations."],
                            ["Nora Trek", "nora@bank.com", "Elevated User", "Azure AD", "Medium", "Audit"],
                            ["*Admins* have elevated privileges beyond regular users. They can manage system settings, install and uninstall software, and perform various administrative tasks. They are responsible for maintaining the system, ensuring its security, and managing user accounts."],
                            ["Will Orno", "will@bank.com", "User", "Azure AD", "Low", "Audit"],
                            ["Regular *Users* have limited permissions, typically only being able to access certain files, applications, and settings based on their user account's privileges."],
                            ["Sarah James", "Sarah@bank.com", "User", "Azure AD", "Low", "Audit"],
                            ["Regular *Users* have limited permissions, typically only being able to access certain files, applications, and settings based on their user account's privileges."]
                        ]
                    })
                });
                result.push({
                    role: "system-mitigation", content: JSON.stringify({
                        plan: [
                            "Revoke users active sessions and MFA tokens",
                            "Re-Register users to MFA ",
                            "Create a Conditional access policy to allow access only from NY offices and NY geo region ",
                            "Block direct and indirect users ",
                            "Reset users password ",
                            "Recall phishing emails sent by them to the organization boxes",
                            "Enable users ",
                            "Notify users of the login details "
                        ],
                        scriptLang: "powershell",
                        script: `
                    #Read security group details from CSV file
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
                    `.toString()
                    })
                });
            }

            setAnswers([...answers, userMessage, ...result]);
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
            return abortController.abort();
        }

        const request: ConversationRequest = {
            messages: [...answers.filter((answer) => ["user", "assistant"].includes(answer.role)), userMessage]
        };

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
                            setShowLoadingMessage(false);
                            setAnswers([...answers, userMessage, ...result.choices[0].messages]);
                            runningText = "";
                        }
                        catch { }
                    });
                }
                setAnswers([...answers, userMessage, ...result.choices[0].messages]);
            }

        } catch (e) {
            if (!abortController.signal.aborted) {
                console.error(result);
                let errorMessage = "An error occurred. Please try again. If the problem persists, please contact the site administrator.";
                if (result.error?.message) {
                    errorMessage = result.error.message;
                }
                else if (typeof result.error === "string") {
                    errorMessage = result.error;
                }
                setAnswers([...answers, userMessage, {
                    role: "error",
                    content: errorMessage
                }]);
            } else {
                setAnswers([...answers, userMessage]);
            }
        } finally {
            setIsLoading(false);
            setShowLoadingMessage(false);
            abortFuncs.current = abortFuncs.current.filter(a => a !== abortController);
        }

        return abortController.abort();
    };

    const stopGenerating = () => {
        abortFuncs.current.forEach(a => a.abort());
        setShowLoadingMessage(false);
        setIsLoading(false);
    }

    useEffect(() => {
        getUserInfoList();
    }, []);

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [showLoadingMessage]);

    const onShowCitation = (citation: Citation) => {
        setActiveCitation([citation.content, citation.id, citation.title ?? "", citation.filepath ?? "", "", ""]);
        setIsCitationPanelOpen(true);
    };

    const parseCitationFromMessage = (message: ChatMessage) => {
        if (message.role === "tool") {
            try {
                const toolMessage = JSON.parse(message.content) as ToolMessageContent;
                return toolMessage.citations;
            }
            catch {
                return [];
            }
        }
        return [];
    }

    const sampleQuestions = [
        "What users were compromised?",
        "How can businesses defend against social engineering attacks like pretexting?",
        "How does ransomware work, and how can organizations protect against it?",
        "Define a DDoS attack and suggest strategies to mitigate its impact.",
        "Define a zero-day exploit and discuss how organizations can respond to it.",
        "What is phishing, and how can individuals avoid falling for it?",
        "What is a man-in-the-middle attack, and when might it occur?",
        "Explain the difference between a virus and a worm in cybersecurity."
    ]

    return (
        <div className={styles.container} role="main">
            {showAuthMessage ? (
                <Stack className={styles.chatEmptyState}>
                    <ShieldLockRegular className={styles.chatIcon} style={{ color: '#C792FF', height: "150px", width: "150px" }} />
                    <h1 className={styles.chatEmptyStateTitle}>Authentication Not Configured</h1>
                    <h2 className={styles.chatEmptyStateSubtitle}>
                        <span>This app does not have authentication configured.</span>
                        <span>Please add an identity provider by finding your app in the</span>
                        <a href="https://portal.azure.com/" target="_blank">Azure Portal</a>
                        <span>and following</span>
                        <a href="https://learn.microsoft.com/en-us/azure/app-service/scenario-secure-app-authentication-app-service#3-configure-authentication-and-authorization" target="_blank"> these instructions</a>
                    </h2>
                    <h2 className={styles.chatEmptyStateSubtitle} style={{ fontSize: "20px" }}><strong>Authentication configuration takes a few minutes to apply. </strong></h2>
                    <h2 className={styles.chatEmptyStateSubtitle} style={{ fontSize: "20px" }}><strong>If you deployed in the last 10 minutes, please wait and reload the page after 10 minutes.</strong></h2>
                </Stack>
            ) : (
                <Stack
                    horizontal
                    className={styles.chatRoot}
                    style={{
                        flex: lastQuestionRef.current ? 1 : 0
                    }}
                >
                    <div className={styles.chatContainer}>
                        {!lastQuestionRef.current ? (
                            <Stack className={styles.chatEmptyState}>
                                <div className={styles.logoContainer}>
                                    <svg width="44" height="55" viewBox="0 0 44 55" fill="#B955E3" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M37.9995 11.7211L21.5583 5.82193L5.11717 11.7211V25.6155C5.11717 32.2997 8.31162 38.5672 13.6831 42.4218L21.5583 48.0731L29.4337 42.4218C34.8051 38.5672 37.9995 32.2997 37.9995 25.6155V11.7211ZM21.5583 54.3682L32.3508 46.6233C39.0652 41.8049 43.0583 33.9708 43.0583 25.6155V8.08245L21.5583 0.368164L0.0583496 8.08245V25.6155C0.0583496 33.9708 4.05141 41.8049 10.7658 46.6233L21.5583 54.3682Z" fill="#B955E3" />
                                    </svg>
                                    <h1 className={styles.logoText}><span className={styles.logoTextHighlight}>ON</span>TAR</h1>
                                </div>
                                <h2 className={styles.chatEmptyStateSubtitle}>How can I help you today?</h2>
                            </Stack>
                        ) : (
                            <div className={styles.chatMessageStream} style={{ marginBottom: isLoading ? "40px" : "0px" }} role="log">
                                {answers.map((answer, index) => (
                                    <>
                                        {
                                            answer.role === "user" ? (
                                                <div className={styles.chatMessageUser} tabIndex={0}>
                                                    <div className={styles.chatMessageUserMessage}>{answer.content}</div>
                                                </div>
                                            ) : answer.role === "assistant" ? (
                                                <div className={styles.chatMessageGpt}>
                                                    <Answer
                                                        answer={{
                                                            answer: answer.content,
                                                            citations: parseCitationFromMessage(answers[index - 1]),
                                                        }}
                                                        onCitationClicked={c => onShowCitation(c)}
                                                    />
                                                </div>
                                            ) : answer.role === "error" ? (
                                                <div className={styles.chatMessageError}>
                                                    <Stack horizontal className={styles.chatMessageErrorContent}>
                                                        <ErrorCircleRegular className={styles.errorIcon} stroke="#b63443" />
                                                        <span style={{ color: "#b63443" }}>Error</span>
                                                    </Stack>
                                                    <span className={styles.chatMessageErrorContent}>{answer.content}</span>
                                                </div>
                                            ) : answer.role === "system-base" ? (
                                                <div className={styles.chatMessageSystem} tabIndex={0}>
                                                    {[JSON.parse(answer.content)].map(content => (
                                                        <>
                                                            <h1 className={styles.headerTitle}>{content.title}</h1>
                                                            <table className={styles.chatMessageSystemTable}>
                                                                <thead>
                                                                    <tr className={styles.chatMessageSystemTableHeader}>
                                                                        {content.tableHeaders.map((header: string) => (
                                                                            <th>{header}</th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className={styles.chatMessageSystemTableBody}>
                                                                    {content.tableBody.map((row: string[]) => (
                                                                        <tr className={row.length == 1 ? styles.chatMessageSystemTableTooltip : styles.chatMessageSystemTableRow}>
                                                                            {row.map(cell => (
                                                                                <td colSpan={(content.tableHeaders.length > row.length) ? content.tableHeaders.length / row.length : undefined}>{cell}</td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </>
                                                    ))}
                                                    <div className={styles.chatMessageSystemFooter}>
                                                        <button className={styles.chatMessageSystemButton} onClick={() => setActiveMitigation(index + 1)}>Mitigate Now</button>
                                                    </div>
                                                </div>
                                            ) : answer.role === "system-mitigation" && activeMitigation === index ? (
                                                <div className={styles.chatMessageSystemMitigation}>
                                                    {[JSON.parse(answer.content)].map(content => (
                                                        <div className={styles.tabLayout}>
                                                            <div className={styles.tabSelectorContainer}>
                                                                {["Plan", "Scripts"].map((label, index) => (
                                                                    <button
                                                                        className={(activeTab === index + 1) ? styles.tabSelectorActive : styles.tabSelector}
                                                                        onClick={() => setActiveTab(index + 1)}
                                                                        data-tab={index + 1}
                                                                    >
                                                                        {label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <IconButton className={styles.tabLayoutDismiss} iconProps={{ iconName: 'Cancel' }} aria-label="Close citations panel" onClick={() => setActiveMitigation(-1)} />
                                                            <div className={(activeTab === 1) ? styles.tabContainerActive : styles.tabContainer}>
                                                                <h1>Mitigation plan</h1>
                                                                <p>The mitigation flow is as follows:</p>
                                                                <ul>
                                                                    {content.plan.map((step: string) => (
                                                                        <li>{step}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div className={(activeTab === 2) ? styles.tabContainerActive : styles.tabContainer}>
                                                                <h1>Scripts</h1>
                                                                <p>Below are the necessary scripts to implement the mitigations:</p>
                                                                <div className={styles.codeBlock}>
                                                                    <CopyBlock
                                                                    language={content.scriptLang}
                                                                    text={content.script}
                                                                    showLineNumbers={true}
                                                                    theme={dracula}
                                                                />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div >
                                            ) : null
                                        }
                                    </>
                                ))}
                                {showLoadingMessage && (
                                    <>
                                        <div className={styles.chatMessageUser}>
                                            <div className={styles.chatMessageUserMessage}>{lastQuestionRef.current}</div>
                                        </div>
                                        <div className={styles.chatMessageGpt}>
                                            <Answer
                                                answer={{
                                                    answer: "Generating answer...",
                                                    citations: []
                                                }}
                                                onCitationClicked={() => null}
                                            />
                                        </div>
                                    </>
                                )}
                                <div ref={chatMessageStreamEnd} />
                            </div>
                        )}

                        <Stack horizontal className={styles.chatInput}>
                            {isLoading && (
                                <Stack
                                    horizontal
                                    className={styles.stopGeneratingContainer}
                                    role="button"
                                    aria-label="Stop generating"
                                    tabIndex={0}
                                    onClick={stopGenerating}
                                    onKeyDown={e => e.key === "Enter" || e.key === " " ? stopGenerating() : null}
                                >
                                    <SquareFilled className={styles.stopGeneratingIcon} aria-hidden="true" />
                                    <span className={styles.stopGeneratingText} aria-hidden="true">Stop generating</span>
                                </Stack>
                            )}
                            <QuestionInput
                                clearOnSend
                                placeholder="Type a new question..."
                                disabled={isLoading}
                                onSend={question => makeApiRequest(question)}
                            />
                        </Stack>
                        {!lastQuestionRef.current && (
                            <>
                                <Stack horizontal className={styles.suggestionHeaderContainer}>
                                    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5583 18.8682L10.4583 18.7181C9.76365 17.6761 9.41633 17.1551 8.95745 16.778C8.55121 16.4441 8.08311 16.1936 7.57995 16.0408C7.0116 15.8682 6.38546 15.8682 5.13317 15.8682H3.75835C2.63824 15.8682 2.07819 15.8682 1.65037 15.6502C1.27404 15.4584 0.968083 15.1525 0.776337 14.7761C0.55835 14.3483 0.55835 13.7883 0.55835 12.6682V4.06816C0.55835 2.94806 0.55835 2.38801 0.776337 1.96018C0.968083 1.58386 1.27404 1.2779 1.65037 1.08615C2.07819 0.868164 2.63824 0.868164 3.75835 0.868164H4.15835C6.39856 0.868164 7.51866 0.868164 8.37431 1.30414C9.12696 1.68763 9.73888 2.29955 10.1224 3.0522C10.5583 3.90785 10.5583 5.02795 10.5583 7.26816M10.5583 18.8682V7.26816M10.5583 18.8682L10.6584 18.7181C11.353 17.6761 11.7004 17.1551 12.1592 16.778C12.5655 16.4441 13.0336 16.1936 13.5367 16.0408C14.1051 15.8682 14.7312 15.8682 15.9835 15.8682H17.3583C18.4785 15.8682 19.0385 15.8682 19.4663 15.6502C19.8427 15.4584 20.1486 15.1525 20.3404 14.7761C20.5583 14.3483 20.5583 13.7883 20.5583 12.6682V4.06816C20.5583 2.94806 20.5583 2.38801 20.3404 1.96018C20.1486 1.58386 19.8427 1.2779 19.4663 1.08615C19.0385 0.868164 18.4785 0.868164 17.3583 0.868164H16.9583C14.7181 0.868164 13.598 0.868164 12.7424 1.30414C11.9897 1.68763 11.3778 2.29955 10.9943 3.0522C10.5583 3.90785 10.5583 5.02795 10.5583 7.26816" stroke="#C792FF" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <p className={styles.suggestionHeaderTitle}><span className={styles.suggestionHeaderTitleEmphasis}>Cyber Sentinel Q&A: </span>Unveiling Digital Threats</p>
                                    <svg className={styles.suggestionHeaderSearchIcon} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.55835 0.868164C4.14007 0.868164 0.55835 4.44989 0.55835 8.86816C0.55835 13.2864 4.14007 16.8682 8.55835 16.8682C10.4071 16.8682 12.1093 16.2411 13.464 15.188L18.8512 20.5753C19.2418 20.9658 19.8749 20.9658 20.2655 20.5753C20.656 20.1847 20.656 19.5516 20.2655 19.1611L14.8782 13.7738C15.9313 12.4191 16.5583 10.7169 16.5583 8.86816C16.5583 4.44989 12.9766 0.868164 8.55835 0.868164ZM2.55835 8.86816C2.55835 5.55446 5.24464 2.86816 8.55835 2.86816C11.8721 2.86816 14.5583 5.55446 14.5583 8.86816C14.5583 12.1819 11.8721 14.8682 8.55835 14.8682C5.24464 14.8682 2.55835 12.1819 2.55835 8.86816Z" fill="#89859F" />
                                    </svg>
                                </Stack>
                                <div className={styles.sampleQuestionGrid}>
                                    {sampleQuestions.map((question) => (
                                        <div className={styles.sampleQuestionItem} onClick={e => makeApiRequest(question)}>
                                            <p className={styles.sampleQuestionText}>{question}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {answers.length > 0 && isCitationPanelOpen && activeCitation && (
                        <Stack.Item className={styles.citationPanelWrapper}>
                            <div className={styles.citationPanel} tabIndex={0} role="tabpanel" aria-label="Citations Panel">
                                <Stack aria-label="Citations Panel Header Container" horizontal className={styles.citationPanelTitleContainer} horizontalAlign="space-between" verticalAlign="center">
                                    <span aria-label="Citations" className={styles.citationPanelTitle}>Citations</span>
                                    <IconButton className={styles.citationPanelDismiss} iconProps={{ iconName: 'Cancel' }} aria-label="Close citations panel" onClick={() => setIsCitationPanelOpen(false)} />
                                </Stack>
                                <div className={styles.citationPanelHeader}>
                                    {
                                        activeCitation[2].replace("url:", "||url:").split("||").map(header => header.split(/(?<=^\w+):\s/)).map((header => (
                                            <>
                                                <span className={styles.citationPanelHeaderTitle} tabIndex={0}>{header[0].charAt(0).toUpperCase() + header[0].slice(1)}: </span>
                                                <span className={styles.citationPanelHeaderContent}>{header[1]}</span>
                                            </>
                                        )))
                                    }
                                </div>
                                <div className={styles.citationPanelContent} tabIndex={0}>
                                    <ReactMarkdown
                                        linkTarget="_blank"
                                        children={activeCitation[0]}
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    />
                                </div>
                            </div>
                        </Stack.Item>
                    )}
                </Stack>
            )}
        </div>
    );
};

export default Chat;
