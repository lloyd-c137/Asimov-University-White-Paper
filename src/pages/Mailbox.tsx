import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../assets/newlogo.png";

const API_URL = "http://localhost:3001/api";

interface Email {
  id: string;
  toEmail: string;
  toName: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: number;
  folder: string;
}

const quickLoginAccounts = [
  { email: "test@example.com", name: "Test User" },
  { email: "zhang.san@gmail.com", name: "张三" },
  { email: "li.si@gmail.com", name: "李四" },
  { email: "wang.wu@gmail.com", name: "王五" },
];

export default function Mailbox() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [customEmail, setCustomEmail] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("mailbox_user");
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentEmail(user.email);
      setCurrentName(user.name);
      setIsLoggedIn(true);
      fetchEmails(user.email);
    }
  }, []);

  const fetchEmails = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/emails/inbox/${encodeURIComponent(email)}`);
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (account: { email: string; name: string }) => {
    setCurrentEmail(account.email);
    setCurrentName(account.name);
    setIsLoggedIn(true);
    sessionStorage.setItem("mailbox_user", JSON.stringify(account));
    fetchEmails(account.email);
  };

  const handleCustomLogin = () => {
    if (customEmail.trim()) {
      const name = customEmail.split("@")[0];
      handleQuickLogin({ email: customEmail.trim(), name });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentEmail("");
    setCurrentName("");
    setEmails([]);
    setSelectedEmail(null);
    sessionStorage.removeItem("mailbox_user");
  };

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      try {
        await fetch(`${API_URL}/emails/${email.id}/read`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    try {
      await fetch(`${API_URL}/emails/${emailId}`, {
        method: "DELETE",
      });
      setEmails(prev => prev.filter(e => e.id !== emailId));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error("Failed to delete email:", error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("zh-CN", { weekday: "short" });
    } else {
      return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
    }
  };

  const unreadCount = emails.filter(e => !e.isRead).length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img src={logo} alt="Asimov University" className="w-16 h-16 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-serif text-gray-800 mb-2">Asimov Mail</h1>
            <p className="text-gray-500">模拟邮箱系统</p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600 font-medium">快捷登录</p>
            {quickLoginAccounts.map((account, index) => (
              <motion.button
                key={account.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickLogin(account)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shrink-0">
                  {account.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium truncate">{account.name}</p>
                  <p className="text-gray-500 text-sm truncate">{account.email}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或输入邮箱</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomLogin()}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCustomLogin}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              登录
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-64 bg-[#202124] text-white flex flex-col shrink-0">
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <img src={logo} alt="Asimov" className="w-8 h-8 object-contain" />
          <span className="font-medium">Asimov Mail</span>
        </div>

        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-6 py-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>撰写邮件</span>
          </motion.button>
        </div>

        <nav className="flex-1 px-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-r-full bg-white/10 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span className="flex-1 text-left">收件箱</span>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-r-full text-white/70 hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>已加星标</span>
          </button>

          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-r-full text-white/70 hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>已发送</span>
          </button>

          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-r-full text-white/70 hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>草稿</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>退出登录</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 flex items-center px-4 gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索邮件"
                className="w-full bg-[#f1f3f4] rounded-lg px-4 py-2 pl-10 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
              <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {currentName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r border-gray-200 flex flex-col shrink-0 bg-white">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-gray-800 font-medium">收件箱</h2>
              <p className="text-sm text-gray-400">{currentEmail}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"
                  />
                </div>
              ) : emails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm">暂无邮件</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {emails.map((email) => (
                    <motion.button
                      key={email.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => handleSelectEmail(email)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedEmail?.id === email.id ? "bg-blue-50" : ""
                      } ${!email.isRead ? "bg-blue-50/50" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-medium shrink-0">
                          {email.fromName?.charAt(0).toUpperCase() || email.fromEmail.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className={`truncate ${!email.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                              {email.fromName || email.fromEmail}
                            </p>
                            <span className="text-xs text-gray-400 shrink-0">
                              {formatDate(email.createdAt)}
                            </span>
                          </div>
                          <p className={`truncate text-sm ${!email.isRead ? "font-medium text-gray-800" : "text-gray-600"}`}>
                            {email.subject}
                          </p>
                          <p className="truncate text-xs text-gray-400 mt-1">
                            {email.body.replace(/<[^>]*>/g, '').slice(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {selectedEmail ? (
              <>
                <div className="p-6 border-b border-gray-200 shrink-0">
                  <h1 className="text-xl text-gray-800 mb-4">{selectedEmail.subject}</h1>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium shrink-0">
                      {selectedEmail.fromName?.charAt(0).toUpperCase() || selectedEmail.fromEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{selectedEmail.fromName || selectedEmail.fromEmail}</p>
                          <p className="text-sm text-gray-500">&lt;{selectedEmail.fromEmail}&gt;</p>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(selectedEmail.createdAt).toLocaleString("zh-CN")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        收件人: {selectedEmail.toName || selectedEmail.toEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div 
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                  />
                </div>

                <div className="p-4 border-t border-gray-200 shrink-0">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      回复
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      转发
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeleteEmail(selectedEmail.id)}
                      className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 ml-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      删除
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>选择一封邮件查看</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
