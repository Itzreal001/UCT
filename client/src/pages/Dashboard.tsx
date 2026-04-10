import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { LogOut, User, BookOpen, Bell, Settings, Home, CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface Finances {
  fees: { type: string; amount: number; status: string; dueDate: string | null }[];
  totalDue: number;
  paidToDate: number;
  outstanding: number;
  paymentPlan: string | null;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  dueDate: string | null;
  urgent: boolean;
  read: boolean;
}

interface TimetableEntry {
  day: string;
  time: string;
  courseCode: string;
  type: string;
}

type Tab = 'overview' | 'courses' | 'finances' | 'timetable' | 'notifications';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { profile, firebaseUser, signOut, loading } = useAuth();
  const [finances, setFinances] = useState<Finances | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !firebaseUser) setLocation('/login');
  }, [loading, firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) return;
    Promise.all([
      api.get<Finances>('/api/users/me/finances').then(setFinances).catch(() => null),
      api.get<{ notifications: Notification[] }>('/api/users/me/notifications').then(d => setNotifications(d.notifications)).catch(() => null),
      api.get<{ entries: TimetableEntry[] }>('/api/users/me/timetable').then(d => setTimetable(d.entries || [])).catch(() => null),
    ]).finally(() => setDataLoading(false));
  }, [firebaseUser]);

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null; // Will redirect in useEffect
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't load your student profile. This might happen if your account was partially created or if there's a server issue.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => window.location.reload()} className="bg-[#003366] hover:bg-[#1a4d7a]">
                Retry Loading
              </Button>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentNotifs = notifications.filter(n => n.urgent && !n.read);

  const navItems: { id: Tab; icon: any; label: string; badge?: number }[] = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'courses', icon: BookOpen, label: 'My Courses' },
    { id: 'finances', icon: CreditCard, label: 'Finances' },
    { id: 'timetable', icon: Clock, label: 'Timetable' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
  ];

  const statusColor = (status: string) => {
    if (status.includes('✅') || (status.toLowerCase().includes('paid') && !status.includes('❌'))) return 'text-green-700 bg-green-100';
    if (status.includes('❌') || status.toLowerCase().includes('unpaid')) return 'text-red-700 bg-red-100';
    if (status.toLowerCase().includes('partially') || status.toLowerCase().includes('covered')) return 'text-yellow-700 bg-yellow-100';
    return 'text-blue-700 bg-blue-100';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Urgent alert banner */}
      {urgentNotifs.length > 0 && (
        <div className="bg-red-600 text-white px-4 py-2 text-sm flex items-center gap-2 justify-center">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span><strong>Action required:</strong> {urgentNotifs.length} urgent fee{urgentNotifs.length > 1 ? 's' : ''} outstanding — please arrange payment to avoid service restrictions.</span>
        </div>
      )}

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Portal header */}
          <div className="bg-[#003366] text-white rounded-xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
                {profile.photoURL
                  ? <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                  : <User className="w-8 h-8 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {profile.preferredName || profile.firstName}!</h1>
                <p className="text-blue-200 text-sm">
                  Logged in as: <span className="font-mono font-semibold text-white">{profile.studentNumber || profile.username}</span>
                  {profile.lastLogin && <> &nbsp;|&nbsp; Last login: {new Date(profile.lastLogin).toLocaleString()}</>}
                </p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <nav className="space-y-1">
                  {navItems.map(({ id, icon: Icon, label, badge }) => (
                    <button key={id} onClick={() => setActiveTab(id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                        activeTab === id ? 'bg-[#003366] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        {label}
                      </span>
                      {badge != null && badge > 0 && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-white text-[#003366]' : 'bg-red-500 text-white'}`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1 px-2">
                  <p><strong>Student No:</strong> {profile.studentNumber || '—'}</p>
                  <p><strong>Faculty:</strong> {profile.faculty || '—'}</p>
                  <p><strong>Year:</strong> {profile.yearOfStudy ? `Year ${profile.yearOfStudy}` : '—'}</p>
                </div>

                <Button onClick={handleSignOut} variant="outline"
                  className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50 text-sm">
                  <LogOut className="w-4 h-4 mr-2" />Sign Out
                </Button>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <>
                  {/* Year level banner */}
                  {profile.yearOfStudy && profile.totalYears && (
                    <div className="bg-gradient-to-r from-[#003366] to-[#1a4d7a] text-white rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wide">Current Level</p>
                        <p className="text-xl font-bold">Year {profile.yearOfStudy} of {profile.totalYears}</p>
                        <p className="text-blue-200 text-sm">{profile.program}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {profile.yearOfStudy === profile.totalYears - 1 && (
                          <span className="bg-[#d4a574] text-white text-xs font-bold px-3 py-1 rounded-full">
                            Penultimate Year
                          </span>
                        )}
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          (profile as any).academicStanding === 'Good Standing'
                            ? 'bg-green-400/20 text-green-200'
                            : 'bg-yellow-400/20 text-yellow-200'
                        }`}>
                          {(profile as any).academicStanding || 'Good Standing'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Enrolled Courses', value: profile.enrolledCourses?.length ?? '—' },
                      { label: 'GPA', value: profile.gpa != null ? `${profile.gpa} / 4.0` : '—' },
                      { label: 'Credits Completed', value: profile.creditsCompleted ?? '—' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-gray-500 text-sm mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-[#003366]">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Personal details */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#003366] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" /> Personal Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        ['Full Name', profile.displayName],
                        ['Preferred Name', profile.preferredName || '—'],
                        ['Student Number', profile.studentNumber || '—'],
                        ['Email', profile.email],
                        ['UCT Email', profile.studentNumber ? `${profile.studentNumber.toLowerCase()}@myuct.ac.za` : '—'],
                        ['Date of Birth', (profile as any).dateOfBirth ? new Date((profile as any).dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                        ['Nationality', (profile as any).nationality || '—'],
                        ['Home Language', (profile as any).homeLanguage || '—'],
                        ['Cell Number', (profile as any).cellNumber || '—'],
                        ['Faculty', profile.faculty || '—'],
                        ['Department', (profile as any).department || '—'],
                        ['Program', profile.program || '—'],
                        ['Year of Study', profile.yearOfStudy ? `Year ${profile.yearOfStudy} of ${(profile as any).totalYears || 4}` : '—'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex flex-col">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
                          <span className="font-medium text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Residence */}
                  {profile.residence && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-bold text-[#003366] mb-4">🏠 Residence & Housing</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {[
                          ['Residence', profile.residence.name],
                          ['Room', profile.residence.room],
                          ['Meal Plan', profile.residence.mealPlan],
                          ['Fee Status', profile.residence.feeStatus],
                          ['House Committee Role', profile.residence.houseCommitteeRole || '—'],
                        ].map(([label, value]) => (
                          <div key={label} className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
                            <span className="font-medium text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* COURSES TAB */}
              {activeTab === 'courses' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#003366] mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Enrolled Courses – 2026
                  </h2>
                  {profile.enrolledCourses?.length > 0 ? (
                    <div className="space-y-4">
                      {profile.enrolledCourses.map((course, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-gray-800">{course.code}</p>
                              <p className="text-gray-600 text-sm">{course.name}</p>
                              <p className="text-xs text-gray-400 mt-1">{course.credits} credits &middot; {course.status}</p>
                            </div>
                            <div className="text-right">
                              {course.currentMark != null && (
                                <span className="text-lg font-bold text-[#003366]">{course.currentMark}%</span>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-[#d4a574] h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }} />
                          </div>
                          <p className="text-xs text-gray-400 mt-1 text-right">{course.progress}% progress</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No courses enrolled.</p>
                  )}
                </div>
              )}

              {/* FINANCES TAB */}
              {activeTab === 'finances' && (
                <div className="space-y-6">
                  {dataLoading ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                      <div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      Loading financial data...
                    </div>
                  ) : finances ? (
                    <>
                      {/* Financial Overview Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500">
                          <p className="text-gray-500 text-sm font-medium">Total Due</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">R{finances.totalDue.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 mt-1">Academic year 2026</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
                          <p className="text-gray-500 text-sm font-medium">Paid to Date</p>
                          <p className="text-2xl font-bold text-green-600 mt-1">R{finances.paidToDate.toLocaleString()}</p>
                          <p className="text-xs text-green-600 mt-1">✓ Up to date</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
                          <p className="text-gray-500 text-sm font-medium">Outstanding</p>
                          <p className="text-2xl font-bold text-orange-600 mt-1">R{finances.outstanding.toLocaleString()}</p>
                          <p className="text-xs text-orange-600 mt-1">⚠ Requires attention</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
                          <p className="text-gray-500 text-sm font-medium">Payment Progress</p>
                          <p className="text-2xl font-bold text-blue-600 mt-1">
                            {Math.round((finances.paidToDate / finances.totalDue) * 100)}%
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${(finances.paidToDate / finances.totalDue) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {finances.paidToDate.toLocaleString()} / {finances.totalDue.toLocaleString()} ZAR
                          </p>
                        </div>
                      </div>

                      {/* Urgent Payment Alerts */}
                      {finances.fees.some(fee => fee.status.includes('❌')) && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-red-800 mb-2">⚠️ Urgent Payment Required</h3>
                              <p className="text-red-700 text-sm mb-3">
                                You have outstanding fees that may affect your academic record. Please settle these payments as soon as possible.
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {finances.fees.filter(fee => fee.status.includes('❌')).map((fee, i) => (
                                  <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                    {fee.type}: R{fee.amount.toLocaleString()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fee Breakdown */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-bold text-[#003366] flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Fee Breakdown
                          </h2>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                              <span>Paid</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-100 rounded-full"></div>
                              <span>Unpaid</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
                              <span>Partial</span>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 text-gray-700 font-semibold">Fee Type</th>
                                <th className="text-right py-3 text-gray-700 font-semibold">Amount</th>
                                <th className="text-center py-3 text-gray-700 font-semibold">Status</th>
                                <th className="text-right py-3 text-gray-700 font-semibold">Due Date</th>
                                <th className="text-right py-3 text-gray-700 font-semibold">Priority</th>
                              </tr>
                            </thead>
                            <tbody>
                              {finances.fees.map((fee, i) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                  <td className="py-4 text-gray-800 font-medium">{fee.type}</td>
                                  <td className="py-4 text-right font-semibold text-gray-900">R{fee.amount.toLocaleString()}</td>
                                  <td className="py-4 text-center">
                                    <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${statusColor(fee.status)}`}>
                                      {fee.status.includes('✅') && '✓'}
                                      {fee.status.includes('❌') && '✗'}
                                      {fee.status.includes('Partially') && '○'}
                                      {fee.status.replace(/[✅❌]/g, '').trim()}
                                    </span>
                                  </td>
                                  <td className="py-4 text-right text-gray-600">
                                    {fee.dueDate ? (
                                      <span className={`font-medium ${new Date(fee.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'}`}>
                                        {new Date(fee.dueDate).toLocaleDateString('en-ZA')}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">—</span>
                                    )}
                                  </td>
                                  <td className="py-4 text-right">
                                    {fee.status.includes('❌') && fee.dueDate && new Date(fee.dueDate) < new Date() ? (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                                        Overdue
                                      </span>
                                    ) : fee.status.includes('❌') ? (
                                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                                        Urgent
                                      </span>
                                    ) : (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                        Clear
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Payment Plan Info */}
                        {finances.paymentPlan && (
                          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-blue-800 mb-1">Payment Plan Active</h4>
                                <p className="text-blue-700 text-sm">{finances.paymentPlan}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Button className="bg-[#003366] hover:bg-[#1a4d7a] text-white">
                            💳 Make Payment
                          </Button>
                          <Button variant="outline" className="border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white">
                            📄 Download Statement
                          </Button>
                          <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                            📞 Contact Finance Office
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Data Unavailable</h3>
                      <p className="text-gray-600 mb-4">
                        We couldn't load your financial information. This might be due to a temporary server issue.
                      </p>
                      <Button onClick={() => window.location.reload()} className="bg-[#003366] hover:bg-[#1a4d7a]">
                        Retry Loading
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* TIMETABLE TAB */}
              {activeTab === 'timetable' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#003366] mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Weekly Timetable
                  </h2>
                  {timetable.length > 0 ? (() => {
                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                    const times = [...new Set(timetable.map(e => e.time))].sort();
                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr>
                              <th className="p-2 text-left text-gray-500 font-medium w-20">Time</th>
                              {days.map(d => <th key={d} className="p-2 text-center text-gray-500 font-medium">{d}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {times.map(time => (
                              <tr key={time} className="border-t border-gray-100">
                                <td className="p-2 text-gray-500 font-mono text-xs">{time}</td>
                                {days.map(day => {
                                  const entry = timetable.find(e => e.day === day && e.time === time);
                                  return (
                                    <td key={day} className="p-2 text-center">
                                      {entry ? (
                                        <div className="bg-[#003366]/10 text-[#003366] rounded-lg p-2">
                                          <p className="font-bold text-xs">{entry.courseCode}</p>
                                          <p className="text-xs opacity-70">{entry.type}</p>
                                        </div>
                                      ) : null}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })() : (
                    <p className="text-gray-500">No timetable data available.</p>
                  )}
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-[#003366] mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5" /> Notifications
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount} unread</span>
                    )}
                  </h2>
                  {notifications.length > 0 ? (
                    <div className="space-y-3">
                      {notifications.map(n => (
                        <div key={n.id}
                          className={`p-4 rounded-xl border ${n.urgent ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'} ${!n.read ? 'opacity-100' : 'opacity-60'}`}>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className={`text-sm font-medium ${n.urgent ? 'text-red-800' : 'text-gray-800'}`}>{n.message}</p>
                              {n.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {n.dueDate}</p>}
                            </div>
                            {n.urgent && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No notifications.</p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
