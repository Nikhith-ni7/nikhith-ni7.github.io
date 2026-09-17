const repoRoot = 'https://github.com/Nikhith-ni7/';
const PROJECTS = [
  {
    id: 'macos', number: '01', category: 'AUTHENTICATION / DETECTION', title: 'macOS Authentication Failure Detection',
    short: 'Investigating repeated login failures through macOS Unified Logs and directory-service events.',
    description: 'A controlled authentication investigation: generate failed logins, isolate the relevant events, and document the pattern and its security implications.',
    domains: ['SOC', 'IAM', 'Security Engineering'], tools: ['macOS Unified Logs', 'opendirectoryd', 'Terminal'],
    insight: 'Repeated invalid-credential events identified in a short time window.',
    evidenceLabel: 'Log excerpt + detection query', artLabel: 'AUTHENTICATION TELEMETRY',
    repository: repoRoot + 'macOS-Authentication-Failure-Detection-Lab',
    page: 'https://nikhith-ni7.github.io/macOS-Authentication-Failure-Detection-Lab/',
    scope: 'Self-owned macOS endpoint. Failed login attempts were intentionally generated in a controlled exercise.',
    objective: 'Determine whether native endpoint logs provide enough context to recognize repeated authentication failures and build a useful investigation narrative.',
    workflow: ['Generate failed logins', 'Collect Unified Logs', 'Review timing & errors', 'Document the signal'],
    findings: [
      ['Repeated authentication failures', 'The report records multiple failures between approximately 20:17:27 and 20:18:26. Closely spaced events provide a signal worth investigating.'],
      ['Consistent directory-service error', 'The documented sample identifies opendirectoryd and ODErrorCredentialsInvalid, linking the events to invalid credential attempts.'],
      ['A pattern that needs context', 'The intentionally generated failures resemble password-guessing activity. The pattern alone does not establish malicious intent or a compromised account.']
    ],
    boundary: 'This is a native-log investigation. Centralized SIEM ingestion, automated alerting, and EDR containment are proposed extensions, rather than demonstrated integrations.',
    evidence: [
      {title: 'Authentication event', type: 'LOG EXCERPT', description: 'An example reproduced from the project README. The account identity is already redacted in the source.', code: '2026-03-02 20:17:48.096114-0500\nlocalhost opendirectoryd[363]:\nAuthentication failed for <private>: ODErrorCredentialsInvalid', anchor: '#-log-evidence'},
      {title: 'Native log query', type: 'DETECTION QUERY', description: 'The documented command filters authentication failure messages from the previous hour.', code: 'log show --predicate \'(eventMessage CONTAINS "Authentication failed")\' --style syslog --last 1h', anchor: '#-attack-simulation'},
      {title: 'Investigation fields', type: 'ANALYST CONTEXT', table: {headers: ['Field', 'Documented value'], rows: [['Process', 'opendirectoryd'], ['Error', 'ODErrorCredentialsInvalid'], ['Observed window', 'Approximately 20:17:27–20:18:26'], ['Scenario', 'Intentionally generated failed logins']]}, anchor: '#-analysis'}
    ],
    skills: [
      ['SOC · Alert investigation', 'Isolate relevant events, inspect timestamps, recognize repetition, and explain the resulting signal.'],
      ['IAM · Authentication analysis', 'Interpret invalid-credential events and discuss account-protection controls.'],
      ['Security engineering · Detection logic', 'Use native predicates to collect a targeted set of authentication events.'],
      ['Communication · Investigation reporting', 'Connect evidence, interpretation, limitations, and recommended next steps.']
    ],
    controls: ['Evaluate account lockout and rate-limiting policies for the affected authentication surface.', 'Use MFA where supported and appropriate for the authentication service.', 'Centralize logs and validate thresholds for repeated failures, including benign test cases.'],
    next: 'Extend the lab with Windows security events in a SIEM and a documented EDR investigation and containment exercise.'
  },
  {
    id: 'mitm', number: '02', category: 'NETWORK DEFENSE / PACKET ANALYSIS', title: 'ARP Spoofing & Man-in-the-Middle',
    short: 'Tracing traffic interception in an isolated VMware lab, then identifying the signals a defender can use.',
    description: 'A Kali Linux host, a Windows 10 VM, and a VMware NAT gateway form a controlled environment for investigating ARP poisoning, packet visibility, and defensive indicators.',
    domains: ['SOC', 'Network Security', 'Security Engineering'], tools: ['Wireshark', 'tshark', 'arpspoof', 'VMware', 'Kali Linux'],
    insight: 'Encrypted payloads stayed unreadable; DNS metadata remained visible.',
    evidenceLabel: 'Packet analysis + lab report', artLabel: 'TRAFFIC & TRUST',
    repository: repoRoot + 'ARP-Spoofing-Man-in-the-Middle-Attack',
    page: 'https://nikhith-ni7.github.io/ARP-Spoofing-Man-in-the-Middle-Attack/',
    scope: 'Author-controlled Kali Linux and Windows 10 virtual machines on a VMware NAT network.',
    objective: 'Observe how ARP poisoning changes the traffic path, validate the changed address mappings, and determine what remains visible when application traffic is encrypted.',
    workflow: ['Establish lab baseline', 'Validate ARP changes', 'Inspect captured traffic', 'Document defenses'],
    findings: [
      ['Changed address mappings exposed the interception', 'The report documents duplicate IP-to-MAC mappings and repeated unsolicited ARP replies. These provided visible forensic indicators in Wireshark.'],
      ['Transport encryption protected payload content', 'HTTPS and QUIC application content remained unreadable in the reported capture. Traffic interception did not demonstrate TLS decryption.'],
      ['Plaintext DNS exposed service metadata', 'The report records 676 DNS queries. Visible domain lookups revealed service-use metadata despite encrypted application payloads.']
    ],
    boundary: 'Capture statistics below are reported in the original README. The inspected repository lists a PDF report but does not include the packet-capture file mentioned in its README.',
    evidence: [
      {title: 'Address-mapping indicator', type: 'REPORTED INDICATOR', description: 'The project documents two IP addresses mapped to the same lab attacker MAC, alongside a duplicate-address warning.', code: '192.168.81.2 is at 00:0c:29:79:7a:8e\n192.168.81.129 is at 00:0c:29:79:7a:8e\nduplicate use of 192.168.81.2 detected', anchor: '#forensic-indicators'},
      {title: 'Capture summary', type: 'REPORTED RESULTS', table: {headers: ['Measure', 'README value'], rows: [['Total frames captured', '280,525'], ['Reported captured data', '348.7 MB'], ['Capture duration', '368 seconds'], ['DNS queries observed', '676'], ['ARP spoof packets sent', '404']]}, anchor: '#capture-results'},
      {title: 'Original lab report', type: 'PDF REPORT', description: 'Open ARP_Lab_Final.pdf from the repository to review the original analysis. The source README also documents the environment, tools, findings, and cleanup.', link: repoRoot + 'ARP-Spoofing-Man-in-the-Middle-Attack/blob/main/ARP_Lab_Final.pdf', linkLabel: 'Open the original PDF report'}
    ],
    skills: [
      ['SOC · Network investigation', 'Recognize duplicate-address warnings and correlate them with suspicious ARP behavior.'],
      ['Network security · Protocol analysis', 'Explain ARP trust, packet routing, encrypted payloads, and exposed DNS metadata.'],
      ['Security engineering · Control selection', 'Relate each observed weakness to an appropriate preventive or detective control.'],
      ['Communication · Defensive reporting', 'Explain what the interception revealed and what remained protected.']
    ],
    controls: ['Evaluate Dynamic ARP Inspection with trusted DHCP-snooping bindings on capable network equipment.', 'Consider encrypted DNS and transport encryption to protect metadata and content within the relevant threat model.', 'Monitor for abnormal ARP replies, address changes, and duplicate IP-to-MAC mappings.'],
    next: 'Correlate NIDS alerts with packet captures and document the detection evidence and false-positive considerations.'
  },
  {
    id: 'vmware', number: '03', category: 'RECONNAISSANCE / VULNERABILITY ASSESSMENT', title: 'VMware Network Recon & Vulnerability Scanning',
    short: 'Mapping exposed services with six Nmap techniques and translating scan behavior into defensive guidance.',
    description: 'An isolated Kali Linux and Windows 10 lab connects network reconnaissance, SMB configuration review, and a written SOC detection runbook.',
    domains: ['SOC', 'Network Security', 'Security Engineering'], tools: ['Nmap', 'Zenmap', 'VMware', 'Kali Linux', 'Windows 10'],
    insight: 'SMB signing was not required; detection guidance connects scans to signals.',
    evidenceLabel: 'Scan findings + SOC runbook', artLabel: 'ATTACK SURFACE MAPPING',
    repository: repoRoot + 'VMware-Network-Recon-Vulnerability-Assessment',
    scope: 'Self-owned Kali Linux scanner and Windows 10 target in a VMware lab. The source describes NAT / host-only configurations.',
    objective: 'Map the target’s exposed services, review a security-relevant SMB setting, and explain the observable behavior of several reconnaissance techniques.',
    workflow: ['Map the target', 'Compare scan methods', 'Review SMB signing', 'Write detection guidance'],
    findings: [
      ['Six reconnaissance methods documented', 'The README describes SYN scans, OS detection, full-port scans, decoy scans, fragmented probes, and service-version detection.'],
      ['SMB signing was not required', 'The reported configuration can increase susceptibility to certain relay or interception scenarios when other preconditions are present. The finding itself does not demonstrate successful exploitation.'],
      ['Scanning behavior linked to defender observations', 'The runbook connects scan patterns with incomplete handshakes, rapid port access, unusual source bursts, fragmentation, and fingerprinting probes.']
    ],
    boundary: 'The available evidence is the published scan summary and written runbook. Live IDS alert execution and tuning results are not demonstrated by that README.',
    evidence: [
      {title: 'Documented scan coverage', type: 'METHOD SUMMARY', table: {headers: ['Technique', 'Documented Nmap option'], rows: [['SYN scan', '-sS'], ['OS detection', '-O'], ['Full TCP port range', '-p-'], ['Decoy scan', '-D'], ['Fragmented probes', '-f'], ['Service-version detection', '-sV']]}, anchor: ''},
      {title: 'SMB configuration finding', type: 'REPORTED SCAN FINDING', description: 'Reported in the source README. SMB typically uses TCP 445; the assessment also discusses related RPC (135) and NetBIOS session (139) exposure.', code: 'SMB2 signing: NOT required', anchor: ''},
      {title: 'From scan pattern to detection idea', type: 'RUNBOOK SUMMARY', table: {headers: ['Documented pattern', 'Suggested defensive focus'], rows: [['SYN scan', 'Incomplete-handshake thresholds'], ['Full-port scan', 'Rapid access to many ports from one source'], ['Decoy scan', 'Unusual bursts from multiple sources'], ['Fragmentation', 'Reassembly before inspection'], ['OS / version probes', 'Fingerprinting behavior']]}, anchor: ''}
    ],
    skills: [
      ['Network security · Service discovery', 'Compare complementary reconnaissance techniques and interpret exposed services.'],
      ['SOC · Detection planning', 'Translate observed or expected scan behavior into clear investigation guidance.'],
      ['Security engineering · Configuration review', 'Identify a security-relevant SMB setting and describe the conditions that make it risky.'],
      ['Communication · Runbook writing', 'Explain reconnaissance behaviors, detection opportunities, and tuning considerations.']
    ],
    controls: ['Evaluate requiring SMB signing and restricting SMB access to systems that need it, with compatibility testing.', 'Validate the runbook against actual sensor logs and tune thresholds with both scan traffic and benign baselines.', 'Use host firewalls and network segmentation to reduce unnecessary service exposure.'],
    next: 'Add a reverse proxy and WAF, validate request filtering, and document TLS certificate issuance, renewal, and expiry monitoring.'
  },
  {
    id: 'home', number: '04', category: 'RISK ASSESSMENT / SECURITY HARDENING', title: 'Home Network Security Audit',
    short: 'Turning a home-network inventory and service scan into a prioritized, practical remediation plan.',
    description: 'A scoped assessment of a personal home LAN uses host discovery and service enumeration to document exposure, uncertainty, and recommended security improvements.',
    domains: ['GRC', 'Network Security', 'Security Engineering'], tools: ['Nmap', 'Wireshark', 'Kali Linux'],
    insight: '10 live hosts inventoried; database and camera exposure prioritized for review.',
    evidenceLabel: 'Asset inventory + risk findings', artLabel: 'VISIBILITY BEFORE HARDENING',
    repository: repoRoot + 'home-network-security-audit',
    page: 'https://nikhith-ni7.github.io/home-network-security-audit/',
    scope: 'Personal home LAN. The published report covers a /24 subnet, with 10 live hosts. No exploitation or configuration changes were reported.',
    objective: 'Discover assets, identify reachable services, prioritize potential risks, and document practical next steps without treating a scan result as proof of compromise.',
    workflow: ['Discover live hosts', 'Enumerate services', 'Assess exposure', 'Prioritize remediation'],
    findings: [
      ['Database service reachable on the LAN', 'The report identifies TCP 3306 on a Windows host. Reachability expands the attack surface; a service response does not establish unauthenticated database access.'],
      ['Camera streaming services need an authentication check', 'RTSP-related services were reported on camera devices. Authentication was not confirmed, so unrestricted stream access remains a validation question.'],
      ['Inventory gaps and firmware review identified', 'Four hosts remained unidentified in the report. A detected DNS service version was flagged for review; a specific applicable CVE or successful exploit was not established.'],
      ['Some scanned services were closed or filtered', 'The report lists filtered router management ports and no open top-100 ports on several devices. This describes the tested scope, rather than proving the absence of all exposure.']
    ],
    boundary: 'This portfolio presents the scan as active reconnaissance and separates exposure from confirmed vulnerabilities. Original severity labels are not treated as independently validated CVSS ratings.',
    evidence: [
      {title: 'Assessment scope', type: 'PUBLISHED REPORT', table: {headers: ['Measure', 'Documented scope'], rows: [['Assessment date', 'May 21, 2026'], ['Network', 'Personal /24 LAN'], ['Hosts reported up', '10'], ['Primary port coverage', 'Top 100 ports'], ['Changes / exploitation', 'None reported']]}, url: 'https://nikhith-ni7.github.io/home-network-security-audit/#method'},
      {title: 'Service exposure summary', type: 'INVENTORY EXCERPT', table: {headers: ['Asset', 'Reported services', 'Follow-up question'], rows: [['Router', '53, 80, 443', 'Is the firmware current?'], ['Camera devices', '554 / 5000; HTTPS on one device', 'Is stream access authenticated?'], ['Windows host', '3306 / MySQL', 'Which clients need access?'], ['Unidentified device', '49152 / TCP', 'Who owns it and what is the service?']]}, url: 'https://nikhith-ni7.github.io/home-network-security-audit/'},
      {title: 'Remediation plan', type: 'RECOMMENDATIONS', description: 'The source prioritizes restricting database access, verifying camera authentication, reviewing firmware, isolating IoT devices, and completing the asset inventory. These are recommendations; the report says configurations were not changed.', url: 'https://nikhith-ni7.github.io/home-network-security-audit/#recs'}
    ],
    skills: [
      ['GRC · Risk documentation', 'Connect an asset, observed exposure, possible impact, and recommended treatment.'],
      ['Network security · Asset visibility', 'Build an inventory, interpret service discovery, and identify gaps in scan coverage.'],
      ['Security engineering · Hardening plans', 'Recommend access restrictions, firmware review, and network segmentation.'],
      ['Communication · Evidence boundaries', 'Distinguish observations, assumptions, and the validation needed before closing a finding.']
    ],
    controls: ['Restrict database reachability to authorized clients using service binding and host-firewall rules appropriate to the operating system.', 'Validate camera authentication and separate IoT devices from trusted endpoints where practical.', 'Verify vendor firmware guidance, identify unknown devices, and rescan after authorized changes.'],
    next: 'Implement DNS-based web filtering and segmentation, test the access rules, and document exceptions and troubleshooting.'
  }
];
const CAPABILITIES = [
  {name: 'SOC', label: 'Security operations', icon: 'radar', description: 'Log investigation, packet analysis, detection runbooks'},
  {name: 'IAM', label: 'Identity & access', icon: 'fingerprint', description: 'Authentication events, credential-failure analysis'},
  {name: 'GRC', label: 'Governance, risk & compliance', icon: 'file-check', description: 'Risk assessment and remediation documentation'},
  {name: 'Network Security', label: 'Network security', icon: 'network', description: 'Host discovery, service exposure, protocol analysis'},
  {name: 'Security Engineering', label: 'Security engineering', icon: 'shield', description: 'Detection logic, configuration review, control planning'}
];
