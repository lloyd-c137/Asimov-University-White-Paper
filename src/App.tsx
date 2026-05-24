import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Admissions from "./pages/Admissions";
import Application from "./pages/Application";
import Departments from "./pages/Departments";
import Board from "./pages/Board";
import Research from "./pages/Research";
import News from "./pages/News";
import Admin from "./pages/Admin";
import Mailbox from "./pages/Mailbox";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const isApplicationPage = pathname === "/apply";
  const isAdminPage = pathname === "/admin";
  const isMailboxPage = pathname === "/mailbox";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={`flex flex-col min-h-screen text-[var(--color-au-blue-dark)] bg-[var(--color-au-cream)] ${lang === "zh" ? "font-chinese" : ""}`}>
      {!isApplicationPage && !isAdminPage && !isMailboxPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/apply" element={<Application />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/board" element={<Board />} />
          <Route path="/research" element={<Research />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mailbox" element={<Mailbox />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isApplicationPage && !isAdminPage && !isMailboxPage && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}
