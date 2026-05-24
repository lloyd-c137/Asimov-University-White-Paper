import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/newlogo.png";
import EmailInbox from "../components/EmailInbox";

const API_URL = "http://localhost:3001/api";
const ADMIN_CREDENTIALS = { username: "asimov2025", password: "asimov2025" };

interface User {
  id: string;
  name: string;
  region: string;
  email: string;
  created_at: number;
  status: string;
  hasApplication?: boolean;
}

interface Application {
  id: string;
  userId: string;
  name: string;
  region: string;
  email: string;
  language: string;
  messages: Array<{ role: string; content: string }>;
  displayMessages: Array<{ id: string; type: string; content: string; timestamp: number }>;
  finalResponse: string;
  lyraEvaluationReport: string;
  status: string;
  submittedAt: number;
  reviewedAt: number;
  reviewerNotes: string;
}

type Language = "en" | "zh";

const translations = {
  en: {
    adminPortal: "Admin Portal",
    username: "Username",
    password: "Password",
    signIn: "Sign In",
    invalidCredentials: "Invalid username or password",
    applicantManagement: "Applicant Management",
    applicationReview: "Application Review",
    manageAndReview: "Manage and review all applicant information",
    totalApplicants: "Total Applicants",
    totalApplications: "Total Applications",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    conditional: "Conditional",
    name: "Name",
    region: "Region",
    email: "Email",
    applicationTime: "Application Time",
    submittedTime: "Submitted Time",
    status: "Status",
    actions: "Actions",
    loading: "Loading...",
    noData: "No applicant data",
    noDataDesc: "When users submit applications, data will appear here",
    noApplications: "No applications yet",
    noApplicationsDesc: "When applicants submit their final application, it will appear here",
    refresh: "Refresh",
    signOut: "Sign Out",
    confirm: "Confirm",
    cancel: "Cancel",
    delete: "Delete",
    deleteThisUser: "Delete This User",
    close: "Close",
    settings: "Settings",
    language: "Language",
    english: "English",
    chinese: "中文",
    pendingStatus: "Pending",
    approvedStatus: "Approved",
    rejectedStatus: "Rejected",
    conditionalStatus: "Conditional",
    notApplied: "Not Applied",
    registered: "Registered",
    viewDetails: "View Details",
    reviewApplication: "Review Application",
    conversationHistory: "Conversation History",
    reviewerNotes: "Reviewer Notes",
    addNotes: "Add notes for this application...",
    saveNotes: "Save Notes",
    approve: "Approve",
    reject: "Reject",
    conditionalApprove: "Conditional",
    markPending: "Set Pending",
    languageLabel: "Language",
    submittedAt: "Submitted",
    reviewedAt: "Reviewed",
    notReviewed: "Not reviewed yet",
    dashboard: "Dashboard",
    overview: "Overview",
    recentApplications: "Recent Applications",
    quickStats: "Quick Stats",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    sendAdmissionEmail: "Send Admission Email",
    emailSent: "Email sent successfully",
    emailFailed: "Failed to send email",
    admissionSubject: "Admission Decision - Asimov University",
    admissionBody: "Dear {name},\n\nWe are pleased to inform you that your application to Asimov University has been approved.\n\nWelcome to our academic community. Further instructions will follow.\n\nBest regards,\nAsimov University Admissions",
    rejectionSubject: "Application Update - Asimov University",
    rejectionBody: "Dear {name},\n\nThank you for your interest in Asimov University. After careful consideration, we regret to inform you that we are unable to offer you admission at this time.\n\nWe appreciate your interest and wish you success in your future endeavors.\n\nBest regards,\nAsimov University Admissions",
    mailbox: "Mailbox",
    openMailbox: "Open Mailbox",
    enableLogging: "Enable Logging",
    disableLogging: "Disable Logging",
    loggingEnabled: "Logging Enabled",
    loggingDisabled: "Logging Disabled",
    logs: "Activity Logs",
    action: "Action",
    target: "Target",
    time: "Time",
    noLogs: "No logs recorded",
    emailTemplates: "Email Templates",
    addTemplate: "Add Template",
    editTemplate: "Edit Template",
    templateName: "Template Name",
    templateCategory: "Template Category",
    templateSubject: "Email Subject",
    templateBody: "Email Body",
    admission: "Admission",
    rejection: "Rejection",
    custom: "Custom",
    saveTemplate: "Save Template",
    deleteTemplate: "Delete Template",
    selectTemplate: "Select Template",
  },
  zh: {
    adminPortal: "管理后台",
    username: "用户名",
    password: "密码",
    signIn: "登录",
    invalidCredentials: "用户名或密码错误",
    applicantManagement: "申请人管理",
    applicationReview: "申请审核",
    manageAndReview: "管理和审核所有申请人信息",
    totalApplicants: "总申请人数",
    totalApplications: "总申请数",
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
    conditional: "条件录取",
    name: "姓名",
    region: "地区",
    email: "邮箱",
    applicationTime: "申请时间",
    submittedTime: "提交时间",
    status: "状态",
    actions: "操作",
    loading: "加载中...",
    noData: "暂无申请人数据",
    noDataDesc: "当有用户提交申请时，数据将显示在这里",
    noApplications: "暂无申请",
    noApplicationsDesc: "当申请人提交最终申请时，数据将显示在这里",
    refresh: "刷新",
    signOut: "退出登录",
    confirm: "确认",
    cancel: "取消",
    delete: "删除",
    deleteThisUser: "删除此用户",
    close: "关闭",
    settings: "设置",
    language: "语言",
    english: "English",
    chinese: "中文",
    pendingStatus: "待审核",
    approvedStatus: "已通过",
    rejectedStatus: "已拒绝",
    conditionalStatus: "条件录取",
    notApplied: "未申请",
    registered: "已注册",
    viewDetails: "查看详情",
    reviewApplication: "审核申请",
    conversationHistory: "对话记录",
    reviewerNotes: "审核备注",
    addNotes: "添加审核备注...",
    saveNotes: "保存备注",
    approve: "通过",
    reject: "拒绝",
    conditionalApprove: "条件录取",
    markPending: "设为待审",
    languageLabel: "语言",
    submittedAt: "提交时间",
    reviewedAt: "审核时间",
    notReviewed: "尚未审核",
    dashboard: "仪表盘",
    overview: "概览",
    recentApplications: "最近申请",
    quickStats: "快速统计",
    today: "今日",
    thisWeek: "本周",
    thisMonth: "本月",
    sendAdmissionEmail: "发送录取邮件",
    emailSent: "邮件发送成功",
    emailFailed: "邮件发送失败",
    admissionSubject: "录取通知 - Asimov University",
    admissionBody: "亲爱的 {name}，\n\n很高兴通知您，您向 Asimov University 提交的申请已获批准。\n\n欢迎加入我们的学术社区。后续指引将另行通知。\n\n此致\nAsimov University 招生办公室",
    rejectionSubject: "申请结果通知 - Asimov University",
    rejectionBody: "亲爱的 {name}，\n\n感谢您对 Asimov University 的关注。经过慎重考虑，我们很遗憾地通知您，我们目前无法为您提供入学资格。\n\n感谢您的申请，祝您未来一切顺利。\n\n此致\nAsimov University 招生办公室",
    mailbox: "邮箱系统",
    openMailbox: "打开邮箱",
    enableLogging: "启用日志",
    disableLogging: "关闭日志",
    loggingEnabled: "日志已启用",
    loggingDisabled: "日志已关闭",
    logs: "操作日志",
    action: "操作",
    target: "目标",
    time: "时间",
    noLogs: "暂无日志记录",
    emailTemplates: "邮件模板",
    addTemplate: "添加模板",
    editTemplate: "编辑模板",
    templateName: "模板名称",
    templateCategory: "模板分类",
    templateSubject: "邮件主题",
    templateBody: "邮件内容",
    admission: "录取通知",
    rejection: "拒绝通知",
    custom: "自定义",
    saveTemplate: "保存模板",
    deleteTemplate: "删除模板",
    selectTemplate: "选择模板",
  }
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteApplicationConfirm, setDeleteApplicationConfirm] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [appStats, setAppStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, conditional: 0 });
  const [language, setLanguage] = useState<Language>("en");
  const [showSettings, setShowSettings] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [activeSection, setActiveSection] = useState<"dashboard" | "applications" | "users" | "logs" | "templates" | "email">("dashboard");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: string; message: string } | null>(null);
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [logs, setLogs] = useState<Array<{ id: string; action: string; details: string; userEmail: string; targetId: string; targetType: string; createdAt: number }>>([]);
  const [emailTemplates, setEmailTemplates] = useState<Array<{ id: string; name: string; category: string; subject: string; body: string; isActive: boolean }>>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{ id?: string; name: string; category: string; subject: string; body: string; isActive: boolean } | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    const savedLang = sessionStorage.getItem("adminLang") as Language;
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchUsers();
      fetchApplications();
    }
    if (savedLang && (savedLang === "en" || savedLang === "zh")) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    sessionStorage.setItem("adminLang", lang);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      fetchUsers();
      fetchApplications();
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setUsername("");
    setPassword("");
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/users`);
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
        const total = data.users.length;
        const pending = data.users.filter((u: User) => u.status === 'pending').length;
        const approved = data.users.filter((u: User) => u.status === 'approved').length;
        const rejected = data.users.filter((u: User) => u.status === 'rejected').length;
        setStats({ total, pending, approved, rejected });
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/applications`);
      const data = await response.json();
      if (data.applications) {
        setApplications(data.applications);
        const total = data.applications.length;
        const pending = data.applications.filter((a: Application) => a.status === 'pending').length;
        const approved = data.applications.filter((a: Application) => a.status === 'approved').length;
        const rejected = data.applications.filter((a: Application) => a.status === 'rejected').length;
        const conditional = data.applications.filter((a: Application) => a.status === 'conditional').length;
        setAppStats({ total, pending, approved, rejected, conditional });
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const fetchApplicationDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/applications/${id}`);
      const data = await response.json();
      if (data.application) {
        setSelectedApplication(data.application);
        setReviewerNotes(data.application.reviewerNotes || "");
      }
    } catch (error) {
      console.error("Failed to fetch application details:", error);
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewerNotes }),
      });
      const data = await response.json();
      if (data.success) {
        fetchApplications();
        if (selectedApplication) {
          setSelectedApplication({ ...selectedApplication, status, reviewerNotes });
        }
        if (loggingEnabled) {
          await logAction('update_status', `Updated application status to ${status}`, id, 'application');
        }
      }
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const saveReviewerNotes = async () => {
    if (!selectedApplication) return;
    setSavingNotes(true);
    try {
      const response = await fetch(`${API_URL}/admin/applications/${selectedApplication.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedApplication.status, reviewerNotes }),
      });
      const data = await response.json();
      if (data.success) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((u) => u.id !== userId));
        setDeleteConfirm(null);
        setSelectedUser(null);
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }));
        if (loggingEnabled) {
          await logAction('delete_user', `Deleted user ${userId}`, userId, 'user');
        }
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/applications/${applicationId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setApplications(applications.filter((a) => a.id !== applicationId));
        setSelectedApplication(null);
        setAppStats(prev => ({
          ...prev,
          total: prev.total - 1
        }));
        if (loggingEnabled) {
          await logAction('delete_application', `Deleted application ${applicationId}`, applicationId, 'application');
        }
      }
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  const logAction = async (action: string, details: string, targetId?: string, targetType?: string) => {
    if (!loggingEnabled) return;
    try {
      await fetch(`${API_URL}/admin/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, details, targetId, targetType })
      });
    } catch (error) {
      console.error("Failed to log action:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/logs`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/email-templates`);
      const data = await response.json();
      setEmailTemplates(data.templates || []);
    } catch (error) {
      console.error("Failed to fetch email templates:", error);
    }
  };

  const handleSaveTemplate = async (template: { name: string; category: string; subject: string; body: string; isActive: boolean }) => {
    try {
      const url = editingTemplate?.id ? `${API_URL}/email-templates/${editingTemplate.id}` : `${API_URL}/email-templates`;
      const method = editingTemplate?.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template)
      });
      
      if (response.ok) {
        await fetchEmailTemplates();
        setShowTemplateModal(false);
        setEditingTemplate(null);
        if (loggingEnabled) {
          await logAction(editingTemplate?.id ? 'update_template' : 'create_template', `${editingTemplate?.id ? 'Updated' : 'Created'} email template: ${template.name}`, template.name, 'template');
        }
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`${API_URL}/email-templates/${templateId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        await fetchEmailTemplates();
        if (loggingEnabled) {
          await logAction('delete_template', `Deleted email template ${templateId}`, templateId, 'template');
        }
      }
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(language === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string, hasApplication?: boolean) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-300 border-green-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30",
      conditional: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      registered: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    };
    const labels: Record<string, string> = {
      pending: t.pendingStatus,
      approved: t.approvedStatus,
      rejected: t.rejectedStatus,
      conditional: t.conditionalStatus,
      registered: t.registered,
    };
    
    if (status === 'pending' && hasApplication === false) {
      return (
        <span className={`px-2 py-1 text-xs rounded border bg-gray-500/20 text-gray-300 border-gray-500/30`}>
          {t.notApplied}
        </span>
      );
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const sendAdmissionEmail = async (application: Application) => {
    setSendingEmail(true);
    setEmailStatus(null);
    
    try {
      let subject: string;
      let body: string;
      
      const replaceVariables = (text: string) => {
        return text
          .replace(/{name}/g, application.name)
          .replace(/{email}/g, application.email)
          .replace(/{region}/g, application.region || '')
          .replace(/{status}/g, application.status)
          .replace(/\n/g, '<br>');
      };
      
      if (selectedTemplateId === "default") {
        const isApproved = application.status === 'approved' || application.status === 'conditional';
        subject = isApproved ? t.admissionSubject : t.rejectionSubject;
        const bodyTemplate = isApproved ? t.admissionBody : t.rejectionBody;
        body = replaceVariables(bodyTemplate);
      } else {
        const template = emailTemplates.find(t => t.id === selectedTemplateId);
        if (template) {
          subject = replaceVariables(template.subject).replace(/<br>/g, '');
          body = replaceVariables(template.body);
        } else {
          subject = t.admissionSubject;
          body = replaceVariables(t.admissionBody);
        }
      }
      
      const response = await fetch(`${API_URL}/emails/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: application.email,
          toName: application.name,
          subject,
          body,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEmailStatus({ type: 'success', message: t.emailSent });
        if (loggingEnabled) {
          await logAction('send_email', `Sent email to ${application.email}`, application.id, 'application');
        }
      } else {
        setEmailStatus({ type: 'error', message: t.emailFailed });
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      setEmailStatus({ type: 'error', message: t.emailFailed });
    } finally {
      setSendingEmail(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-[var(--color-au-blue-dark)] flex items-center justify-center px-4 overflow-hidden">
        <div className="fixed inset-0 bg-[var(--color-au-blue-dark)]">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}>
          </div>
          <motion.div 
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--color-au-blue)] rounded-full blur-[100px] md:blur-[150px] opacity-30 -top-10 md:-top-20 -right-10 md:-right-20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="relative bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-md border border-white/10 rounded-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            <div className="p-6 md:p-8">
              <div className="flex justify-center mb-4 md:mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <img src={logo} alt="Asimov University" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                </motion.div>
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl font-serif text-white text-center mb-1"
              >
                Admin Portal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/40 text-center text-xs md:text-sm mb-6 md:mb-8"
              >
                Asimov University Administration
              </motion.p>

              <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-au-accent)]/50 focus:bg-white/[0.03] transition-all duration-300 text-sm"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/[0.02] border border-white/10 px-3 py-2.5 md:px-4 md:py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-au-accent)]/50 focus:bg-white/[0.03] transition-all duration-300 text-sm"
                  />
                </motion.div>

                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-2 md:p-3 bg-red-500/20 border border-red-500/30 rounded-sm"
                    >
                      <p className="text-red-300 text-xs md:text-sm text-center">{loginError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-white text-black font-display tracking-widest text-sm hover:bg-white/90 transition-colors relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-au-accent)]/30 to-transparent skew-x-12"
                    animate={{ x: ["-150%", "150%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                  <span className="relative z-10">Sign In</span>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-au-blue-dark)] overflow-x-hidden flex">
      <div className="fixed inset-0 bg-[var(--color-au-blue-dark)]">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}>
        </div>
        <motion.div 
          className="absolute w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-[var(--color-au-blue)] rounded-full blur-[100px] md:blur-[200px] opacity-20 -top-20 md:-top-40 -right-20 md:-right-40"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 min-h-screen border-r border-[var(--color-au-accent)]/20 bg-[var(--color-au-blue-dark)]/95 backdrop-blur-xl flex flex-col shrink-0 shadow-2xl z-40"
            >
              <div className="p-6 border-b border-[var(--color-au-accent)]/20">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Asimov University" className="w-10 h-10 object-contain" />
                  <div>
                    <h1 className="text-white font-serif text-lg tracking-wide">Asimov</h1>
                    <p className="text-[var(--color-au-accent)] text-xs font-display tracking-widest uppercase">{t.adminPortal}</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <motion.button
                  onClick={() => { setActiveSection("dashboard"); setSidebarOpen(false); }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
                    activeSection === "dashboard"
                      ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  {t.dashboard}
                </motion.button>

                <motion.button
                  onClick={() => { setActiveSection("applications"); setSidebarOpen(false); }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
                    activeSection === "applications"
                      ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t.applicationReview}
                  {appStats.pending > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                      {appStats.pending}
                    </span>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => { setActiveSection("users"); setSidebarOpen(false); if (loggingEnabled) fetchLogs(); }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
                    activeSection === "users"
                      ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {t.applicantManagement}
                </motion.button>

                <motion.button
                  onClick={() => { setActiveSection("logs"); setSidebarOpen(false); fetchLogs(); }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
                    activeSection === "logs"
                      ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t.logs}
                </motion.button>

                <motion.button
                  onClick={() => { setActiveSection("templates"); setSidebarOpen(false); fetchEmailTemplates(); }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
                    activeSection === "templates"
                      ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t.emailTemplates}
                </motion.button>

                <motion.button
                  onClick={() => { setActiveSection("email"); setSidebarOpen(false); }}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
                    activeSection === "email"
                      ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  {language === "zh" ? "邮件收件箱" : "Email Inbox"}
                </motion.button>
              </nav>
              <div className="p-4 border-t border-[var(--color-au-accent)]/20 space-y-2">
                <motion.button
                  onClick={() => { setShowSettings(true); setSidebarOpen(false); }}
                  whileHover={{ x: 4 }}
                  className="w-full text-left px-4 py-3 rounded-sm text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t.settings}
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ x: 4 }}
                  className="w-full text-left px-4 py-3 rounded-sm text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t.signOut}
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex relative z-20 w-64 min-h-screen border-r border-[var(--color-au-accent)]/20 bg-[var(--color-au-blue-dark)]/90 backdrop-blur-xl flex-col shrink-0 shadow-2xl">
        <div className="p-6 border-b border-[var(--color-au-accent)]/20">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Asimov University" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-white font-serif text-lg tracking-wide">Asimov</h1>
              <p className="text-[var(--color-au-accent)] text-xs font-display tracking-widest uppercase">{t.adminPortal}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <motion.button
            onClick={() => setActiveSection("dashboard")}
            whileHover={{ x: 4 }}
            className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
              activeSection === "dashboard"
                ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            {t.dashboard}
          </motion.button>

          <motion.button
            onClick={() => setActiveSection("applications")}
            whileHover={{ x: 4 }}
            className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
              activeSection === "applications"
                ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.applicationReview}
            {appStats.pending > 0 && (
              <span className="ml-auto px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                {appStats.pending}
              </span>
            )}
          </motion.button>

          <motion.button
            onClick={() => {
              setActiveSection("users");
              if (loggingEnabled) fetchLogs();
            }}
            whileHover={{ x: 4 }}
            className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
              activeSection === "users"
                ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {t.applicantManagement}
          </motion.button>

          <motion.button
            onClick={() => {
              setActiveSection("logs");
              fetchLogs();
            }}
            whileHover={{ x: 4 }}
            className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
              activeSection === "logs"
                ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t.logs}
          </motion.button>

          <motion.button
            onClick={() => {
              setActiveSection("templates");
              fetchEmailTemplates();
            }}
            whileHover={{ x: 4 }}
            className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
              activeSection === "templates"
                ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.emailTemplates}
          </motion.button>

          <motion.button
            onClick={() => setActiveSection("email")}
            whileHover={{ x: 4 }}
            className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-colors flex items-center gap-3 ${
              activeSection === "email"
                ? "bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] border-l-2 border-[var(--color-au-accent)]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            {language === "zh" ? "邮件收件箱" : "Email Inbox"}
          </motion.button>
        </nav>

        <div className="p-4 border-t border-[var(--color-au-accent)]/20 space-y-2">
          <motion.button
            onClick={() => setShowSettings(true)}
            whileHover={{ x: 4 }}
            className="w-full text-left px-4 py-3 rounded-sm text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t.settings}
          </motion.button>
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 4 }}
            className="w-full text-left px-4 py-3 rounded-sm text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t.signOut}
          </motion.button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 min-h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 bg-[var(--color-au-blue-dark)]/80 backdrop-blur-sm border-b border-white/10">
          <div className="px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-serif text-white">
                  {activeSection === "dashboard" && t.dashboard}
                  {activeSection === "applications" && t.applicationReview}
                  {activeSection === "users" && t.applicantManagement}
                </h2>
                <p className="text-white/40 text-xs md:text-sm hidden sm:block">{t.manageAndReview}</p>
              </div>
            </div>
            <motion.button
              onClick={() => { fetchUsers(); fetchApplications(); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 md:px-4 md:py-2 text-white/60 hover:text-white text-xs md:text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">{t.refresh}</span>
            </motion.button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {activeSection === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/50 text-sm">{t.totalApplications}</p>
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-serif text-white">{appStats.total}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/20 rounded-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/50 text-sm">{t.pending}</p>
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-serif text-white">{appStats.pending}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 rounded-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/50 text-sm">{t.approved}</p>
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-serif text-white">{appStats.approved}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 rounded-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/50 text-sm">{t.rejected}</p>
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-4xl font-serif text-white">{appStats.rejected}</p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-medium">{t.recentApplications}</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {applications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => { setActiveSection("applications"); fetchApplicationDetails(app.id); }}
                        className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">{app.name}</p>
                            <p className="text-white/40 text-xs">{app.email}</p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <div className="p-8 text-center text-white/40 text-sm">
                        {t.noApplications}
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-medium">{t.quickStats}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">{t.totalApplicants}</span>
                      <span className="text-white font-medium">{stats.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">{t.conditional}</span>
                      <span className="text-white font-medium">{appStats.conditional}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">{t.pending}</span>
                      <span className="text-yellow-300 font-medium">{stats.pending}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {activeSection === "applications" && (
            <>
              {applications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm p-16 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-lg mb-1">{t.noApplications}</p>
                  <p className="text-white/20 text-sm">{t.noApplicationsDesc}</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.name}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.email}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.languageLabel}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.submittedTime}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.status}</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {applications.map((app, index) => (
                        <motion.tr 
                          key={app.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => fetchApplicationDetails(app.id)}
                              className="text-white text-sm hover:text-[var(--color-au-accent)] transition-colors text-left"
                            >
                              {app.name}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white/60 text-sm font-mono">{app.email}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white/60 text-sm">{app.language === 'zh' ? '中文' : 'EN'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white/40 text-sm">{formatDate(app.submittedAt)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => fetchApplicationDetails(app.id)}
                              className="px-3 py-1.5 bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors rounded-sm"
                            >
                              {t.viewDetails}
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </>
          )}

          {activeSection === "users" && (
            <>
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full mb-4"
                  />
                  <div className="text-white/40">{t.loading}</div>
                </motion.div>
              ) : users.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm p-16 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-lg mb-1">{t.noData}</p>
                  <p className="text-white/20 text-sm">{t.noDataDesc}</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.name}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.region}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.email}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.applicationTime}</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{t.status}</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-white/40 uppercase tracking-wider">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((user, index) => (
                        <motion.tr 
                          key={user.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="text-white text-sm hover:text-[var(--color-au-accent)] transition-colors text-left"
                            >
                              {user.name}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white/60 text-sm">{user.region || "-"}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white/60 text-sm font-mono">{user.email}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white/40 text-sm">{formatDate(user.created_at)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(user.status, user.hasApplication)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <AnimatePresence mode="wait">
                              {deleteConfirm === user.id ? (
                                <motion.div
                                  key="confirm"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="flex items-center justify-end gap-2"
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="px-3 py-1.5 bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30 transition-colors rounded-sm border border-red-500/20"
                                  >
                                    {t.confirm}
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-3 py-1.5 bg-white/10 text-white/60 text-xs hover:bg-white/20 transition-colors rounded-sm border border-white/10"
                                  >
                                    {t.cancel}
                                  </motion.button>
                                </motion.div>
                              ) : (
                                <motion.button
                                  key="delete"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  whileHover={{ scale: 1.05, color: "#f87171" }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setDeleteConfirm(user.id)}
                                  className="px-3 py-1 text-red-400/60 text-sm transition-colors"
                                >
                                  {t.delete}
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </>
          )}

          {activeSection === "logs" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-serif text-white">{t.logs}</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setLoggingEnabled(!loggingEnabled);
                    if (!loggingEnabled) fetchLogs();
                  }}
                  className={`px-4 py-2 text-xs rounded-sm border transition-colors ${
                    loggingEnabled 
                      ? "bg-green-500/20 text-green-300 border-green-500/30" 
                      : "bg-white/10 text-white/60 border-white/10 hover:bg-white/20"
                  }`}
                >
                  {loggingEnabled ? t.loggingEnabled : t.enableLogging}
                </motion.button>
              </div>
              
              {loggingEnabled ? (
                logs.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.02] border border-white/10 rounded-sm p-16 text-center"
                  >
                    <p className="text-white/40">{t.noLogs}</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden"
                  >
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-3 text-left text-white/40 text-xs uppercase tracking-wider">{t.time}</th>
                          <th className="px-6 py-3 text-left text-white/40 text-xs uppercase tracking-wider">{t.action}</th>
                          <th className="px-6 py-3 text-left text-white/40 text-xs uppercase tracking-wider">{t.target}</th>
                          <th className="px-6 py-3 text-left text-white/40 text-xs uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <motion.tr 
                            key={log.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-white/5 hover:bg-white/[0.02]"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-white/60 text-sm">{formatDate(log.createdAt)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-white text-sm">{log.action}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-white/60 text-sm">{log.targetType || '-'} {log.targetId ? `#${log.targetId.slice(0, 8)}` : ''}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white/60 text-sm">{log.details || '-'}</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm p-16 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-white/40">{t.loggingDisabled}</p>
                </motion.div>
              )}
            </>
          )}

          {activeSection === "templates" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-serif text-white">{t.emailTemplates}</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setEditingTemplate(null);
                    setShowTemplateModal(true);
                  }}
                  className="px-4 py-2 bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] text-xs rounded-sm border border-[var(--color-au-accent)]/30 hover:bg-[var(--color-au-accent)]/30 transition-colors"
                >
                  + {t.addTemplate}
                </motion.button>
              </div>
              
              {emailTemplates.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.02] border border-white/10 rounded-sm p-16 text-center"
                >
                  <p className="text-white/40">{language === "zh" ? "暂无邮件模板" : "No email templates"}</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emailTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/[0.02] border border-white/10 rounded-sm p-4 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{template.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          template.category === 'admission' ? 'bg-green-500/20 text-green-300' :
                          template.category === 'rejection' ? 'bg-red-500/20 text-red-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {template.category === 'admission' ? t.admission : 
                           template.category === 'rejection' ? t.rejection : t.custom}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-4 truncate">{template.subject}</p>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setEditingTemplate(template);
                            setShowTemplateModal(true);
                          }}
                          className="flex-1 py-1.5 bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors rounded-sm"
                        >
                          {t.editTemplate}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors rounded-sm"
                        >
                          {t.delete}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === "email" && (
            <div className="h-[calc(100vh-120px)] -m-8">
              <EmailInbox
                userEmail="admin@asimov.edu"
                language={language}
                onBack={() => setActiveSection("dashboard")}
              />
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedApplication(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-au-blue-dark)] border border-white/10 rounded-sm w-full max-w-6xl h-[90vh] overflow-hidden flex"
            >
              <div className="w-80 border-r border-white/10 flex flex-col shrink-0">
                <div className="p-5 border-b border-white/10 shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-serif text-white">{t.reviewApplication}</h3>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="text-white/40 hover:text-white transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-white/5">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.name}</p>
                      <p className="text-white text-lg">{selectedApplication.name}</p>
                    </div>
                    <div className="pb-4 border-b border-white/5">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.email}</p>
                      <p className="text-white font-mono text-sm">{selectedApplication.email}</p>
                    </div>
                    <div className="pb-4 border-b border-white/5">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.region}</p>
                      <p className="text-white">{selectedApplication.region || "-"}</p>
                    </div>
                    <div className="pb-4 border-b border-white/5">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.languageLabel}</p>
                      <p className="text-white">{selectedApplication.language === 'zh' ? '中文' : 'English'}</p>
                    </div>
                    <div className="pb-4 border-b border-white/5">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.submittedAt}</p>
                      <p className="text-white text-sm">{formatDate(selectedApplication.submittedAt)}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{t.reviewerNotes}</p>
                    <textarea
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder={t.addNotes}
                      className="w-full h-28 bg-white/[0.02] border border-white/10 rounded-sm p-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-white/30"
                    />
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={saveReviewerNotes}
                      disabled={savingNotes}
                      className="w-full mt-2 py-2 bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors rounded-sm disabled:opacity-50"
                    >
                      {savingNotes ? '...' : t.saveNotes}
                    </motion.button>
                  </div>
                </div>

                <div className="p-4 border-t border-white/10 shrink-0 space-y-2">
                  {emailStatus && (
                    <div className={`p-2 rounded-sm text-xs text-center ${
                      emailStatus.type === 'success' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/20' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/20'
                    }`}>
                      {emailStatus.message}
                    </div>
                  )}
                  {emailTemplates.length > 0 && (
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1 block">{t.selectTemplate}</label>
                      <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-sm p-2 text-white text-xs focus:outline-none focus:border-white/30"
                      >
                        <option value="default">{language === "zh" ? "默认模板" : "Default Template"}</option>
                        {emailTemplates.map(template => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendAdmissionEmail(selectedApplication)}
                    disabled={sendingEmail || selectedApplication.status === 'pending'}
                    className="w-full py-2.5 bg-[var(--color-au-accent)]/20 text-[var(--color-au-accent)] text-xs hover:bg-[var(--color-au-accent)]/30 transition-colors rounded-sm border border-[var(--color-au-accent)]/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {sendingEmail ? '...' : t.sendAdmissionEmail}
                  </motion.button>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                      className="py-2.5 bg-green-500/20 text-green-300 text-xs hover:bg-green-500/30 transition-colors rounded-sm border border-green-500/20 font-medium"
                    >
                      {t.approve}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                      className="py-2.5 bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30 transition-colors rounded-sm border border-red-500/20 font-medium"
                    >
                      {t.reject}
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'conditional')}
                      className="py-2.5 bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30 transition-colors rounded-sm border border-blue-500/20 font-medium"
                    >
                      {t.conditionalApprove}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateApplicationStatus(selectedApplication.id, 'pending')}
                      className="py-2.5 bg-yellow-500/20 text-yellow-300 text-xs hover:bg-yellow-500/30 transition-colors rounded-sm border border-yellow-500/20 font-medium"
                    >
                      {t.markPending}
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteApplicationConfirm(selectedApplication.id)}
                    className="w-full py-2.5 bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors rounded-sm border border-red-500/20 font-medium"
                  >
                    {t.delete}
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="p-5 border-b border-white/10 shrink-0">
                  <h4 className="text-white font-medium">{t.conversationHistory}</h4>
                  <p className="text-white/40 text-xs mt-1">
                    {selectedApplication.messages ? `${selectedApplication.messages.length} messages` : 'No messages'}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {selectedApplication.messages && selectedApplication.messages.length > 0 ? (
                    <div className="space-y-4">
                      {selectedApplication.messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`p-4 rounded-sm ${
                            msg.role === 'user' 
                              ? 'bg-white/[0.03] border-l-2 border-white/30 ml-8' 
                              : 'bg-[var(--color-au-accent)]/[0.05] border-l-2 border-[var(--color-au-accent)]/40 mr-8'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-medium ${msg.role === 'user' ? 'text-white/60' : 'text-[var(--color-au-accent)]/70'}`}>
                              {msg.role === 'user' ? 'Applicant' : 'Lyra'}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/30">
                      <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm">No conversation data</p>
                    </div>
                  )}
                </div>

                {selectedApplication.lyraEvaluationReport && (
                  <div className="border-t border-white/10 shrink-0">
                    <div className="p-5 border-b border-white/10">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <span className="text-[var(--color-au-accent)]">✦</span>
                        {language === "zh" ? "Lyra 评估报告" : "Lyra Evaluation Report"}
                      </h4>
                      <p className="text-white/40 text-xs mt-1">
                        {language === "zh" ? "由 Lyra 生成的申请评估" : "Generated by Lyra for Board review"}
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-5 bg-black/20">
                      <pre className="text-white/80 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                        {selectedApplication.lyraEvaluationReport}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteApplicationConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteApplicationConfirm(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-au-blue-dark)] border border-white/10 rounded-sm max-w-sm w-full p-6"
            >
              <h3 className="text-lg font-serif text-white mb-2">{language === "zh" ? "确认删除" : "Confirm Delete"}</h3>
              <p className="text-white/60 text-sm mb-6">
                {language === "zh" 
                  ? "确定要删除这个申请吗？此操作无法撤销。" 
                  : "Are you sure you want to delete this application? This action cannot be undone."}
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteApplicationConfirm(null)}
                  className="flex-1 py-2 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors rounded-sm"
                >
                  {t.cancel}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleDeleteApplication(deleteApplicationConfirm);
                    setDeleteApplicationConfirm(null);
                    setSelectedApplication(null);
                  }}
                  className="flex-1 py-2 bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors rounded-sm border border-red-500/20"
                >
                  {t.confirm}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-au-blue-dark)] border border-white/10 rounded-sm max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif text-white">{language === "zh" ? "申请人详情" : "Applicant Details"}</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.name}</p>
                  <p className="text-white">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.region}</p>
                  <p className="text-white">{selectedUser.region || "-"}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.email}</p>
                  <p className="text-white font-mono">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.applicationTime}</p>
                  <p className="text-white">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t.status}</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors rounded-sm"
                >
                  {t.close}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setDeleteConfirm(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex-1 py-2 bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors rounded-sm border border-red-500/20"
                >
                  {t.deleteThisUser}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-au-blue-dark)] border border-white/10 rounded-sm max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif text-white">{t.settings}</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3">{t.language}</p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLanguageChange("en")}
                      className={`flex-1 py-3 text-sm transition-colors rounded-sm border ${
                        language === "en"
                          ? "bg-white/10 text-white border-white/30"
                          : "bg-white/[0.02] text-white/60 border-white/10 hover:bg-white/5"
                      }`}
                    >
                      {t.english}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLanguageChange("zh")}
                      className={`flex-1 py-3 text-sm transition-colors rounded-sm border ${
                        language === "zh"
                          ? "bg-white/10 text-white border-white/30"
                          : "bg-white/[0.02] text-white/60 border-white/10 hover:bg-white/5"
                      }`}
                    >
                      {t.chinese}
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors rounded-sm"
                >
                  {t.close}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowTemplateModal(false);
              setEditingTemplate(null);
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-au-blue-dark)] border border-white/10 rounded-sm max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif text-white">
                    {editingTemplate ? t.editTemplate : t.addTemplate}
                  </h3>
                  <button
                    onClick={() => {
                      setShowTemplateModal(false);
                      setEditingTemplate(null);
                    }}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">{t.templateName}</label>
                  <input
                    type="text"
                    value={editingTemplate?.name || ''}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev || { name: '', category: 'custom', subject: '', body: '', isActive: true }, name: e.target.value }))}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-sm p-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
                    placeholder={language === "zh" ? "输入模板名称" : "Enter template name"}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">{t.templateCategory}</label>
                  <select
                    value={editingTemplate?.category || 'custom'}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev || { name: '', category: 'custom', subject: '', body: '', isActive: true }, category: e.target.value }))}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-sm p-3 text-white text-sm focus:outline-none focus:border-white/30"
                  >
                    <option value="admission">{t.admission}</option>
                    <option value="rejection">{t.rejection}</option>
                    <option value="custom">{t.custom}</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">{t.templateSubject}</label>
                  <input
                    type="text"
                    value={editingTemplate?.subject || ''}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev || { name: '', category: 'custom', subject: '', body: '', isActive: true }, subject: e.target.value }))}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-sm p-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
                    placeholder={language === "zh" ? "输入邮件主题" : "Enter email subject"}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">{t.templateBody}</label>
                  <textarea
                    value={editingTemplate?.body || ''}
                    onChange={(e) => setEditingTemplate(prev => ({ ...prev || { name: '', category: 'custom', subject: '', body: '', isActive: true }, body: e.target.value }))}
                    rows={8}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-sm p-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 resize-none"
                    placeholder={language === "zh" ? "输入邮件内容，可用变量: {name} {email} {region} {status}" : "Enter email body. Variables: {name} {email} {region} {status}"}
                  />
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                  }}
                  className="flex-1 py-2 bg-white/10 text-white text-sm hover:bg-white/20 transition-colors rounded-sm"
                >
                  {t.cancel}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (editingTemplate && editingTemplate.name && editingTemplate.subject && editingTemplate.body) {
                      handleSaveTemplate(editingTemplate);
                    }
                  }}
                  disabled={!editingTemplate?.name || !editingTemplate?.subject || !editingTemplate?.body}
                  className="flex-1 py-2 bg-[var(--color-au-accent)] text-black text-sm hover:bg-[var(--color-au-accent)]/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.saveTemplate}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
