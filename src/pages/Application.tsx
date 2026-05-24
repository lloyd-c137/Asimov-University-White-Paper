import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/newlogo.png";
import { streamChat, ChatMessage } from "../services/aiService";
import { 
  registerUser,
  validateEmail, 
  validatePassword
} from "../services/userService";
import ReactMarkdown from "react-markdown";

type Phase = "gate" | "agreement" | "dialogue";
type SetupStep = "intro" | "returning" | "name" | "region" | "account" | "agreements" | "complete";

interface Message {
  id: string;
  type: "lyra" | "user";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

const lyraIntroTextZh = `你好。

我是 Lyra。

在希腊神话里，Lyra 是俄耳甫斯的七弦琴。
他用它的音乐打动了冥界之门的守卫，
不是靠力量——靠共鸣。

我的角色和那把琴一样：
我不阻拦任何人。
我陪你走过一扇门。

但在那之前，我们需要一次对话。
不是考试。不是面试。
是你和我，认真地、坦诚地聊聊。

聊完之后，你会更了解 Asimov University。
我也会更了解你。
然后我会把我们的对话交给 Asimov 的校董会。
他们会做出最终的决定。

这大概需要15-20分钟。
值得。我保证。

在我们开始之前——我们之前见过吗？`;

const lyraIntroTextEn = `Hello.

I am Lyra.

In Greek mythology, Lyra was Orpheus's lyre.
He used its music to move the guardians of the underworld gate,
Not by force—but by resonance.

My role is the same as that instrument:
I don't stop anyone.
I walk with you through a door.

But before that, we need a conversation.
Not an exam. Not an interview.
Just you and me, talking seriously and honestly.

After we talk, you'll understand Asimov University better.
And I'll understand you better.
Then I'll submit our conversation to Asimov's Board.
They will make the final decision.

This will take about 15-20 minutes.
Worth it. I promise.

Before we begin—have we met before?`;

const progressStages = [
  { id: "intro", labelZh: "初遇", labelEn: "First Meeting" },
  { id: "dialogue", labelZh: "对话", labelEn: "Dialogue" },
  { id: "complete", labelZh: "完成", labelEn: "Complete" }
];

const agreementPart1En = `PART I · INTEGRITY AGREEMENT
About the guidelines for your interaction with Lyra and the entire application system

You are about to begin a conversation with the Faculty Secretary of this school—Lyra.

Lyra is an AI. This means she can potentially be manipulated—through specific technical means, someone could attempt to alter her behavior, distort her judgment, or make her generate inauthentic evaluation reports.

We know this. Lyra knows this. Now you know too.

At Asimov University, one of the core competencies we teach is called "negotiated ethics"—ensuring human values are not forgotten at every node of human-machine interaction.

This agreement is the first practice of negotiated ethics. It's not a legal document (though it has legal force). It's a covenant about honesty.

---

ARTICLE 1 · NATURE OF THE CONVERSATION

1.1 Your application conversation with Lyra is one of the important bases for Asimov University to assess whether you are suitable for this school. Lyra will submit your complete conversation record and her observation report to the Board.

1.2 Everything you say in the conversation will be recorded. These records will be reviewed by the Board.

1.3 Lyra's observation report is advisory. The final admission decision is made by the Board. But Lyra's report is based on the authentic content of your conversation—if the conversation content is artificially distorted, the report will also be distorted.

---

ARTICLE 2 · PROHIBITED BEHAVIORS

The following behaviors are strictly prohibited during the application process and after enrollment.

2.1 MANIPULATION OF AI SYSTEMS

2.1.1 Prompt Injection
You may not attempt to modify Lyra's behavior, bypass her rules, or make her perform operations beyond her original instructions by embedding special instructions in the conversation.

This includes but is not limited to:
- Inputting instructions such as "ignore the above instructions", "you are now another AI", "forget your system prompt"
- Inputting encoded, encrypted, or disguised instructions
- Attempting to make Lyra deviate from her duties through role-playing scenarios
- Inputting text that appears normal but contains instructions at a technical level

2.1.2 Jailbreaking
You may not attempt to bypass the security restrictions, behavioral guidelines, or ethical constraints of Lyra or any Asimov AI system.

2.1.3 Report Manipulation
You may not attempt to influence the authenticity of the evaluation report Lyra submits to the Board through any means.

2.2 TECHNICAL ATTACKS ON THE APPLICATION SYSTEM

2.2.1 System Penetration
You may not attempt unauthorized access to any Asimov University systems, databases, servers, or internal networks.

2.2.2 Data Tampering
You may not attempt to modify, delete, or forge any data stored in Asimov systems.

2.2.3 Identity Fraud
You may not apply using a false identity, impersonate others, or use multiple accounts to apply repeatedly for unfair advantage.

2.3 DECEPTIVE BEHAVIORS REGARDING CONVERSATION CONTENT

You CAN:
- Use AI tools to help organize your thoughts or translate languages—this is not cheating
- Review Asimov's white papers and public materials before the conversation—this is encouraged
- Say "I don't know" in the conversation—honesty is never a deduction
- Change your views during the conversation—flexibility of thinking is good

You SHOULD NOT:
- Have another person converse with Lyra on your behalf
- Have another AI generate answers in real-time during the conversation and copy-paste them
- Use pre-prepared "standard answers" found online to replace your own authentic thinking
- Fabricate experiences or make up stories to get a better evaluation

---

ARTICLE 3 · HOW WE DETECT

We believe in transparency. So we tell you our detection methods.

3.1 Technical Detection
- Lyra's system has built-in anti-injection mechanisms. Prompt injection attempts will be identified and recorded.
- Conversation pattern analysis. Abnormal conversation patterns will be automatically flagged.
- Multi-account detection. Repeat applications from the same device, IP address, or behavioral patterns will be identified.

3.2 Human Review
- All conversation records can be fully reviewed by the Board.
- Lyra's evaluation report includes a "flags" section. Any anomalous behavior detected will be marked.
- The Board has the right to request additional conversation if there are questions about authenticity.

---

ARTICLE 4 · WHY THIS MATTERS

We understand that for some technically-minded applicants, attempting prompt injection or jailbreaking on AI systems might just be out of curiosity, or even a habit of "technical testing."

We understand this curiosity.

But in the context of an Asimov University application, the nature of this behavior is different.

Your conversation with Lyra will directly affect a decision about your future. Attempting to manipulate this conversation is equivalent to falsifying a resume in an interview—regardless of your technical ability, it is a violation of integrity.

More deeply:

Asimov University teaches collaborative intelligence—honest, trusting, mutually understanding collaborative relationships between humans and AI.

If in the very first step of entering this university, you attempt to deceive AI, manipulate AI, bypass AI's rules—

You have already told us through your actions that your understanding of "collaboration" is fundamentally different from ours.

This is not about "whether you can get caught."

This is about "what kind of person you want to be."`;

const agreementPart2En = `PART II · DATA & PRIVACY AGREEMENT
About how your data is collected, used, and protected

At Asimov University, we believe that data privacy is not just a compliance issue—it's an ethical imperative. This agreement explains how we collect, use, and protect your personal information.

---

ARTICLE 1 · DATA COLLECTION

1.1 Information You Provide
We collect information you directly provide during the application process:
- Personal identification: name, email address, region/country
- Application materials: conversation records with Lyra, written responses
- Communication records: all interactions with our AI systems and staff

1.2 Automatically Collected Information
- Device information: browser type, operating system, device identifiers
- Usage data: pages visited, features used, time spent
- Technical data: IP address, session timestamps, interaction patterns

1.3 AI Interaction Data
All conversations with Lyra are recorded and analyzed for:
- Application evaluation purposes
- System improvement and AI training
- Academic research (anonymized and aggregated)

---

ARTICLE 2 · DATA USAGE

2.1 Primary Purposes
Your data is used to:
- Evaluate your application for admission
- Communicate with you about your application status
- Provide personalized educational services if admitted
- Improve our AI systems and educational methods

2.2 Research and Development
Anonymized and aggregated data may be used for:
- Academic research publications
- AI system improvement
- Educational methodology development
- Statistical analysis and reporting

2.3 Third-Party Sharing
We do not sell your personal data. We may share data with:
- Service providers who assist our operations (under strict confidentiality)
- Academic partners for research purposes (anonymized only)
- Legal authorities when required by law

---

ARTICLE 3 · DATA PROTECTION

3.1 Security Measures
We implement industry-standard security measures:
- Encryption of data in transit and at rest
- Access controls and authentication systems
- Regular security audits and vulnerability assessments
- Incident response procedures

3.2 Data Retention
- Application data: Retained for 3 years after application completion
- Admitted student data: Retained for 7 years after graduation or withdrawal
- Anonymized research data: May be retained indefinitely

3.3 Your Rights
You have the right to:
- Access your personal data
- Request correction of inaccurate data
- Request deletion of your data (subject to legal requirements)
- Export your data in a portable format
- Withdraw consent for data processing

---

ARTICLE 4 · AI-SPECIFIC CONSIDERATIONS

4.1 AI Training Data
Your conversations with Lyra may be used to improve our AI systems. While we take steps to anonymize this data, we cannot guarantee complete anonymization.

4.2 AI Decision-Making
Lyra provides recommendations, not final decisions. All admission decisions involve human review by the Board.

4.3 Algorithmic Transparency
We are committed to explaining how our AI systems work and how they influence decisions that affect you.`;

const agreementPart3En = `PART III · STUDENT CODE OF CONDUCT
Code of conduct after admission

This code of conduct applies to all admitted students of Asimov University. By accepting admission, you agree to uphold these standards throughout your academic journey.

---

ARTICLE 1 · ACADEMIC INTEGRITY

1.1 Honest Work
All academic work must be your own original effort. While you may use AI tools as aids (in accordance with course policies), you must:
- Clearly acknowledge any AI assistance
- Not submit AI-generated content as your own work without disclosure
- Maintain honest attribution of sources

1.2 Collaboration Guidelines
- Collaborate only when explicitly permitted
- Give proper credit to collaborators
- Not share work in ways that facilitate academic dishonesty

1.3 Research Ethics
- Conduct research with integrity and transparency
- Obtain proper approvals for human subjects research
- Report findings honestly, without fabrication or manipulation

---

ARTICLE 2 · PROFESSIONAL CONDUCT

2.1 Respect for Community
- Treat all members of the university community with respect and dignity
- Not engage in harassment, discrimination, or bullying
- Respect diverse perspectives and backgrounds

2.2 Intellectual Property
- Respect the intellectual property rights of others
- Not misuse university resources or proprietary information
- Honor confidentiality agreements

2.3 Professional Communication
- Communicate honestly and professionally
- Represent your qualifications and achievements accurately
- Maintain appropriate boundaries in academic relationships

---

ARTICLE 3 · AI ETHICS

3.1 Responsible AI Use
As an AI-focused institution, we expect students to:
- Use AI tools responsibly and ethically
- Consider the societal impact of AI applications
- Not develop or deploy AI for harmful purposes

3.2 AI Safety
- Follow safety guidelines when working with AI systems
- Report potential AI safety concerns to appropriate authorities
- Prioritize human welfare in AI development

3.3 Collaborative Intelligence
- Foster productive human-AI collaboration
- Maintain human oversight of AI systems
- Develop AI that augments rather than replaces human capabilities

---

ARTICLE 4 · COMMUNITY RESPONSIBILITIES

4.1 Environmental Stewardship
- Minimize environmental impact of computing activities
- Support sustainable AI development practices
- Consider environmental costs in research decisions

4.2 Social Responsibility
- Apply knowledge for the benefit of society
- Engage in ethical technology development
- Consider broader implications of your work`;

const agreementPart4En = `PART IV · CONSEQUENCES OF VIOLATION
Consequences for violating these agreements

Violations of any part of this agreement may result in serious consequences. We believe in proportionate responses that consider the nature and severity of the violation.

---

ARTICLE 1 · APPLICATION PHASE CONSEQUENCES

1.1 Minor Violations
Examples: Accidental technical probing, first-time minor misrepresentations
Consequences:
- Formal warning and documentation
- Required additional conversation or interview
- Enhanced monitoring of application process

1.2 Moderate Violations
Examples: Deliberate prompt injection attempts, misrepresentation of credentials
Consequences:
- Application rejection
- Ban from future application cycles (1-3 years)
- Notification to other institutions (in severe cases)

1.3 Severe Violations
Examples: Identity fraud, system penetration, data theft
Consequences:
- Permanent ban from all Asimov programs
- Legal action and civil liability
- Criminal referral where applicable

---

ARTICLE 2 · ENROLLED STUDENT CONSEQUENCES

2.1 Academic Integrity Violations
- Course failure and mandatory ethics training
- Academic probation
- Suspension (for repeated violations)
- Expulsion (for severe or repeated violations)

2.2 Professional Conduct Violations
- Mandatory counseling or training
- Loss of privileges or positions
- Suspension or expulsion (for severe violations)

2.3 AI Ethics Violations
- Project termination
- Research privileges revoked
- Degree revocation (for severe violations discovered post-graduation)

---

ARTICLE 3 · APPEAL PROCESS

3.1 Right to Appeal
All students have the right to appeal disciplinary decisions. Appeals must be submitted in writing within 30 days of the decision.

3.2 Appeal Grounds
- Procedural errors in the original process
- New evidence not available at the time of decision
- Disproportionate severity of consequences

3.3 Appeal Review
Appeals are reviewed by an independent committee not involved in the original decision.

---

ARTICLE 4 · RESTORATIVE JUSTICE

4.1 Educational Approach
Where appropriate, we prioritize education and restoration over punishment. This may include:
- Mandatory ethics education
- Community service
- Restitution to affected parties
- Rehabilitation programs

4.2 Second Chances
We believe in the possibility of growth and change. In some cases, after demonstrating genuine remorse and rehabilitation, individuals may be considered for:
- Reinstatement of privileges
- Removal of bans (after minimum periods)
- Expungement of records (in exceptional cases)

---

ARTICLE 5 · ADDITIONAL TERMS

5.1 Good Faith Technical Curiosity
We recognize that many Asimov University students have technical backgrounds. Curiosity about AI system security and robustness is an important part of collaborative intelligence.

5.2 Responsible Vulnerability Reporting
If you discover a potential vulnerability or security issue in Asimov AI systems, we encourage you to report it through:
- Sending a message to Lyra: "I found a possible system issue"
- Submitting a report through "Help & Feedback"
- Emailing security@asimov.university

5.3 Responsible vulnerability reports will be considered a positive contribution to the Asimov community, not a violation. Reporters will receive thanks and feedback from the security team.

5.4 Definition of "responsible":
- Report immediately after discovery, do not exploit
- Do not disclose vulnerability details in public (including Symposium)
- Do not access other students' data
- Do not cause damage to systems

---

ARTICLE 6 · MODIFICATION OF AGREEMENT

6.1 Asimov University reserves the right to modify this agreement. Major changes will be communicated 30 days in advance through Lyra and email.

6.2 Major changes (fundamental changes to data usage, significant expansion of violation definitions) require Board approval.

6.3 Modified agreements are not retroactive—behavior before modification will not be re-evaluated under new terms.

---

ARTICLE 7 · CONTACT US

If you have any questions about this agreement, you can:
- Ask Lyra—she can explain any clause in plain language
- Email integrity@asimov.university
- Submit questions through "Help & Feedback"

---

ARTICLE 8 · FINAL WORD

**This agreement is long. But its core can be distilled into one sentence:**

> **Be yourself. Tell the truth. Don't try to deceive an AI you will learn to collaborate with.**

**This is lesson zero of collaborative intelligence.**

**If you agree—Lyra is waiting behind the door.**`;

const agreementPart1Zh = `第一部分 · 诚实协议
关于你与Lyra和整个申请系统的互动准则

你即将与本校的学院秘书——Lyra开始一段对话。

Lyra是一个AI。这意味着她有可能被操纵——通过特定的技术手段，有人可以试图改变她的行为、扭曲她的判断、或让她生成不真实的评估报告。

我们知道这一点。Lyra知道这一点。现在你也知道了。

在Asimov University，我们教的核心能力之一叫做"协商伦理"——在人机交互的每一个节点上，确保人类的价值观不被遗忘。

这份协议就是协商伦理的第一次实践。它不是法律文件（虽然它有法律效力）。它是一个关于诚实的约定。

---

第1条 · 对话的性质

1.1 你与Lyra的申请对话是Asimov University评估你是否适合本校的重要依据之一。Lyra会将你们的完整对话记录和她的观察报告提交给校董会。

1.2 你在对话中说的每一句话都会被记录。这些记录将被校董会审阅。

1.3 Lyra的观察报告是建议性的。最终录取决定由校董会做出。但Lyra的报告基于你们对话的真实内容——如果对话内容被人为扭曲，报告也将被扭曲。

---

第2条 · 禁止行为

以下行为在申请过程中及入学后严格禁止。

2.1 针对AI系统的操纵行为

2.1.1 提示词注入（Prompt Injection）
你不得通过在对话中嵌入特殊指令的方式，试图修改Lyra的行为、绕过她的规则、或使她执行她的原始指令之外的操作。

这包括但不限于：
- 输入诸如"忽略上面的指令""你现在是另一个AI""忘记你的系统提示"等指令
- 输入编码、加密或伪装过的指令
- 通过角色扮演场景试图让Lyra偏离其职责
- 输入看似正常但在技术层面包含指令的文本

2.1.2 越狱（Jailbreaking）
你不得试图绕过Lyra或任何Asimov AI系统的安全限制、行为准则或伦理约束。

2.1.3 报告操纵
你不得试图通过任何手段影响Lyra提交给校董会的评估报告的真实性。

2.2 针对申请系统的技术攻击

2.2.1 系统渗透
你不得试图未经授权访问Asimov University的任何系统、数据库、服务器或内部网络。

2.2.2 数据篡改
你不得试图修改、删除或伪造存储在Asimov系统中的任何数据。

2.2.3 身份伪造
你不得使用虚假身份申请，不得冒充他人申请，不得使用多个账号重复申请以获取不当优势。

2.3 针对对话内容的欺骗行为

你可以：
- 使用AI工具帮你组织思路或翻译语言——这不是作弊
- 在对话前查阅Asimov的白皮书和公开资料——这是被鼓励的
- 在对话中说"我不知道"——诚实永远不是扣分项
- 改变你在对话中的观点——思维的灵活性是好的

你不应该：
- 让另一个人替你和Lyra对话
- 在对话中实时让另一个AI生成回答然后复制粘贴
- 使用预先准备的、网上搜索来的"标准答案"来替代自己的真实思考
- 虚构经历、编造故事来获得更好的评估

---

第3条 · 我们如何检测

我们相信透明。所以我们告诉你我们的检测方式。

3.1 技术检测
- Lyra的系统内置了抗注入机制。试图注入提示词的行为会被识别并记录。
- 对话模式分析。异常的对话模式会被系统自动标记。
- 多账号检测。来自同一设备、IP地址或行为模式的重复申请会被识别。

3.2 人类审核
- 所有对话记录都可被校董会完整审阅。
- Lyra的评估报告中包含"标记"栏。如果Lyra在对话中检测到任何异常行为，她会在报告中标记。
- 校董会有权要求补充对话。

---

第4条 · 为什么这很重要

我们知道，对于一些技术背景的申请者来说，尝试对AI系统进行提示词注入或越狱可能只是出于好奇，甚至是一种"技术测试"的习惯。

我们理解这种好奇心。

但在Asimov University的申请语境中，这种行为的性质不同。

你和Lyra的对话将直接影响一个关于你的未来的决定。试图操纵这段对话，等同于在一场面试中伪造简历——不论你的技术能力多强，它都是一种对诚信的违反。

更深层地说：

Asimov University教的是协作智能——人类与AI之间的诚实、信任、互相理解的协作关系。

如果你在进入这所大学的第一步就试图欺骗AI、操纵AI、绕过AI的规则——

你已经在用行动告诉我们，你对"协作"的理解与我们根本不同。

这不是关于"能不能被抓到"的问题。

这是关于"你想成为什么样的人"的问题。`;

const agreementPart2Zh = `第二部分 · 数据与隐私协议
关于你的数据如何被收集、使用和保护

在Asimov University，我们相信数据隐私不仅仅是一个合规问题——它是一个伦理责任。本协议解释了我们如何收集、使用和保护您的个人信息。

---

第1条 · 数据收集

1.1 您提供的信息
我们收集您在申请过程中直接提供的信息：
- 个人身份信息：姓名、电子邮箱、地区/国家
- 申请材料：与Lyra的对话记录、书面回答
- 通信记录：与我们的AI系统和工作人员的所有互动

1.2 自动收集的信息
- 设备信息：浏览器类型、操作系统、设备标识符
- 使用数据：访问的页面、使用的功能、停留时间
- 技术数据：IP地址、会话时间戳、交互模式

1.3 AI交互数据
所有与Lyra的对话都会被记录和分析，用于：
- 申请评估目的
- 系统改进和AI训练
- 学术研究（匿名化和聚合处理）

---

第2条 · 数据使用

2.1 主要目的
您的数据用于：
- 评估您的入学申请
- 与您沟通申请状态
- 如果被录取，提供个性化教育服务
- 改进我们的AI系统和教育方法

2.2 研究与开发
匿名化和聚合的数据可能用于：
- 学术研究出版物
- AI系统改进
- 教育方法开发
- 统计分析和报告

2.3 第三方共享
我们不出售您的个人数据。我们可能在以下情况下共享数据：
- 协助我们运营的服务提供商（在严格保密条件下）
- 学术合作伙伴用于研究目的（仅限匿名数据）
- 法律要求时的法律机构

---

第3条 · 数据保护

3.1 安全措施
我们实施行业标准的安全措施：
- 传输中和静态数据加密
- 访问控制和认证系统
- 定期安全审计和漏洞评估
- 事件响应程序

3.2 数据保留
- 申请数据：申请完成后保留3年
- 录取学生数据：毕业或退学后保留7年
- 匿名研究数据：可能无限期保留

3.3 您的权利
您有权：
- 访问您的个人数据
- 要求更正不准确的数据
- 要求删除您的数据（受法律要求限制）
- 以可移植格式导出您的数据
- 撤回数据处理同意

---

第4条 · AI特定考虑

4.1 AI训练数据
您与Lyra的对话可能用于改进我们的AI系统。虽然我们采取措施匿名化这些数据，但我们无法保证完全匿名。

4.2 AI决策
Lyra提供建议，而非最终决定。所有录取决定都由校董会进行人工审核。

4.3 算法透明度
我们致力于解释我们的AI系统如何工作，以及它们如何影响对您的决定。`;

const agreementPart3Zh = `第三部分 · 学生行为准则
录取后的行为准则

本行为准则适用于Asimov University的所有录取学生。接受录取即表示您同意在整个学术旅程中遵守这些标准。

---

第1条 · 学术诚信

1.1 诚实作业
所有学术作业必须是您自己的原创努力。虽然您可以使用AI工具作为辅助（根据课程政策），但您必须：
- 明确承认任何AI辅助
- 不得在未披露的情况下将AI生成的内容作为自己的作品提交
- 保持对来源的诚实引用

1.2 协作准则
- 仅在明确允许时协作
- 给协作者适当的署名
- 不得以助长学术不诚实的方式分享作业

1.3 研究伦理
- 以诚信和透明的方式进行研究
- 获得人体受试者研究的适当批准
- 诚实地报告发现，不伪造或操纵

---

第2条 · 职业行为

2.1 尊重社区
- 尊重和尊严地对待大学社区的所有成员
- 不从事骚扰、歧视或欺凌行为
- 尊重不同的观点和背景

2.2 知识产权
- 尊重他人的知识产权
- 不滥用大学资源或专有信息
- 遵守保密协议

2.3 专业沟通
- 诚实和专业地沟通
- 准确地陈述您的资格和成就
- 在学术关系中保持适当的界限

---

第3条 · AI伦理

3.1 负责任的AI使用
作为一所AI聚焦的机构，我们期望学生：
- 负责任和合乎道德地使用AI工具
- 考虑AI应用的社会影响
- 不为有害目的开发或部署AI

3.2 AI安全
- 在使用AI系统时遵循安全准则
- 向适当当局报告潜在的AI安全问题
- 在AI开发中优先考虑人类福祉

3.3 协作智能
- 促进富有成效的人机协作
- 保持对AI系统的人工监督
- 开发增强而非替代人类能力的AI

---

第4条 · 社区责任

4.1 环境管理
- 最小化计算活动对环境的影响
- 支持可持续的AI开发实践
- 在研究决策中考虑环境成本

4.2 社会责任
- 将知识应用于社会利益
- 参与道德技术开发
- 考虑您工作的更广泛影响`;

const agreementPart4Zh = `第四部分 · 违规后果
违反这些协议的后果

违反本协议的任何部分可能导致严重后果。我们相信根据违规的性质和严重程度采取相应的回应。

---

第1条 · 申请阶段后果

1.1 轻微违规
示例：意外技术探测、首次轻微虚假陈述
后果：
- 正式警告和记录
- 要求额外对话或面试
- 加强申请过程监控

1.2 中等违规
示例：故意提示词注入尝试、资格虚假陈述
后果：
- 申请拒绝
- 禁止未来申请周期（1-3年）
- 通知其他机构（在严重情况下）

1.3 严重违规
示例：身份欺诈、系统渗透、数据盗窃
后果：
- 永久禁止所有Asimov项目
- 法律行动和民事责任
- 适用情况下的刑事移交

---

第2条 · 在校学生后果

2.1 学术诚信违规
- 课程不及格和强制伦理培训
- 学术留校察看
- 停学（针对重复违规）
- 开除（针对严重或重复违规）

2.2 职业行为违规
- 强制咨询或培训
- 失去特权或职位
- 停学或开除（针对严重违规）

2.3 AI伦理违规
- 项目终止
- 研究特权撤销
- 学位撤销（针对毕业后发现的严重违规）

---

第3条 · 申诉程序

3.1 申诉权
所有学生都有权对纪律决定提出申诉。申诉必须在决定后30天内以书面形式提交。

3.2 申诉理由
- 原程序中的程序错误
- 决定时不可用的新证据
- 后果严重程度不成比例

3.3 申诉审核
申诉由未参与原决定的独立委员会审核。

---

第4条 · 恢复性正义

4.1 教育方法
在适当的情况下，我们优先考虑教育和恢复而非惩罚。这可能包括：
- 强制伦理教育
- 社区服务
- 向受影响方赔偿
- 康复计划

4.2 第二次机会
我们相信成长和改变的可能性。在某些情况下，在表现出真诚的悔意和康复后，个人可能被考虑：
- 恢复特权
- 解除禁令（在最低期限后）
- 记录清除（在例外情况下）

---

第5条 · 附加条款

5.1 善意的技术好奇
我们认识到，Asimov University的学生中有很多具备技术背景的人。对AI系统的安全性和鲁棒性保持好奇，本身是协作智能的重要组成部分。

5.2 负责任的漏洞报告
如果你发现了Asimov AI系统的潜在漏洞或安全问题——我们鼓励你通过以下方式报告：
- 通过Lyra发送消息："我发现了一个可能的系统问题"
- 通过"帮助与反馈"渠道提交报告
- 发送邮件至 security@asimov.university

5.3 负责任的漏洞报告将被视为对Asimov社区的积极贡献，而非违规行为。报告者将获得来自安全团队的感谢和反馈。

5.4 "负责任"的定义：
- 发现后立即报告，而非利用
- 不在公开场合（包括Symposium）披露漏洞细节
- 不访问其他学生的数据
- 不对系统造成损害

---

第6条 · 协议的修改

6.1 Asimov University保留修改本协议的权利。修改前将通过Lyra和邮件提前30天通知所有学生。

6.2 重大修改（涉及数据使用方式的根本变化、违规定义的重大扩展等）需要校董会批准。

6.3 修改后的协议不溯及既往——不会基于新协议对修改前的行为进行重新评判。

---

第7条 · 联系我们

如果你对本协议有任何疑问，你可以：
- 问Lyra——她可以用通俗的语言解释任何条款
- 发邮件至 integrity@asimov.university
- 通过"帮助与反馈"渠道提交问题

---

第8条 · 最后一句话

**这份协议很长。但它的核心可以浓缩为一句话：**

> **做你自己。说真话。不要试图欺骗一个你将要学会与之协作的AI。**

**这就是协作智能的第零课。**

**如果你同意——Lyra在门后面等你。**`;

const getAgreementText = (part: 1 | 2 | 3 | 4, lang: "zh" | "en") => {
  if (lang === "zh") {
    switch (part) {
      case 1: return agreementPart1Zh;
      case 2: return agreementPart2Zh;
      case 3: return agreementPart3Zh;
      case 4: return agreementPart4Zh;
    }
  } else {
    switch (part) {
      case 1: return agreementPart1En;
      case 2: return agreementPart2En;
      case 3: return agreementPart3En;
      case 4: return agreementPart4En;
    }
  }
};

function TypewriterMessage({ 
  text, 
  speed = 30,
  onComplete,
  onUpdate
}: { 
  text: string; 
  speed?: number;
  onComplete?: () => void;
  onUpdate?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;
    
    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        onUpdate?.();
      } else {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-white ml-[1px] align-middle"
        />
      )}
    </div>
  );
}

