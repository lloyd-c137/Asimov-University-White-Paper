import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/newlogo.png';

const API_URL = 'http://localhost:3001/api';

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

interface EmailInboxProps {
  userEmail: string;
  language: 'zh' | 'en';
  onBack: () => void;
}

const translations = {
  zh: {
    inbox: '收件箱',
    sent: '已发送',
    drafts: '草稿',
    trash: '回收站',
    compose: '撰写',
    search: '搜索邮件',
    noEmails: '暂无邮件',
    from: '发件人',
    to: '收件人',
    subject: '主题',
    body: '内容',
    send: '发送',
    cancel: '取消',
    reply: '回复',
    forward: '转发',
    delete: '删除',
    markRead: '标为已读',
    markUnread: '标为未读',
    sentSuccess: '邮件发送成功',
    sentFailed: '邮件发送失败',
    deleteSuccess: '邮件已删除',
    deleteFailed: '删除失败',
    selectEmail: '选择一封邮件查看详情',
    newMessage: '新邮件',
    replyPrefix: '回复: ',
    forwardPrefix: '转发: ',
    refresh: '刷新',
    more: '更多',
    back: '返回',
    toPlaceholder: '收件人邮箱',
    subjectPlaceholder: '主题',
    bodyPlaceholder: '撰写邮件内容...',
    today: '今天',
    yesterday: '昨天',
  },
  en: {
    inbox: 'Inbox',
    sent: 'Sent',
    drafts: 'Drafts',
    trash: 'Trash',
    compose: 'Compose',
    search: 'Search emails',
    noEmails: 'No emails',
    from: 'From',
    to: 'To',
    subject: 'Subject',
    body: 'Body',
    send: 'Send',
    cancel: 'Cancel',
    reply: 'Reply',
    forward: 'Forward',
    delete: 'Delete',
    markRead: 'Mark as read',
    markUnread: 'Mark as unread',
    sentSuccess: 'Email sent successfully',
    sentFailed: 'Failed to send email',
    deleteSuccess: 'Email deleted',
    deleteFailed: 'Failed to delete',
    selectEmail: 'Select an email to view details',
    newMessage: 'New message',
    replyPrefix: 'Re: ',
    forwardPrefix: 'Fwd: ',
    refresh: 'Refresh',
    more: 'More',
    back: 'Back',
    toPlaceholder: 'To',
    subjectPlaceholder: 'Subject',
    bodyPlaceholder: 'Compose email...',
    today: 'Today',
    yesterday: 'Yesterday',
  }
};

