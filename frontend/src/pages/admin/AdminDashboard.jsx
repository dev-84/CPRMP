import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Building,
  Briefcase,
  Award,
  Send,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  PieChart,
} from "lucide-react";
import AppLayout from "../../components/ui/AppLayout.jsx";
import {
  PageHeader,
  MetricRow,
  MetricItem,
  CompanyLogo,
  ApplicationStatusBadge,
} from "../../components/ui/EditorialComponents.jsx";
import { adminApi } from "../../api/adminApi.js";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, activityData, drivesData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getRecentActivity(),
        adminApi.getUpcomingDrives(5),
      ]);
      setStats(statsData);
      setRecentActivity(activityData || []);
      setUpcomingDrives(drivesData || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Failed to load dashboard metrics from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <AppLayout pageTitle="Admin Dashboard" breadcrumb="TPO Authority">
      <div className="admin-dashboard-container">
        {/* Page Header */}
        <PageHeader
          eyebrow="TPO ADMINISTRATION CONSOLE"
          title="Admin Dashboard"
          description="Monitor students, recruiters, placement drives, and placement outcomes from one place."
          actions={
            <div className="admin-header-actions">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={loadDashboardData}
                disabled={loading}
                title="Refresh metrics from database"
              >
                <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => navigate("/admin/drive?create=true")}
              >
                <Plus size={14} />
                <span>Create Placement Drive</span>
              </button>
            </div>
          }
        >
          <div className="admin-cycle-tag">
            <span className="status-dot-active" />
            <span>Academic Cycle: {stats?.academicCycle || "2026–2027"} Placement Operations</span>
          </div>
        </PageHeader>

        {/* Error Alert */}
        {error && (
          <div className="admin-error-banner">
            <AlertCircle size={18} />
            <div style={{ flex: 1 }}>
              <strong>Failed to synchronize with server:</strong> {error}
            </div>
            <button type="button" className="btn-secondary btn-sm" onClick={loadDashboardData}>
              Retry
            </button>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="admin-quick-links-bar">
          <Link to="/admin/student" className="admin-quick-link-btn">
            <Users size={16} />
            <span>Manage Students</span>
            <ArrowRight size={13} />
          </Link>
          <Link to="/admin/recruiters" className="admin-quick-link-btn">
            <Building size={16} />
            <span>Manage Recruiters</span>
            <ArrowRight size={13} />
          </Link>
          <Link to="/admin/drive" className="admin-quick-link-btn">
            <Briefcase size={16} />
            <span>View All Placement Drives</span>
            <ArrowRight size={13} />
          </Link>
          <Link to="/admin/student?offerSigned=yes" className="admin-quick-link-btn">
            <Award size={16} />
            <span>Signed Offer Letters</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Primary Metrics Row (Real MongoDB data) */}
        <MetricRow>
          <MetricItem
            label="Total Students"
            value={loading ? "..." : (stats?.totalStudents ?? 0)}
            detail="Registered student profiles"
            icon={Users}
          />
          <MetricItem
            label="Total Recruiters"
            value={loading ? "..." : (stats?.totalRecruiters ?? 0)}
            detail={`${stats?.totalCompanies ?? 0} corporate partners`}
            icon={Building}
          />
          <MetricItem
            label="Active Placement Drives"
            value={loading ? "..." : (stats?.activeDrives ?? 0)}
            detail={`Out of ${stats?.totalDrives ?? 0} total drives`}
            icon={Briefcase}
          />
          <MetricItem
            label="Signed Offer Letters"
            value={loading ? "..." : (stats?.studentsWithSignedOffers ?? 0)}
            detail={`${stats?.studentsPlaced ?? 0} total candidates placed`}
            icon={Award}
          />
        </MetricRow>

        {/* Secondary Metrics Row */}
        <div className="admin-secondary-metrics">
          <div className="admin-metric-card-secondary">
            <div className="sec-metric-top">
              <span className="sec-metric-label">Institutional Placement Rate</span>
              <TrendingUp size={16} className="text-accent" />
            </div>
            <div className="sec-metric-value">{loading ? "..." : `${stats?.placementRate ?? 0}%`}</div>
            <div className="sec-metric-desc">
              {stats?.studentsPlaced ?? 0} of {stats?.totalStudents ?? 0} students with verified placement records
            </div>
          </div>

          <div className="admin-metric-card-secondary">
            <div className="sec-metric-top">
              <span className="sec-metric-label">Highest Package Offered</span>
              <Award size={16} className="text-accent" />
            </div>
            <div className="sec-metric-value" style={{ color: "var(--accent)" }}>
              {loading ? "..." : (stats?.highestPackage || "₹36.0 LPA")}
            </div>
            <div className="sec-metric-desc">Top recruitment tier (Super Dream)</div>
          </div>

          <div className="admin-metric-card-secondary">
            <div className="sec-metric-top">
              <span className="sec-metric-label">Average CTC Package</span>
              <DollarSign size={16} className="text-accent" />
            </div>
            <div className="sec-metric-value">{loading ? "..." : (stats?.averagePackage || "₹27.6 LPA")}</div>
            <div className="sec-metric-desc">Across all placed candidates</div>
          </div>

          <div className="admin-metric-card-secondary">
            <div className="sec-metric-top">
              <span className="sec-metric-label">Total Applications Submitted</span>
              <Send size={16} className="text-accent" />
            </div>
            <div className="sec-metric-value">{loading ? "..." : (stats?.totalApplications ?? 0)}</div>
            <div className="sec-metric-desc">Active candidate submissions</div>
          </div>
        </div>

        {/* Analytics & Program Breakdown Section */}
        <div className="admin-charts-grid">
          {/* Chart 1: Students by Academic Program */}
          <div className="admin-card-section">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Students by Academic Program</h2>
                <p className="admin-card-subtitle">Distribution of registered candidates across departments</p>
              </div>
              <Link to="/admin/student" className="text-accent-link">
                View Register →
              </Link>
            </div>

            {loading ? (
              <div className="admin-skeleton-box" style={{ height: "160px" }} />
            ) : stats?.charts?.studentsByProgram?.length > 0 ? (
              <div className="admin-bars-list">
                {stats.charts.studentsByProgram.map((item) => {
                  const pct = stats.totalStudents > 0 ? Math.round((item.count / stats.totalStudents) * 100) : 0;
                  return (
                    <div key={item.program} className="admin-bar-item">
                      <div className="admin-bar-labels">
                        <span className="admin-bar-name">{item.program}</span>
                        <span className="admin-bar-count">
                          <strong>{item.count} students</strong> ({pct}%)
                        </span>
                      </div>
                      <div className="admin-bar-track">
                        <div className="admin-bar-fill" style={{ width: `${Math.max(8, pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted" style={{ padding: "20px 0" }}>
                No student program distributions recorded yet.
              </p>
            )}
          </div>

          {/* Chart 2: Applications Progression Status */}
          <div className="admin-card-section">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Applications by Evaluation Stage</h2>
                <p className="admin-card-subtitle">Current status breakdown across all placement drives</p>
              </div>
            </div>

            {loading ? (
              <div className="admin-skeleton-box" style={{ height: "160px" }} />
            ) : stats?.charts?.applicationsByStatus?.length > 0 ? (
              <div className="admin-status-breakdown-list">
                {stats.charts.applicationsByStatus.map((item) => {
                  const count = item.count;
                  return (
                    <div key={item.status} className="admin-status-metric-row">
                      <ApplicationStatusBadge status={item.status} />
                      <div style={{ flex: 1, margin: "0 14px" }}>
                        <div className="admin-bar-track">
                          <div
                            className="admin-bar-fill"
                            style={{
                              width: `${Math.min(100, (count / (stats.totalApplications || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="admin-status-count-tag">{count} applications</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted" style={{ padding: "20px 0" }}>
                No active applications in the recruitment pipeline.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Section: Upcoming Drives & Recent Activity */}
        <div className="admin-two-col-grid">
          {/* Upcoming Placement Drives */}
          <div className="admin-card-section">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Active & Upcoming Placement Drives</h2>
                <p className="admin-card-subtitle">Scheduled recruitment sessions and application windows</p>
              </div>
              <Link to="/admin/drive" className="text-accent-link">
                Manage Drives →
              </Link>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-editorial-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role Designation</th>
                    <th>CTC</th>
                    <th>Deadline</th>
                    <th>Applicants</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "24px" }}>
                        Loading placement drives...
                      </td>
                    </tr>
                  ) : upcomingDrives.length > 0 ? (
                    upcomingDrives.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <CompanyLogo name={d.company} />
                            <strong style={{ fontWeight: 600 }}>{d.company}</strong>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>{d.role}</td>
                        <td style={{ color: "var(--accent)", fontWeight: 600 }}>{d.salary}</td>
                        <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                          {d.deadline ? new Date(d.deadline).toLocaleDateString() : "Ongoing"}
                        </td>
                        <td>
                          <span className="editorial-badge badge-neutral">{d.applicantsCount} candidates</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link to={`/admin/drive?id=${d.id}`} className="btn-secondary btn-sm">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                        No upcoming placement drives scheduled.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="admin-card-section">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Recent Activity Timeline</h2>
                <p className="admin-card-subtitle">Real-time system events, submissions, and offers</p>
              </div>
            </div>

            <div className="admin-activity-timeline">
              {loading ? (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                  Loading activity log...
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((evt) => (
                  <div key={evt.id} className="activity-item">
                    <div className="activity-icon-wrap">
                      {evt.type === "placement" ? (
                        <Award size={14} className="text-accent" />
                      ) : evt.type === "application" ? (
                        <Send size={14} className="text-primary" />
                      ) : (
                        <Briefcase size={14} className="text-secondary" />
                      )}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title-row">
                        <strong className="activity-title">{evt.title}</strong>
                        <span className="activity-time">
                          {evt.timestamp ? new Date(evt.timestamp).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <p className="activity-desc">{evt.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                  No recent activities recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
