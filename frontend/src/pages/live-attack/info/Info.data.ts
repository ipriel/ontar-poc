import HsbcLogo from "../../../assets/logo-hsbc.png";
import {TagData} from "../../../components/TagGroup";

export const industries: TagData[] = [
    {label: "Academic"}, {label: "Aviation"}, {label: "Banking", selected: true}, 
    {label: "Consulting"}, {label: "Professional Services"}, 
    {label: "Industrial and Engineering"}, {label: "Aerospace"}, {label: "Maritime"}, 
    {label: "Healthcare"}, {label: "Insurance"}, {label: "Food and Beverage"}, 
    {label: "Chemicals"}, {label: "Energy", selected: true}, {label: "Oil and Gas"}, 
    {label: "Manufacturing"}, {label: "Hospitality"}, {label: "Real Estate"}, 
    {label: "Opportunistic"}, {label: "Logistics", selected: true}, {label: "NGO"}, 
    {label: "Computer Gaming"}, {label: "Biomedical"}
];

export const countries: TagData[] = [
    {label: "Taiwan"}, {label: "Spain"}, {label: "Russian Federation"}, 
    {label: "Poland"}, {label: "Netherlands"}, {label: "Myanmar"}, 
    {label: "United States", selected: true}, {label: "Mexico"}, 
    {label: "Colombia"}, {label: "Chile"}, {label: "Vietnam"}, 
    {label: "Indonesia"}, {label: "South Africa"}, {label: "Switzerland"}, 
    {label: "Hungary"}, {label: "United Kingdom"}, {label: "China"}, 
    {label: "Italy"}, {label: "Canada"}
];

export const group_description = `
### Group Description

In early December 2020, the FBI issued a warning regarding DoppelPaymer, a ransomware family that first appeared in 2019 when it launched attacks against organizations in critical industries. Its activities have continued throughout 2020, including a spate of incidents in the second half of the year that left its victims struggling to properly carry out their operations.

### What is DoppelPaymer?

DoppelPaymer is believed to be based on the BitPaymer ransomware (which first appeared in 2017) due to similarities in their code, ransom notes, and payment portals. It is important to note, however, that there are some differences between DoppelPaymer and BitPaymer. For example, DoppelPaymer uses 2048-bit RSA + 256-bit AES for encryption, while BitPaymer uses 4096-bit RSA + 256-bit AES (with older versions using 1024-bit RSA + 128-bit RC4). Furthermore, DoppelPaymer improves upon BitPaymer's rate of encryption by using threaded file encryption.
Another difference between the two is that before DoppelPaymer executes its malicious routines, it needs to have the correct command-line parameter. Our experience with the samples that we encountered shows different parameters for different samples. This technique is possibly used by the attackers to avoid detection via sandbox analysis as well as to prevent security researchers from studying the samples.

Perhaps the most unique aspect of DoppelPaymer is its use of a tool called Process Hacker, which it uses to terminate services and processes related to security, email server, backup, and database software to impair defenses and prevent access violation during encryption. in order to prevent access violation during encryption.
Like many modern ransomware families, DoppelPaymer's ransom demands for file decryption are sizeable, ranging anywhere from US$25,000 to US$1.2 million. Furthermore, starting in February 2020, the malicious actors behind DoppelPaymer launched a data leak site. They then threaten victims with the publication of their stolen files on the data leak site as part of the ransomware's extortion scheme.

DoppelPaymer uses a fairly sophisticated routine, starting off with network infiltration via malicious spam emails containing spear-phishing links or attachments designed to lure unsuspecting users into executing malicious code that is usually disguised as a genuine document. This code is responsible for downloading other malware with more advanced capabilities (such as Emotet) into the victim's system.

Once Emotet is downloaded, it will communicate with its command-and-control (C&C) server to install various modules as well as to download and execute other malware.
For the DoppelPaymer campaign, the C&C server was used to download and execute the Dridex malware family, which in turn is used to download either DoppelPaymer directly or tools such as PowerShell Empire, Cobalt Strike, PsExec, and Mimikatz. Each of these tools is used for various activities, such as stealing credentials, moving laterally inside the network, and executing different commands, such as disabling security software. 

Once Dridex enters the system, the malicious actors do not immediately deploy the ransomware. Instead, it tries to move laterally within the affected system's network to find a high-value target to steal critical information from. Once this target is found, Dridex will proceed in executing its final payload, DoppelPaymer. DoppelPaymer encrypts files found in the network as well as fixed and removable drives in the affected system.
Finally, DoppelPaymer will change user passwords before forcing a system restart into safe mode to prevent user entry from the system. It then changes the notice text that appears before Windows proceeds to the login screen.

The new notice text is now DoppelPaymer's ransom note, which warns users not to reset or shut down the system, as well as not to delete, rename, or move the encrypted files. The note also contains a threat that their sensitive data will be shared to the public if they do not pay the ransom that is demanded from them.
DoppelPaymer will also drop the Process Hacker executable, its driver, and a stager DLL. DoppelPaymer will create another instance of itself that executes the dropped Process Hacker. Once Process Hacker is running, it will load the stager DLL via DLL Search Order Hijacking. Stager DLL will listen/wait for a trigger from the running DoppelPaymer process. DoppelPaymer has a crc32 list of processes and services it will terminate. If a process or service in its list is running, it will trigger the Process Hacker to terminate it.

### Who are affected?

According to the FBI notification, DoppelPaymer's primary targets are organizations in the healthcare, emergency services, and education. The ransomware has already been involved in a number of attacks in 2020, including disruptions to a community college as well as police and emergency services in a city in the US during the middle of the year.
DoppelPaymer was particularly active in September 2020, with the ransomware targeting a German hospital that resulted in the disruption of communication and general operations. It also fixed its sights on a county E911 center as well as another community college in the same month.

### What can organizations do?

Organizations can protect themselves from ransomware such as DoppelPaymer by ensuring that security best practices are in place. These include:
Refraining from opening unverified emails and clicking on any embedded links or attachments in these messages.
Regularly backing up important files using the 3-2-1 rule: Create three backup copies in two different file formats, with one of the backups in a separate physical location.
Updating both software and applications with the latest patches as soon as possible to protect them from vulnerabilities.
Ensuring that backups are secure and disconnected from the network at the conclusion of each backup session. 
Auditing user accounts at regular intervals — in particular those accounts that are publicly accessible, such as Remote Monitoring and Management accounts.
Monitoring inbound and outbound network traffic, with alerts for data exfiltration in place.
Implementing two-factor authentication (2FA) for user login credentials, as this can help strengthen security for user accounts
Implementing the principle of least privilege for file, directory, and network share permissions.
`;