const EmailInbox: React.FC<EmailInboxProps> = ({ userEmail, language, onBack }) => {
  const t = translations[language];
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchEmails();
  }, [userEmail, activeFolder]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/emails/inbox/${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return t.yesterday;
    } else if (diffDays < 7) {
      return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      try {
        await fetch(`${API_URL}/emails/${email.id}/read`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true })
        });
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleSendEmail = async () => {
    if (!composeData.to || !composeData.subject || !composeData.body) return;
    
    setSending(true);
    try {
      const response = await fetch(`${API_URL}/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: composeData.to,
          toName: '',
          fromEmail: userEmail,
          fromName: '',
          subject: composeData.subject,
          body: composeData.body
        })
      });
      
      if (response.ok) {
        setStatusMessage({ type: 'success', message: t.sentSuccess });
        setShowCompose(false);
        setComposeData({ to: '', subject: '', body: '' });
        fetchEmails();
      } else {
        setStatusMessage({ type: 'error', message: t.sentFailed });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: t.sentFailed });
    } finally {
      setSending(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    try {
      const response = await fetch(`${API_URL}/emails/${emailId}`, { method: 'DELETE' });
      if (response.ok) {
        setStatusMessage({ type: 'success', message: t.deleteSuccess });
        setEmails(prev => prev.filter(e => e.id !== emailId));
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null);
        }
      } else {
        setStatusMessage({ type: 'error', message: t.deleteFailed });
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: t.deleteFailed });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleReply = (email: Email) => {
    setComposeData({
      to: email.fromEmail,
      subject: t.replyPrefix + email.subject.replace(/^Re:\s*/i, ''),
      body: `\n\n---\n${t.from}: ${email.fromName} <${email.fromEmail}>\n${t.subject}: ${email.subject}\n\n${email.body.replace(/<br>/g, '\n')}`
    });
    setShowCompose(true);
  };

  const handleForward = (email: Email) => {
    setComposeData({
      to: '',
      subject: t.forwardPrefix + email.subject.replace(/^Fwd:\s*/i, ''),
      body: `\n\n---\n${t.from}: ${email.fromName} <${email.fromEmail}>\n${t.subject}: ${email.subject}\n\n${email.body.replace(/<br>/g, '\n')}`
    });
    setShowCompose(true);
  };

  const filteredEmails = emails.filter(email => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.fromName.toLowerCase().includes(query) ||
      email.fromEmail.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query)
    );
  });

  const unreadCount = emails.filter(e => !e.isRead).length;

  return (
    <div className="h-screen flex flex-col bg-[#f6f8fc]">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 shrink-0">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img src={logo} alt="Asimov University" className="w-8 h-8 mr-3" />
        <span className="text-lg font-normal text-gray-700" style={{ fontFamily: 'Product Sans, Roboto, sans-serif' }}>
          Asimov Mail
        </span>
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#eaf1fb] rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
        </div>
        <button
          onClick={fetchEmails}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title={t.refresh}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* Status Message */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm ${
              statusMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {statusMessage.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 shrink-0">
          <button
            onClick={() => {
              setComposeData({ to: '', subject: '', body: '' });
              setShowCompose(true);
            }}
            className="w-full flex items-center gap-3 px-6 py-4 bg-[#c2e7ff] hover:bg-[#a8d8f7] rounded-2xl shadow-md hover:shadow-lg transition-all text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">{t.compose}</span>
          </button>

          <nav className="mt-6 space-y-1">
            {[
              { id: 'inbox', label: t.inbox, icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' },
              { id: 'sent', label: t.sent, icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
              { id: 'drafts', label: t.drafts, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
              { id: 'trash', label: t.trash, icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFolder(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-r-full text-left transition-colors ${
                  activeFolder === item.id
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
                {item.id === 'inbox' && unreadCount > 0 && (
                  <span className="ml-auto bg-[#1a73e8] text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Email List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                {t.noEmails}
              </div>
            ) : (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedEmail?.id === email.id
                      ? 'bg-[#e8f0fe]'
                      : email.isRead
                        ? 'hover:bg-gray-50'
                        : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 rounded border-gray-300 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="mt-1 shrink-0"
                  >
                    <svg className="w-4 h-4 text-gray-300 hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm truncate ${email.isRead ? 'text-gray-600 font-normal' : 'text-gray-900 font-medium'}`}>
                        {email.fromName || email.fromEmail}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">
                        {formatDate(email.createdAt)}
                      </span>
                    </div>
                    <div className={`text-sm truncate mb-0.5 ${email.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                      {email.subject}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {email.body.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Email Detail */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedEmail ? (
            <>
              {/* Email Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReply(selectedEmail)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {t.reply}
                  </button>
                  <button
                    onClick={() => handleForward(selectedEmail)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {t.forward}
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteEmail(selectedEmail.id)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <h1 className="text-2xl text-gray-900 mb-6" style={{ fontFamily: 'Product Sans, Roboto, sans-serif' }}>
                  {selectedEmail.subject}
                </h1>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#1a73e8] flex items-center justify-center text-white font-medium shrink-0">
                    {(selectedEmail.fromName || selectedEmail.fromEmail)[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{selectedEmail.fromName || selectedEmail.fromEmail}</span>
                        <span className="text-gray-500 text-sm ml-2">&lt;{selectedEmail.fromEmail}&gt;</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(selectedEmail.createdAt).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {t.to}: {selectedEmail.toName || selectedEmail.toEmail}
                    </div>
                  </div>
                </div>

                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>{t.selectEmail}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-8 w-[540px] bg-white rounded-t-lg shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-[#404040] px-4 py-2 flex items-center justify-between">
              <span className="text-white text-sm font-medium">{t.newMessage}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowCompose(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="border-b border-gray-200">
              <input
                type="text"
                placeholder={t.toPlaceholder}
                value={composeData.to}
                onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div className="border-b border-gray-200">
              <input
                type="text"
                placeholder={t.subjectPlaceholder}
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <textarea
                placeholder={t.bodyPlaceholder}
                value={composeData.body}
                onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                rows={12}
                className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
              />
            </div>
            
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={handleSendEmail}
                disabled={sending || !composeData.to || !composeData.subject || !composeData.body}
                className="px-6 py-2 bg-[#0b57d0] hover:bg-[#0842a0] disabled:bg-gray-300 text-white text-sm font-medium rounded-full transition-colors"
              >
                {sending ? '...' : t.send}
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-sm rounded-full transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailInbox;
