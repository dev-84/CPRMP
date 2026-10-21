import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  UserCheck,
  FileText,
  Briefcase,
  Send,
  Sparkles,
  History,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Building,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/useAuth.js";
import "./AppLayout.css";

const studentNavItems = [
  { label: "Dashboard", path: "/student", icon: LayoutDashboard },
  { label: "Profile Overview", path: "/student/profile", icon: User },
  { label: "Edit Profile", path: "/student/edit-profile", icon: UserCheck },
  { label: "Resume Management", path: "/student/resume", icon: FileText },
  { label: "Placement Drives", path: "/student/placement-drives", icon: Briefcase },
  { label: "My Applications", path: "/student/applications", icon: Send },
  { label: "AI Resume Matching", path: "/student/ai-resume-matching", icon: Sparkles },
  { label: "Placement History", path: "/student/placement-history", icon: History },
];

const adminNavItems = [
  { label: "Admin Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Student Management", path: "/admin?tab=students", icon: Users },
  { label: "Company Directory", path: "/admin?tab=companies", icon: Building },
  { label: "Placement Drives", path: "/admin?tab=drives", icon: Briefcase },
  { label: "Applications", path: "/admin?tab=applications", icon: Send },
  { label: "Placement Records", path: "/admin?tab=records", icon: ShieldCheck },
];

const recruiterNavItems = [
  { label: "Recruiter Dashboard", path: "/recruiter", icon: LayoutDashboard },
  { label: "Company Profile", path: "/recruiter?tab=company", icon: Building },
  { label: "Our Placement Drives", path: "/recruiter?tab=drives", icon: Briefcase },
  { label: "Applicant Review", path: "/recruiter?tab=applicants", icon: Users },
  { label: "Hiring Outcomes", path: "/recruiter?tab=outcomes", icon: CheckCircle2 },
];

export default function AppLayout({
  children,
  pageTitle = "Dashboard",
  breadcrumb = "Student Workspace",
  searchPlaceholder = "Search drives, companies, roles...",
  onSearch,
  searchValue = "",
}) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const role = user?.role || "student";
  const navItems =
    role === "admin"
      ? adminNavItems
      : role === "recruiter"
      ? recruiterNavItems
      : studentNavItems;

  const displayName = user?.name || user?.fullName || (role === "admin" ? "Placement Officer" : role === "recruiter" ? "Recruiter" : "Aryan Sharma");
  const displayRole = role.toUpperCase();
  const initial = displayName.charAt(0).toUpperCase() || "C";

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  const isActive = (itemPath) => {
    if (itemPath.includes("?")) {
      const [path, query] = itemPath.split("?");
      return location.pathname === path && location.search === `?${query}`;
    }
    return location.pathname === itemPath;
  };

  return (
    <div className="layout-container">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`layout-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-brand-wrapper">
          <Link
            to={role === "admin" ? "/admin" : role === "recruiter" ? "/recruiter" : "/student"}
            className="sidebar-brand"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="brand-monogram">C</span>
            <div className="brand-text">
              <span className="brand-title">CPRMP</span>
              <span className="brand-subtitle">Campus Placement Portal</span>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav-section" aria-label="Main Navigation">
          <div className="sidebar-category-label">Navigation</div>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`sidebar-nav-link ${active ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <IconComponent size={16} strokeWidth={active ? 2.2 : 1.75} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="academic-cycle-badge">
            <span className="cycle-label">Placement Cycle</span>
            <span className="cycle-value">
              <span>2026–2027</span>
              <span>
                <span className="status-dot-active" />
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Active</span>
              </span>
            </span>
          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleSignOut}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="layout-main-wrapper">
        {/* Topbar */}
        <header className="layout-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
              <span className="breadcrumb-root">{breadcrumb}</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{pageTitle}</span>
            </nav>
          </div>

          <div className="topbar-right">
            {onSearch && (
              <div className="topbar-search-form">
                <Search size={14} className="topbar-search-icon" />
                <input
                  type="search"
                  className="topbar-search-input"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                  aria-label="Search"
                />
              </div>
            )}

            {/* Notifications Button */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="topbar-icon-button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell size={16} />
                <span className="notification-badge-dot" />
              </button>

              {notificationsOpen && (
                <div className="notifications-popover">
                  <div className="notifications-title-bar">
                    <span className="notifications-title">Notifications</span>
                    <span style={{ fontSize: "11px", color: "var(--accent)", cursor: "pointer" }} onClick={() => setNotificationsOpen(false)}>Close</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ padding: "8px", background: "var(--surface-secondary)", borderRadius: "6px", fontSize: "12px" }}>
                      <strong style={{ display: "block", color: "var(--text-primary)" }}>Microsoft IDC Drive Announced</strong>
                      <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>Applications open until 28 Oct 2026. Check eligibility.</span>
                    </div>
                    <div style={{ padding: "8px", background: "var(--surface-secondary)", borderRadius: "6px", fontSize: "12px" }}>
                      <strong style={{ display: "block", color: "var(--text-primary)" }}>TCS Digital Status Updated</strong>
                      <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>Your application has moved to Shortlisted.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile dropdown */}
            <div className="user-profile-menu-container">
              <button
                type="button"
                className="user-profile-trigger"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                aria-expanded={userMenuOpen}
              >
                <span className="user-avatar-circle">{initial}</span>
                <span className="user-meta-text">
                  <span className="user-name-label">{displayName}</span>
                  <span className="user-role-label">{displayRole}</span>
                </span>
                <ChevronDown size={13} color="var(--text-muted)" />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-popover">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{displayName}</div>
                    <div className="user-dropdown-email">{user?.email || "student@college.edu"}</div>
                  </div>

                  <Link
                    to="/student/profile"
                    className="user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={14} />
                    <span>View Profile</span>
                  </Link>

                  <Link
                    to="/student/resume"
                    className="user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FileText size={14} />
                    <span>Manage Resume</span>
                  </Link>

                  <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

                  <button
                    type="button"
                    className="user-dropdown-item danger"
                    onClick={handleSignOut}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="layout-content-area">{children}</main>
      </div>
    </div>
  );
}