export const attack_routine = `
### Attack Routine

According to the DoppelPaymer ransomware description, it applies a multi-stage infection scheme as well as a highly sophisticated operation routine. Particularly, the attack starts with a malicious document distributed via spear-phishing or spam. In case the victim was lured to open the attachment or follow the link, malicious code is executed on the user's machine to download other components used for network compromise. 

The very first of these components is an infamous Emotet strain acting as a loader for Dridex. Dridex then either drops DoppelPaymer payload or downloads additional malicious content such as Mimikatz, PsExec, PowerShell Empire, and Cobalt Strike. This malicious soft serves various purposes, including credentials dumping, lateral movement, and code execution inside the targeted network. 

Remarkably, Dridex usually postpones the DoppelPaymer infection while threat actors move across the environment to search for sensitive data. Once they succeed, ransomware starts to act, encrypting the victims' files inside the network and on the affiliated fixed and removable drives. Finally, DoppelPaymer changes user passwords, launches the system in safe mode, and displays a ransom note on the users' screens. 

In addition to Emotet and Dridex, DoppelPaymer developers partner with Quakbot operators to expand the malicious perspectives. Threat actors use Quakbot malware similarly to Dridex: for network penetration, privilege escalation, and lateral movement across environments.
`;

export const attack_sources = [
    {
        name: "Mail Server",
        address: "221.12.26.43",
        source: "iran",
        timestamp: "Dec 1, 2023 03:22am",
        status: "Open"
    },
    {
        name: "Mail Server",
        address: "221.12.26.45",
        source: "iran",
        timestamp: "Dec 1, 2023 03:24am",
        status: "Open"
    },
    {
        name: "Mail Server",
        address: "221.12.57.17",
        source: "iran",
        timestamp: "Nov 5, 2023 09:04pm",
        status: "Open"
    },
    {
        name: "Mail Server",
        address: "221.12.57.15",
        source: "iran",
        timestamp: "Nov 5, 2023 09:08pm",
        status: "Open"
    },
    {
        name: "Mail Server",
        address: "221.14.112.202",
        source: "iran",
        timestamp: "Oct 31, 2022 06:179m",
        status: "Blocked"
    },
    {
        name: "Mail Server",
        address: "221.14.206.3",
        source: "iran",
        timestamp: "Jul 4, 2022 10:36pm",
        status: "Open"
    },
];

export const attack_history = [
    {
        logo: HsbcLogo,
        type: "Bank",
        attack_group: "DoppelPaymer",
        name: "HSBC",
        attack_type: "Ransom",
        cost: "$130,000",
        severity_level: "Critical",
        status: "Paid Ransom",
        attack_date: "Jan 20, 2024 03:23am",
        location: "UK, London",
        resolution_date: "Jan 20, 2024 14:22pm"
    },
    {
        logo: HsbcLogo,
        type: "Bank",
        attack_group: "DoppelPaymer",
        name: "HSBC",
        attack_type: "Ransom",
        cost: "$120,000",
        severity_level: "Critical",
        status: "Paid Ransom",
        attack_date: "Jan 20, 2024 03:34am",
        location: "United States, New York",
        resolution_date: "Jan 20, 2024 14:45pm"
    },
    {
        logo: HsbcLogo,
        type: "Bank",
        attack_group: "DoppelPaymer",
        name: "HSBC",
        attack_type: "Ransom",
        cost: "$150,000",
        severity_level: "Critical",
        status: "Paid Ransom",
        attack_date: "Jan 20, 2024 03:46am",
        location: "Switzerland, Geneva",
        resolution_date: "Jan 20, 2024 15:03pm"
    }
];

export const attack_types = [
    {color: "#5383ED", name: "Sodinokibi", ratio: "29.4%"},
    {color: "#E87474", name: "Dharma", ratio: "9.3%"},
    {color: "#D3CF2F", name: "Rapid", ratio: "3.7%"},
    {color: "#FFA903", name: "Ryuk", ratio: "21.5%"},
    {color: "#3DB9C9", name: "DopplePaymer", ratio: "6.1%"},
    {color: "#5361D2", name: "Snatch", ratio: "2.8%"},
    {color: "#6FCF97", name: "Phobos", ratio: "10.7%"},
    {color: "#C53EED", name: "Netwalker", ratio: "5.1%"},
    {color: "#FFD482", name: "IEncrypt", ratio: "2.3%"}
]