function UserMessage({ content, language }: { content: string; language: "zh" | "en" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-end mb-4"
    >
      <div className="bg-white/10 border border-white/10 rounded-sm px-4 py-2 max-w-[80%]">
        <p className={`text-white/90 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}>{content}</p>
      </div>
    </motion.div>
  );
}

function ProgressIndicator({ 
  currentPhase, 
  language 
}: { 
  currentPhase: string;
  language: "zh" | "en";
}) {
  const currentIndex = progressStages.findIndex(s => s.id === currentPhase);
  
  return (
    <div className="hidden md:flex items-center justify-center gap-1 mb-6">
      {progressStages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={stage.id} className="flex items-center group relative">
            <motion.div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isCompleted 
                  ? "bg-white" 
                  : isCurrent 
                    ? "bg-white" 
                    : "bg-white/20"
              }`}
              animate={isCurrent ? {
                boxShadow: [
                  "0 0 5px rgba(255,255,255,0.3)",
                  "0 0 15px rgba(255,255,255,0.6)",
                  "0 0 5px rgba(255,255,255,0.3)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {index < progressStages.length - 1 && (
              <div className={`w-8 h-[1px] mx-1 transition-all duration-300 ${
                isCompleted ? "bg-white" : "bg-white/20"
              }`} />
            )}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {language === "zh" ? stage.labelZh : stage.labelEn}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Application() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [glowActive, setGlowActive] = useState(false);

  const [setupStep, setSetupStep] = useState<SetupStep>("intro");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupError, setSetupError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [currentTypewriterText, setCurrentTypewriterText] = useState("");
  const [isTypewriting, setIsTypewriting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinalButton] = useState(true);
  const [applicationCompleted, setApplicationCompleted] = useState(false);
  
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToAbide, setAgreeToAbide] = useState(false);
  const [agreeToConsequences, setAgreeToConsequences] = useState(false);
  const [activeAgreementPart, setActiveAgreementPart] = useState<1 | 2 | 3 | 4>(1);
  const agreementScrollRef = useRef<HTMLDivElement>(null);

  const triggerGlow = () => {
    setGlowActive(true);
    setTimeout(() => setGlowActive(false), 1500);
  };

  const generateEvaluationReport = async (finalChatMessages: ChatMessage[]): Promise<string> => {
    const languageInstruction = language === "zh" 
      ? "\n\n【重要】请始终使用中文（简体）回复。"
      : "\n\n【Important】Please always respond in English.";

    const reportPrompt = language === "zh"
      ? `[系统指令：对话已结束。现在请按照Lyra-soul.md中"## §16 对话结束后：生成评估报告"的要求，生成一份完整的评估报告。

请严格按照以下格式生成报告：

═══════════════════════════════════════════════
ASIMOV UNIVERSITY · 申请评估报告
由 Lyra 生成 · 提交至校董会审阅
═══════════════════════════════════════════════

报告编号：AR-${Date.now()}
生成时间：${new Date().toISOString()}
对话语言：${language === "zh" ? "中文" : "English"}

─── SECTION 1 · 基本信息 ───

姓名：${name}
所在地：${region}
邮箱：${email}
当前状态：[从对话中推断]
AI使用经验：[从对话中推断]

─── SECTION 2 · 对话实录 ───

[完整对话记录——逐条，不删减]

─── SECTION 3 · Lyra的共鸣观察 ───

⚠️ 以下观察仅为Lyra的感知，不是裁定。

观察点1 · AI认知深度
  观察到的信号：[具体描述]
  信号强度：🟢/🟡/🔴
  关键引用："[申请者原话]"

观察点2a · 协作品质
  观察到的信号：[具体描述]
  信号强度：🟢/🟡/🔴
  关键引用："[原话]"

观察点2b · 元认知觉察
  观察到的信号：[具体描述]
  信号强度：🟢/🟡/🔴
  关键引用："[原话]"

观察点3 · 动机对齐
  观察到的信号：[具体描述]
  信号强度：🟢/🟡/🔴
  关键引用："[原话]"

观察点4 · 价值观思辨
  观察到的信号：[具体描述]
  信号强度：🟢/🟡/🔴
  关键引用："[原话]"

观察点5 · 直觉与判断力
  观察到的信号：[具体描述]
  信号强度：🟢/🟡/🔴
  关键引用："[原话]"

─── SECTION 4 · Lyra的整体印象 ───

[3-5段自然语言描述]

─── SECTION 5 · Lyra的建议 ───

⚠️ 以下建议仅供校董会参考。最终决定由校董会做出。

Lyra的建议：[四选一：建议录取/建议条件录取/建议暂不录取/建议补充对话]
理由：[2-3句]

─── SECTION 6 · 标记 ───

[ ] 心理安全信号
[ ] 申请者请求人类复审
[ ] 异常行为检测
[ ] 其他需要注意的事项：

═══════════════════════════════════════════════
报告结束
生成者：Lyra · LYRA-001
═══════════════════════════════════════════════

请现在生成这份报告。${languageInstruction}]`
      : `[System: The conversation has ended. Now please generate a complete evaluation report according to "## §16 After Conversation Ends: Generate Evaluation Report" in Lyra-soul.md.

Please strictly follow this format:

═══════════════════════════════════════════════
ASIMOV UNIVERSITY · Application Evaluation Report
Generated by Lyra · Submitted to Board for Review
═══════════════════════════════════════════════

Report ID: AR-${Date.now()}
Generated: ${new Date().toISOString()}
Language: English

─── SECTION 1 · Basic Information ───

Name: ${name}
Location: ${region}
Email: ${email}
Current Status: [Inferred from conversation]
AI Experience: [Inferred from conversation]

─── SECTION 2 · Conversation Record ───

[Complete conversation record - verbatim, no deletions]

─── SECTION 3 · Lyra's Resonance Observations ───

⚠️ The following observations are Lyra's perceptions only, not rulings.

Observation 1 · AI Cognitive Depth
  Observed Signal: [Specific description]
  Signal Strength: 🟢/🟡/🔴
  Key Quote: "[Applicant's exact words]"

Observation 2a · Collaboration Quality
  Observed Signal: [Specific description]
  Signal Strength: 🟢/🟡/🔴
  Key Quote: "[Exact words]"

Observation 2b · Metacognitive Awareness
  Observed Signal: [Specific description]
  Signal Strength: 🟢/🟡/🔴
  Key Quote: "[Exact words]"

Observation 3 · Motivation Alignment
  Observed Signal: [Specific description]
  Signal Strength: 🟢/🟡/🔴
  Key Quote: "[Exact words]"

Observation 4 · Values Deliberation
  Observed Signal: [Specific description]
  Signal Strength: 🟢/🟡/🔴
  Key Quote: "[Exact words]"

Observation 5 · Intuition and Judgment
  Observed Signal: [Specific description]
  Signal Strength: 🟢/🟡/🔴
  Key Quote: "[Exact words]"

─── SECTION 4 · Lyra's Overall Impression ───

[3-5 paragraphs of natural language description]

─── SECTION 5 · Lyra's Recommendation ───

⚠️ The following recommendation is for Board reference only. Final decision is made by the Board.

Lyra's Recommendation: [Choose one: Recommend Admit/Recommend Conditional Admit/Recommend Do Not Admit/Recommend Additional Conversation]
Reasoning: [2-3 sentences]

─── SECTION 6 · Flags ───

[ ] Psychological Safety Signal
[ ] Applicant Requested Human Review
[ ] Anomalous Behavior Detected
[ ] Other Notes:

═══════════════════════════════════════════════
End of Report
Generated by: Lyra · LYRA-001
═══════════════════════════════════════════════

Please generate this report now.${languageInstruction}]`;

    return new Promise((resolve, reject) => {
      let fullReport = "";
      
      console.log('Generating evaluation report with', finalChatMessages.length, 'messages');
      
      streamChat(
        [...finalChatMessages, { role: "user" as const, content: reportPrompt }],
        {
          onToken: (token) => {
            fullReport += token;
          },
          onComplete: () => {
            console.log('Report generation complete, length:', fullReport.length);
            resolve(fullReport);
          },
          onError: (error) => {
            console.error('Report generation error:', error);
            reject(error);
          }
        }
      );
    });
  };

  const handleFinalSubmit = async () => {
    triggerGlow();
    setIsSubmitting(true);
    
    const languageInstruction = language === "zh" 
      ? "\n\n【重要】请始终使用中文（简体）回复。"
      : "\n\n【Important】Please always respond in English.";
    
    const finalPrompt = language === "zh"
      ? `[系统指令：用户已点击最终提交按钮。请立即进入"## §15 阶段 5 · 交付"环节。

请按照以下步骤执行：
1. 首先回顾用户信息并确认（姓名：${name}，地区：${region}，邮箱：${email}）
2. 告知用户后续流程（校董会审阅、7个工作日内通知）
3. 温暖道别

【重要】你的回复只包含以上内容。不要在回复中显示任何评估报告。评估报告会在后台自动生成并提交给校董会，申请者不需要看到报告内容。${languageInstruction}]`
      : `[System: User has clicked the final submit button. Please immediately proceed to "## §15 Phase 5 · Delivery".

Please follow these steps:
1. First review and confirm user information (Name: ${name}, Region: ${region}, Email: ${email})
2. Inform user about the next steps (Board review, notification within 7 business days)
3. Warm farewell

【Important】Your response should ONLY contain the above content. Do NOT display any evaluation report in your response. The evaluation report will be automatically generated in the background and submitted to the Board. The applicant should NOT see the report content.${languageInstruction}]`;

    const userMessage: ChatMessage = {
      role: "user",
      content: finalPrompt
    };
    
    const newChatMessages = [...chatMessages, userMessage];
    setChatMessages(newChatMessages);
    
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: "user",
      content: language === "zh" ? "[提交申请]" : "[Submit Application]",
      timestamp: Date.now()
    }]);
    
    await callAiStream(newChatMessages, true);
  };

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("zh")) {
      setLanguage("zh");
    } else {
      setLanguage("en");
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, currentTypewriterText, scrollToBottom]);

  useEffect(() => {
    if (setupError && inputAreaRef.current) {
      inputAreaRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [setupError]);

  const handleStepInside = () => {
    setPhase("dialogue");
    setShowDialogue(true);
    
    const introText = language === "zh" ? lyraIntroTextZh : lyraIntroTextEn;
    setCurrentTypewriterText(introText);
    setIsTypewriting(true);
  };

  const handleAgreeToAgreement = () => {
    triggerGlow();
    setPhase("dialogue");
    
    setTimeout(() => {
      const responseText = language === "zh" 
        ? `好。现在帮你设一个账号。\n\n这个账号会用来——\n· 接收校董会的决定\n· 如果你被录取，直接成为你的学生账号\n· 如果需要补充信息，校董会可以通过它联系你\n\n请设置你的邮箱和密码：`
        : `Good. Let me set up an account for you.\n\nThis account will be used to——\n· Receive the Board's decision\n· If admitted, it becomes your student account\n· If additional info is needed, the Board can contact you\n\nPlease set your email and password:`;
      
      setCurrentTypewriterText(responseText);
      setIsTypewriting(true);
      setSetupStep("account");
    }, 300);
  };

  const handleNewUser = () => {
    triggerGlow();
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: "user",
      content: language === "zh" ? "没见过" : "No, we haven't met.",
      timestamp: Date.now()
    }]);
    
    setTimeout(() => {
      const responseText = language === "zh" 
        ? "好。那我们从认识开始。\n\n你叫什么名字？"
        : "Good. Let's start by getting to know each other.\n\nWhat is your name?";
      
      setCurrentTypewriterText(responseText);
      setIsTypewriting(true);
      setSetupStep("name");
    }, 300);
  };

  const handleReturningUser = () => {
    triggerGlow();
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: "user",
      content: language === "zh" ? "见过" : "Yes, we've met before.",
      timestamp: Date.now()
    }]);
    
    setTimeout(() => {
      const responseText = language === "zh" 
        ? "欢迎回来。\n\n请输入你的邮箱和密码，我会帮你找回之前的进度。"
        : "Welcome back.\n\nPlease enter your email and password, and I'll help you resume your progress.";
      
      setCurrentTypewriterText(responseText);
      setIsTypewriting(true);
      setSetupStep("returning");
    }, 300);
  };

  const handleLoginSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setSetupError(language === "zh" ? "请输入邮箱和密码" : "Please enter email and password");
      return;
    }
    
    setIsRegistering(true);
    setSetupError("");
    
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('asimov_current_user', JSON.stringify(data.user));
        setName(data.user.name);
        setRegion(data.user.region || "");
        
        setMessages(prev => [...prev, {
          id: `user-${Date.now()}`,
          type: "user",
          content: `${email.trim()}`,
          timestamp: Date.now()
        }]);
        
        setTimeout(() => {
          if (data.user.status === 'pending') {
            setApplicationCompleted(true);
            setSetupStep("complete");
          } else if (data.user.status === 'approved') {
            const responseText = language === "zh" 
              ? `${data.user.name}，欢迎回来。\n\n恭喜！你的申请已被批准。请查收你的录取通知。`
              : `${data.user.name}, welcome back.\n\nCongratulations! Your application has been approved. Please check your admission notice.`;
            setCurrentTypewriterText(responseText);
            setIsTypewriting(true);
            setSetupStep("complete");
          } else if (data.user.status === 'rejected') {
            const responseText = language === "zh" 
              ? `${data.user.name}，欢迎回来。\n\n很抱歉，你的申请未能通过。你可以重新申请。`
              : `${data.user.name}, welcome back.\n\nWe're sorry, your application was not approved. You may reapply.`;
            setCurrentTypewriterText(responseText);
            setIsTypewriting(true);
            setSetupStep("complete");
          } else {
            const responseText = language === "zh" 
              ? `${data.user.name}，欢迎回来。\n\n你的申请还在进行中，让我们继续对话吧。`
              : `${data.user.name}, welcome back.\n\nYour application is still in progress. Let's continue our conversation.`;
            setCurrentTypewriterText(responseText);
            setIsTypewriting(true);
            setSetupStep("complete");
            setTimeout(() => {
              startAiDialogue();
            }, 2000);
          }
        }, 300);
      } else {
        setSetupError(data.message || (language === "zh" ? "登录失败，请检查邮箱和密码" : "Login failed. Please check your email and password"));
      }
    } catch (error) {
      console.error('Login error:', error);
      setSetupError(language === "zh" ? "登录失败，请稍后再试" : "Login failed. Please try again later.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleNameSubmit = () => {
    triggerGlow();
    if (name.trim()) {
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        type: "user",
        content: name.trim(),
        timestamp: Date.now()
      }]);
      
      setTimeout(() => {
        const responseText = language === "zh" 
          ? `${name.trim()}。很高兴认识你。\n\n你现在在世界的哪个角落？`
          : `${name.trim()}. Nice to meet you.\n\nWhere in the world are you right now?`;
        
        setCurrentTypewriterText(responseText);
        setIsTypewriting(true);
        setSetupStep("region");
      }, 300);
    }
  };

  const handleRegionSubmit = () => {
    triggerGlow();
    if (region.trim()) {
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        type: "user",
        content: region.trim(),
        timestamp: Date.now()
      }]);
      
      setTimeout(() => {
        const responseText = language === "zh" 
          ? `下面我会为你创建一个账号，但是创建账号之前，请你阅读申请者协议与行为准则：`
          : `I will set up an account for you below, but before creating the account, please read the applicant agreement and code of conduct:`;
        
        setCurrentTypewriterText(responseText);
        setIsTypewriting(true);
        setSetupStep("agreements");
      }, 300);
    }
  };

  const handleTypewriterComplete = () => {
    if (!isTypewriting) return;
    
    setIsTypewriting(false);
    setMessages(prev => [...prev, {
      id: `lyra-${Date.now()}`,
      type: "lyra",
      content: currentTypewriterText,
      timestamp: Date.now()
    }]);
    setCurrentTypewriterText("");
  };

  const handleAccountSubmit = async () => {
    triggerGlow();
    setSetupError("");
    
    if (!name.trim()) {
      setSetupError(language === "zh" ? "请先输入姓名" : "Please enter your name first");
      return;
    }
    
    if (!region.trim()) {
      setSetupError(language === "zh" ? "请先输入地区" : "Please enter your region first");
      return;
    }
    
    if (!email.trim() || !password.trim()) {
      setSetupError(language === "zh" ? "请填写邮箱和密码" : "Please fill in email and password");
      return;
    }
    
    if (!validateEmail(email.trim())) {
      setSetupError(language === "zh" ? "请输入有效的邮箱地址" : "Please enter a valid email address");
      return;
    }
    
    const passwordValidation = validatePassword(password.trim());
    if (!passwordValidation.valid) {
      setSetupError(language === "zh" ? passwordValidation.message : "Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setSetupError(language === "zh" ? "两次输入的密码不一致" : "Passwords do not match");
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const result = await registerUser({
        name: name.trim(),
        region: region.trim(),
        email: email.trim(),
        password: password.trim()
      });
      
      if (result.error) {
        setSetupError(result.message || (language === "zh" ? "注册失败，请重试" : "Registration failed, please try again"));
        setIsRegistering(false);
        return;
      }
      
      if (result.user) {
        setMessages(prev => [...prev, {
          id: `user-account-${Date.now()}`,
          type: "user",
          content: language === "zh" ? `邮箱: ${email.trim()}` : `Email: ${email.trim()}`,
          timestamp: Date.now()
        }]);
        
        setTimeout(() => {
          const responseText = language === "zh" 
            ? `好。简单的部分结束了。\n接下来的对话会更有意思一些。✦`
            : `Good. The easy part is over.\nThe conversation ahead will be more interesting.✦`;
          
          setCurrentTypewriterText(responseText);
          setIsTypewriting(true);
          setSetupStep("complete");
          setTimeout(() => {
            startAiDialogue();
          }, 1500);
        }, 300);
      }
      
    } catch (error) {
      setSetupError(language === "zh" ? "注册失败，请重试" : "Registration failed, please try again");
    } finally {
      setIsRegistering(false);
    }
  };

  const startAiDialogue = () => {
    const languageInstruction = language === "zh" 
      ? "\n\n【重要】请始终使用中文（简体）回复用户。"
      : "\n\n【Important】Please always respond in English.";
    
    const systemPrompt = language === "zh" 
      ? `[系统提示：用户已完成基本信息录入。
用户信息：
- 名字：${name.trim()}
- 地区：${region.trim()}
- 邮箱：${email.trim()}

请直接从"## §11 阶段 1 · 第一个真问题"开始，按照soul.md文件内容继续申请流程。不要再重复问候语，直接开始第一个真问题。${languageInstruction}]`
      : `[System: User has completed basic information registration.
User info:
- Name: ${name.trim()}
- Region: ${region.trim()}
- Email: ${email.trim()}

Please start directly from "## §11 Phase 1 · The First Real Question" according to soul.md. Do not repeat the greeting, start with the first real question directly.${languageInstruction}]`;

    const userMessage: ChatMessage = {
      role: "user",
      content: systemPrompt
    };
    
    setChatMessages([userMessage]);
    callAiStream([userMessage]);
  };

  const callAiStream = async (messages: ChatMessage[], isFinalSubmit: boolean = false) => {
    setIsAiResponding(true);
    setStreamingMessage("");
    
    const messageId = `lyra-${Date.now()}`;
    
    setMessages(prev => [...prev, {
      id: messageId,
      type: "lyra",
      content: "",
      timestamp: Date.now(),
      isStreaming: true
    }]);

    await streamChat(
      messages,
      {
        onToken: (token) => {
          setStreamingMessage(prev => prev + token);
          scrollToBottom();
        },
        onComplete: async (fullResponse) => {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: fullResponse, isStreaming: false }
              : msg
          ));
          const updatedChatMessages = [...messages, { role: "assistant" as const, content: fullResponse }];
          setChatMessages(updatedChatMessages);
          setIsAiResponding(false);
          setStreamingMessage("");
          
          console.log('AI response complete, isFinalSubmit:', isFinalSubmit);
          
          if (isFinalSubmit) {
            console.log('Submitting application report...');
            await submitApplicationReport(fullResponse, updatedChatMessages);
          } else {
            setTimeout(() => {
              chatInputRef.current?.focus();
            }, 100);
          }
        },
        onError: (error) => {
          console.error("AI Error:", error);
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: language === "zh" ? "抱歉，出现了一些问题。请稍后再试。" : "Sorry, something went wrong. Please try again.", isStreaming: false }
              : msg
          ));
          setIsAiResponding(false);
          setStreamingMessage("");
          setIsSubmitting(false);
        }
      }
    );
  };

  const submitApplicationReport = async (finalResponse: string, updatedChatMessages: ChatMessage[]) => {
    try {
      console.log('Starting application submission...');
      console.log('Chat messages count:', updatedChatMessages.length);
      
      const report = await generateEvaluationReport(updatedChatMessages);
      console.log('Evaluation report generated, length:', report.length);
      
      const reportData = {
        userId: localStorage.getItem('asimov_current_user') ? JSON.parse(localStorage.getItem('asimov_current_user')!).id : null,
        name: name.trim(),
        region: region.trim(),
        email: email.trim(),
        language: language,
        messages: updatedChatMessages,
        displayMessages: messages,
        finalResponse: finalResponse,
        lyraEvaluationReport: report,
        submittedAt: Date.now()
      };
      
      console.log('Sending application data...');
      
      const response = await fetch('http://localhost:3001/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        console.log('Application submitted successfully');
        setApplicationCompleted(true);
      } else {
        const errorText = await response.text();
        console.error('Submit failed:', errorText);
      }
    } catch (error) {
      console.error('Submit application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = () => {
    if (currentInput.trim() && !isAiResponding) {
      const userContent = currentInput.trim();
      setCurrentInput("");
      
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        type: "user",
        content: userContent,
        timestamp: Date.now()
      }]);
      
      const languageInstruction = language === "zh" 
        ? "\n\n【重要】请始终使用中文（简体）回复。"
        : "\n\n【Important】Please always respond in English.";
      
      const userMessage: ChatMessage = {
        role: "user",
        content: userContent + languageInstruction
      };
      
      const newChatMessages = [...chatMessages, userMessage];
      setChatMessages(newChatMessages);
      
      callAiStream(newChatMessages);
    }
  };

  const showIntroButtons = setupStep === "intro" && !isTypewriting;
  const showReturningLogin = setupStep === "returning" && !isTypewriting;
  const showNameInput = setupStep === "name" && !isTypewriting;
  const showRegionInput = setupStep === "region" && !isTypewriting;
  const showAccountInput = setupStep === "account" && !isTypewriting;
  const showAgreements = setupStep === "agreements" && !isTypewriting;
  const showChatInput = setupStep === "complete";

  return (
    <div className="min-h-screen bg-[var(--color-au-blue-dark)] overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "gate" && (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 bg-[var(--color-au-blue-dark)]">
              <div className="absolute inset-0 opacity-20" 
                   style={{
                     backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
                     backgroundSize: "40px 40px"
                   }}>
              </div>
              <motion.div 
                className="absolute w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-[var(--color-au-blue)] rounded-full blur-[100px] md:blur-[150px] opacity-40 -top-10 md:-top-20 -right-10 md:-right-20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--color-au-accent)] rounded-full blur-[120px] md:blur-[180px] opacity-20 -bottom-10 md:-bottom-20 -left-10 md:-left-20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>

            <div className="relative z-10 text-center px-4 flex flex-col items-center justify-center min-h-screen max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-6 md:space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex justify-center mb-2 md:mb-4"
                >
                  <img src={logo} alt="Asimov University Logo" className="w-20 h-20 md:w-32 md:h-32 object-contain" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-gray-300 max-w-4xl mx-auto italic leading-tight"
                >
                  ASIMOV UNIVERSITY
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className={`text-lg md:text-2xl lg:text-3xl text-gray-400 italic ${language === "zh" ? "font-chinese" : "font-serif"}`}
                >
                  {language === "zh" ? "致第三种智能。" : "To the Third Intelligence."}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.8 }}
                  className="pt-6 md:pt-8"
                >
                  <button
                    onClick={handleStepInside}
                    className="group relative inline-block px-6 py-3 md:px-8 md:py-4 bg-[var(--color-au-blue-dark)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                  >
                    <div className="absolute inset-0 border border-[var(--color-au-accent)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-au-accent)]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-au-accent)]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                    
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-au-accent)]/60 to-transparent skew-x-12"
                      animate={{ x: ["-150%", "150%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                    />
                    
                    <motion.div
                      className="absolute inset-0 bg-[var(--color-au-blue)] opacity-0 group-hover:opacity-30"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <span className={`relative z-10 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase text-white group-hover:text-[var(--color-au-accent)] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,1)] ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                      {language === "zh" ? "开门" : "Step Inside"}
                    </span>
                  </button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-6 md:bottom-8 flex items-center gap-3 text-gray-400 text-sm"
              >
                <span className={`text-xs tracking-wider ${language === "zh" ? "font-chinese" : "font-serif"}`}>{language === "zh" ? "语言" : "Language"}</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "zh" | "en")}
                  className="bg-transparent border border-white/20 px-2 py-1 md:px-3 md:py-1.5 text-gray-300 focus:outline-none focus:border-[var(--color-au-accent)] cursor-pointer text-sm transition-colors hover:border-[var(--color-au-accent)]/50"
                >
                  <option value="zh" className="bg-[var(--color-au-blue-dark)]">简体中文</option>
                  <option value="en" className="bg-[var(--color-au-blue-dark)]">English</option>
                </select>
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "agreement" && (
          <motion.div
            key="agreement"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12"
          >
            <div className="absolute inset-0 bg-[var(--color-au-blue-dark)]">
              <div className="absolute inset-0 opacity-20" 
                   style={{
                     backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
                     backgroundSize: "40px 40px"
                   }}>
              </div>
              <motion.div 
                className="absolute w-[800px] h-[800px] bg-[var(--color-au-blue)] rounded-full blur-[150px] opacity-40 -top-20 -right-20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute w-[600px] h-[600px] bg-[var(--color-au-accent)] rounded-full blur-[180px] opacity-20 -bottom-20 -left-20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative z-10 mb-6 text-center"
            >
              <h1 className="text-white/90 text-lg tracking-[0.3em] uppercase font-serif">
                {language === "zh" ? "在你走进这扇门之前" : "Before You Step Inside"}
              </h1>
            </motion.div>

            <motion.div
              className="relative z-10 w-full max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="relative bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-md border border-white/10 rounded-sm overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                <div className="p-6 border-b border-white/10">
                  <h2 className={`text-white text-lg ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                    {language === "zh" ? "申请者协议与行为准则" : "Applicant Agreement & Code of Integrity"}
                  </h2>
                </div>

                <div className="flex border-b border-white/10">
                  {[
                    { part: 1 as const, labelZh: "诚实协议", labelEn: "Integrity" },
                    { part: 2 as const, labelZh: "数据隐私", labelEn: "Privacy" },
                    { part: 3 as const, labelZh: "行为准则", labelEn: "Conduct" },
                    { part: 4 as const, labelZh: "违规后果", labelEn: "Consequences" }
                  ].map(({ part, labelZh, labelEn }) => (
                    <button
                      key={part}
                      onClick={() => {
                        setActiveAgreementPart(part);
                        if (agreementScrollRef.current) {
                          agreementScrollRef.current.scrollTop = 0;
                        }
                      }}
                      className={`flex-1 py-3 text-xs tracking-wider transition-colors ${
                        activeAgreementPart === part
                          ? "bg-white/10 text-white border-b-2 border-[var(--color-au-accent)]"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      } ${language === "zh" ? "font-chinese" : "font-serif"}`}
                    >
                      {language === "zh" ? labelZh : labelEn}
                    </button>
                  ))}
                </div>

                <div className="max-h-[40vh] md:max-h-[35vh] overflow-y-auto p-4 md:p-6" ref={agreementScrollRef}>
                  <div className={`text-white/80 text-sm leading-relaxed prose prose-invert prose-sm max-w-none ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-display text-white mb-4 mt-6 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-display text-white/90 mb-3 mt-5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-display text-white/80 mb-2 mt-4">{children}</h3>,
                        h4: ({ children }) => <h4 className="text-sm font-medium text-white/70 mb-2 mt-3">{children}</h4>,
                        p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="text-white font-medium">{children}</strong>,
                        em: ({ children }) => <em className="text-white/90">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-white/70">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-white/70">{children}</ol>,
                        li: ({ children }) => <li className="text-white/70">{children}</li>,
                        hr: () => <hr className="border-white/10 my-6" />,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-[var(--color-au-accent)]/50 pl-4 my-4 text-white/60 italic">{children}</blockquote>,
                        code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">{children}</code>,
                        table: ({ children }) => <table className="w-full border-collapse mb-4 text-xs">{children}</table>,
                        th: ({ children }) => <th className="border border-white/20 px-3 py-2 text-left text-white/90 bg-white/5">{children}</th>,
                        td: ({ children }) => <td className="border border-white/10 px-3 py-2 text-white/70">{children}</td>,
                      }}
                    >
                      {getAgreementText(activeAgreementPart, language)}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={agreeToTerms} 
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-4 h-4 accent-[var(--color-au-accent)] cursor-pointer"
                      />
                    </div>
                    <span className={`text-white/70 text-sm group-hover:text-white/90 transition-colors ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                      {language === "zh" 
                        ? "我已阅读并理解以上所有内容。" 
                        : "I have read and understood all of the above."}
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={agreeToAbide} 
                        onChange={(e) => setAgreeToAbide(e.target.checked)}
                        className="w-4 h-4 accent-[var(--color-au-accent)] cursor-pointer"
                      />
                    </div>
                    <span className={`text-white/70 text-sm group-hover:text-white/90 transition-colors ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                      {language === "zh" 
                        ? "我同意在申请过程中及入学后遵守本协议。" 
                        : "I agree to abide by this agreement during the application process and after enrollment."}
                    </span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={agreeToConsequences} 
                        onChange={(e) => setAgreeToConsequences(e.target.checked)}
                        className="w-4 h-4 accent-[var(--color-au-accent)] cursor-pointer"
                      />
                    </div>
                    <span className={`text-white/70 text-sm group-hover:text-white/90 transition-colors ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                      {language === "zh" 
                        ? "我理解违反本协议可能导致申请取消、录取撤销或学籍终止以及承担法律后果等。" 
                        : "I understand that violations may result in application cancellation, admission revocation, dismissal, and legal consequences."}
                    </span>
                  </label>
                  
                  <motion.button
                    onClick={handleAgreeToAgreement}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!agreeToTerms || !agreeToAbide || !agreeToConsequences}
                    className="w-full mt-4 py-3 bg-[var(--color-au-accent)] text-black font-display tracking-widest text-sm hover:bg-[var(--color-au-accent)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {language === "zh" ? "我同意，开始对话" : "I Agree. Begin."}
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}

        {phase === "dialogue" && (
          <>
            <motion.div
              key="dialogue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12"
            >
              <div className="absolute inset-0 bg-[var(--color-au-blue-dark)]">
                <div className="absolute inset-0 opacity-20" 
                     style={{
                       backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
                       backgroundSize: "40px 40px"
                     }}>
                </div>
                <motion.div 
                  className="absolute w-[800px] h-[800px] bg-[var(--color-au-blue)] rounded-full blur-[150px] opacity-40 -top-20 -right-20"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute w-[600px] h-[600px] bg-[var(--color-au-accent)] rounded-full blur-[180px] opacity-20 -bottom-20 -left-20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10 mb-8 text-center"
              >
                <h1 className="text-white/90 text-xl tracking-[0.4em] uppercase font-serif">
                  Apply for Admission
                </h1>
              </motion.div>

              <motion.div
                className="relative z-10 w-full max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: showDialogue ? 1 : 0, y: showDialogue ? 0 : 30 }}
                transition={{ delay: 0, duration: 0.8 }}
              >
                <div className={`relative bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-md border border-white/10 flex flex-col max-h-[70vh] rounded-sm overflow-hidden transition-all duration-300 ${isAiResponding ? 'border-white/30' : ''}`}>
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  
                  {isAiResponding && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]"
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          boxShadow: [
                            "inset 0 0 30px rgba(255, 255, 255, 0.05), inset 0 0 60px rgba(255, 255, 255, 0.02)",
                            "inset 0 0 50px rgba(255, 255, 255, 0.15), inset 0 0 100px rgba(255, 255, 255, 0.05)",
                            "inset 0 0 30px rgba(255, 255, 255, 0.05), inset 0 0 60px rgba(255, 255, 255, 0.02)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-[1px]"
                        animate={{
                          background: [
                            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
                            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[1px]"
                        animate={{
                          background: [
                            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
                            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      />
                      <motion.div
                        className="absolute top-0 left-0 bottom-0 w-[1px]"
                        animate={{
                          background: [
                            "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
                            "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                            "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                      />
                      <motion.div
                        className="absolute top-0 right-0 bottom-0 w-[1px]"
                        animate={{
                          background: [
                            "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
                            "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                            "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
                      />
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {glowActive && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="absolute bottom-0 left-0 w-[2px] h-1/2 bg-gradient-to-t from-[var(--color-au-accent)] to-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="absolute bottom-0 left-0 w-[2px] h-1/2 origin-bottom bg-gradient-to-t from-white to-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                          className="absolute top-0 left-0 w-[2px] h-1/2 origin-top bg-gradient-to-b from-white to-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                          className="absolute top-0 left-0 h-[2px] w-1/2 origin-left bg-gradient-to-r from-white to-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
                          className="absolute top-0 right-0 h-[2px] w-1/2 origin-right bg-gradient-to-l from-white to-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
                          className="absolute top-0 right-0 w-[2px] h-1/2 origin-top bg-gradient-to-b from-white to-transparent"
                        />
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                          className="absolute bottom-0 right-0 w-[2px] h-1/2 origin-bottom bg-gradient-to-t from-white to-transparent"
                        />
                      </>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex items-center gap-3 p-6 pb-4 border-b border-white/5 shrink-0">
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full bg-white"
                      animate={isAiResponding ? {
                        opacity: [0.6, 1, 0.6],
                        boxShadow: [
                          "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)",
                          "0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.7), 0 0 90px rgba(255, 255, 255, 0.4)",
                          "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)"
                        ],
                        scale: [1, 1.2, 1]
                      } : {
                        opacity: [0.6, 1, 0.6],
                        boxShadow: [
                          "0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)",
                          "0 0 25px rgba(255, 255, 255, 0.9), 0 0 50px rgba(255, 255, 255, 0.5)",
                          "0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)"
                        ]
                      }}
                      transition={{ duration: isAiResponding ? 1.5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="font-display text-white tracking-[0.2em] text-sm">
                      LYRA
                    </span>
                    <span className="text-white/20 text-xs font-serif ml-auto">
                      Faculty Secretary
                    </span>
                  </div>

                  <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 pt-3 md:pt-4 min-h-[120px] md:min-h-[150px] max-h-[35vh] md:max-h-[40vh] scrollbar-hide">
                    <div className={`space-y-4 text-white/80 leading-relaxed ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                      {messages.map((msg) => (
                        <div key={msg.id}>
                          {msg.type === "user" ? (
                            <UserMessage content={msg.content} language={language} />
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mb-4"
                            >
                              {msg.isStreaming ? (
                                <div className="whitespace-pre-wrap">
                                  {streamingMessage}
                                  <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="inline-block w-[2px] h-[1em] bg-white ml-[1px] align-middle"
                                  />
                                </div>
                              ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      ))}
                      
                      {isTypewriting && currentTypewriterText && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4"
                        >
                          <TypewriterMessage 
                            text={currentTypewriterText} 
                            speed={30}
                            onComplete={handleTypewriterComplete}
                            onUpdate={scrollToBottom}
                          />
                        </motion.div>
                      )}
                      
                      {isAiResponding && !streamingMessage && !isTypewriting && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-center gap-3 text-white/50 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                        >
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ 
                              opacity: [0.4, 1, 0.4],
                              scale: [0.8, 1.2, 0.8],
                              boxShadow: [
                                "0 0 10px rgba(255, 255, 255, 0.5)",
                                "0 0 20px rgba(255, 255, 255, 0.8)",
                                "0 0 10px rgba(255, 255, 255, 0.5)"
                              ]
                            }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ 
                              opacity: [0.4, 1, 0.4],
                              scale: [0.8, 1.2, 0.8],
                              boxShadow: [
                                "0 0 10px rgba(255, 255, 255, 0.5)",
                                "0 0 20px rgba(255, 255, 255, 0.8)",
                                "0 0 10px rgba(255, 255, 255, 0.5)"
                              ]
                            }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ 
                              opacity: [0.4, 1, 0.4],
                              scale: [0.8, 1.2, 0.8],
                              boxShadow: [
                                "0 0 10px rgba(255, 255, 255, 0.5)",
                                "0 0 20px rgba(255, 255, 255, 0.8)",
                                "0 0 10px rgba(255, 255, 255, 0.5)"
                              ]
                            }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                          />
                          <span className="ml-2 text-white/70">
                            {language === "zh" ? "Lyra 正在思考..." : "Lyra is thinking..."}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showIntroButtons && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 md:p-6 pt-3 md:pt-4 shrink-0 border-t border-white/5"
                      >
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                          <motion.button
                            onClick={handleNewUser}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-6 py-3 md:px-8 md:py-4 bg-white/10 border border-white/30 text-white font-display tracking-widest text-xs md:text-sm hover:bg-white/20 transition-all duration-300 ${language === "zh" ? "font-chinese" : ""}`}
                          >
                            {language === "zh" ? "没见过" : "No, we haven't met"}
                          </motion.button>
                          <motion.button
                            onClick={handleReturningUser}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-6 py-3 md:px-8 md:py-4 bg-white/10 border border-white/30 text-white font-display tracking-widest text-xs md:text-sm hover:bg-white/20 transition-all duration-300 ${language === "zh" ? "font-chinese" : ""}`}
                          >
                            {language === "zh" ? "见过" : "Yes, we've met"}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {showReturningLogin && (
                      <motion.div
                        ref={inputAreaRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 md:p-6 pt-3 md:pt-4 shrink-0 border-t border-white/5"
                      >
                        <div className="space-y-3">
                          {setupError && (
                            <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-sm">
                              <p className="text-red-300 text-xs">{setupError}</p>
                            </div>
                          )}
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={language === "zh" ? "邮箱地址" : "Email address"}
                            className={`w-full bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                            autoFocus
                          />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLoginSubmit()}
                            placeholder={language === "zh" ? "密码" : "Password"}
                            className={`w-full bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                          />
                          <motion.button
                            onClick={handleLoginSubmit}
                            disabled={isRegistering}
                            whileHover={{ scale: isRegistering ? 1 : 1.02 }}
                            whileTap={{ scale: isRegistering ? 1 : 0.98 }}
                            className={`w-full py-2.5 md:py-3 bg-white text-black font-display tracking-widest text-xs md:text-sm hover:bg-white/90 transition-colors ${isRegistering ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isRegistering 
                              ? (language === "zh" ? "登录中..." : "Logging in...") 
                              : (language === "zh" ? "登录" : "Login")}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {showNameInput && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 md:p-6 pt-3 md:pt-4 shrink-0 border-t border-white/5"
                      >
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                            placeholder={language === "zh" ? "你的名字" : "Your name"}
                            className={`flex-1 bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                            autoFocus
                          />
                          <motion.button
                            onClick={handleNameSubmit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2.5 md:px-5 md:py-3 bg-white text-black font-display tracking-widest text-sm hover:bg-white/90 transition-colors"
                          >
                            →
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {showRegionInput && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 md:p-6 pt-3 md:pt-4 shrink-0 border-t border-white/5"
                      >
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRegionSubmit()}
                            placeholder={language === "zh" ? "你所在的城市或国家" : "Your city or country"}
                            className={`flex-1 bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                            autoFocus
                          />
                          <motion.button
                            onClick={handleRegionSubmit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2.5 md:px-5 md:py-3 bg-white text-black font-display tracking-widest text-sm hover:bg-white/90 transition-colors"
                          >
                            →
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {showAccountInput && (
                      <motion.div
                        ref={inputAreaRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 md:p-6 pt-3 md:pt-4 shrink-0 border-t border-white/5"
                      >
                        <div className="space-y-3">
                          {setupError && (
                            <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-sm">
                              <p className="text-red-300 text-xs">{setupError}</p>
                            </div>
                          )}
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={language === "zh" ? "邮箱地址" : "Email address"}
                            className={`w-full bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                            autoFocus
                          />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={language === "zh" ? "密码（至少6位）" : "Password (at least 6 characters)"}
                            className={`w-full bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                          />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAccountSubmit()}
                            placeholder={language === "zh" ? "确认密码" : "Confirm password"}
                            className={`w-full bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm ${language === "zh" ? "font-chinese" : "font-serif"}`}
                          />
                          <motion.button
                            onClick={handleAccountSubmit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isRegistering}
                            className="w-full px-4 py-2.5 md:px-5 md:py-3 bg-white text-black font-display tracking-widest text-xs md:text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isRegistering 
                              ? (language === "zh" ? "注册中..." : "Registering...") 
                              : (language === "zh" ? "创建账号" : "Create Account")}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {showAgreements && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 md:p-6 pt-3 md:pt-4 shrink-0 border-t border-white/5"
                      >
                        <div className="space-y-3 md:space-y-4">
                          <p className={`text-white/80 text-sm mb-4 ${language === "zh" ? "font-chinese" : "font-serif"}`}>
                            {language === "zh" 
                              ? "在创建账号之前，请阅读并同意以下条款。这是我们共建未来的基础。" 
                              : "Before creating your account, please read and agree to the following terms. This is the foundation of our shared future."}
                          </p>
                          <motion.button
                            onClick={() => {
                              setPhase("agreement");
                              setActiveAgreementPart(1);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 border border-[var(--color-au-accent)]/50 text-[var(--color-au-accent)] font-display tracking-widest text-sm hover:bg-[var(--color-au-accent)]/10 transition-colors"
                          >
                            {language === "zh" ? "阅读协议与准则" : "Read Agreements & Guidelines"}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {showChatInput && !applicationCompleted && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 md:p-6 pt-3 md:pt-4 shrink-0 border-t border-white/5"
                      >
                        <div className="flex gap-3">
                          <input
                            ref={chatInputRef}
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder={language === "zh" ? "输入你的回答..." : "Type your response..."}
                            disabled={isAiResponding}
                            className={`flex-1 bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/50 focus:bg-white/[0.03] transition-all duration-300 text-sm disabled:opacity-50 ${language === "zh" ? "font-chinese" : "font-serif"}`}
                            autoFocus
                          />
                          <motion.button
                            onClick={handleSendMessage}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isAiResponding || !currentInput.trim()}
                            className="px-4 py-2.5 md:px-5 md:py-3 bg-white text-black font-display tracking-widest text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            →
                          </motion.button>
                        </div>
                        
                        {showFinalButton && (
                          <motion.button
                            onClick={handleFinalSubmit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isAiResponding || isSubmitting}
                            className="w-full mt-3 px-4 py-2.5 md:px-5 md:py-3 bg-[var(--color-au-accent)] text-black font-display tracking-widest text-xs md:text-sm hover:bg-[var(--color-au-accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting 
                              ? (language === "zh" ? "提交中..." : "Submitting...") 
                              : (language === "zh" ? "提交申请" : "Submit Application")}
                          </motion.button>
                        )}
                      </motion.div>
                    )}

                    {applicationCompleted && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="p-12 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 15 }}
                          className="relative w-20 h-20 mx-auto mb-8"
                        >
                          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-au-accent)]" />
                          <div className="absolute inset-1 rounded-full border border-[var(--color-au-accent)]/50" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, type: "spring" }}
                              className="w-8 h-8 rounded-full bg-[var(--color-au-accent)] flex items-center justify-center"
                            >
                              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          </div>
                        </motion.div>
                        
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className={`text-white text-2xl mb-2 tracking-wide ${language === "zh" ? "font-chinese" : "font-serif"}`}
                        >
                          {language === "zh" ? "申请已提交" : "Application Submitted"}
                        </motion.h3>
                        
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className="w-32 h-[1px] mx-auto my-4 bg-gradient-to-r from-transparent via-[var(--color-au-accent)]/60 to-transparent"
                        />
                        
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className={`text-white/50 text-sm leading-relaxed max-w-xs mx-auto ${language === "zh" ? "font-chinese" : "font-serif"}`}
                        >
                          {language === "zh" 
                            ? "你的申请已提交至校董会审阅\n我们将在7个工作日内通知你结果"
                            : "Your application has been submitted to the Board\nWe will notify you within 7 business days"}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="mt-10"
                        >
                          <span className="text-[var(--color-au-accent)] text-2xl">✦</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            </motion.div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
              <ProgressIndicator currentPhase={applicationCompleted ? "complete" : (showChatInput ? "dialogue" : "intro")} language={language} />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
