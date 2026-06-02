import React, { useState, useEffect } from 'react';
import { Download, Check, Trash2, CalendarDays, Clock, GraduationCap, Sun, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// SA Public Holidays
// ─────────────────────────────────────────────────────────────────────────────

const calculateEaster = (year) => {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const getSAPublicHolidays = (year) => {
  const easter = calculateEaster(year);
  const goodFriday = new Date(easter); goodFriday.setDate(easter.getDate() - 2);
  const familyDay = new Date(easter); familyDay.setDate(easter.getDate() + 1);

  const fixed = [
    { date: new Date(year, 0, 1),   name: "New Year's Day" },
    { date: new Date(year, 2, 21),  name: 'Human Rights Day' },
    { date: goodFriday,             name: 'Good Friday' },
    { date: familyDay,              name: 'Family Day' },
    { date: new Date(year, 3, 27),  name: 'Freedom Day' },
    { date: new Date(year, 4, 1),   name: "Workers' Day" },
    { date: new Date(year, 5, 16),  name: 'Youth Day' },
    { date: new Date(year, 7, 9),   name: "National Women's Day" },
    { date: new Date(year, 8, 24),  name: 'Heritage Day' },
    { date: new Date(year, 11, 16), name: 'Day of Reconciliation' },
    { date: new Date(year, 11, 25), name: 'Christmas Day' },
    { date: new Date(year, 11, 26), name: 'Day of Goodwill' },
  ];

  const result = [];
  fixed.forEach(h => {
    const dateStr = h.date.toISOString().split('T')[0];
    result.push({ dateStr, name: h.name });
    if (h.date.getDay() === 0) {
      const mon = new Date(h.date); mon.setDate(mon.getDate() + 1);
      result.push({ dateStr: mon.toISOString().split('T')[0], name: `${h.name} (observed)` });
    }
  });
  return result;
};

const getHolidayForDate = (dateStr) => {
  const year = parseInt(dateStr.split('-')[0], 10);
  return getSAPublicHolidays(year).find(h => h.dateStr === dateStr) || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Schedule Definitions
// ─────────────────────────────────────────────────────────────────────────────

const MONDAY_SCHEDULE = [
  { id: 'homeroom', name: 'Homerooms PD', startTime: '07:30', endTime: '08:15' },
  { id: 'lines',    name: 'Lines',        startTime: '08:10', endTime: '08:20' },
  { id: 1,          name: 'Lesson 1',     startTime: '08:25', endTime: '09:00' },
  { id: 2,          name: 'Lesson 2',     startTime: '09:05', endTime: '09:40' },
  { id: 3,          name: 'Lesson 3',     startTime: '09:45', endTime: '10:20' },
  { id: 'break1',   name: 'Break',        startTime: '10:20', endTime: '10:50' },
  { id: 4,          name: 'Lesson 4',     startTime: '10:55', endTime: '11:30' },
  { id: 5,          name: 'Lesson 5',     startTime: '11:35', endTime: '12:10' },
  { id: 'meetings', name: 'Meetings',     startTime: '12:15', endTime: '12:45' },
  { id: 'break2',   name: 'Break',        startTime: '12:45', endTime: '13:15' },
  { id: 6,          name: 'Lesson 6',     startTime: '13:20', endTime: '13:55' },
  { id: 7,          name: 'Lesson 7',     startTime: '14:00', endTime: '14:35' },
];

const REGULAR_SCHEDULE = [
  { id: 1,         name: 'Lesson 1', startTime: '07:50', endTime: '08:30' },
  { id: 2,         name: 'Lesson 2', startTime: '08:35', endTime: '09:15' },
  { id: 3,         name: 'Lesson 3', startTime: '09:20', endTime: '10:00' },
  { id: 'utility', name: 'Utility',  startTime: '10:05', endTime: '10:45' },
  { id: 'break1',  name: 'Break',    startTime: '10:45', endTime: '11:05' },
  { id: 4,         name: 'Lesson 4', startTime: '11:10', endTime: '11:50' },
  { id: 5,         name: 'Lesson 5', startTime: '11:55', endTime: '12:35' },
  { id: 'break2',  name: 'Break',    startTime: '12:35', endTime: '13:05' },
  { id: 6,         name: 'Lesson 6', startTime: '13:10', endTime: '13:50' },
  { id: 7,         name: 'Lesson 7', startTime: '13:55', endTime: '14:35' },
];

const FRIDAY_SCHEDULE = [
  { id: 1,          name: 'Lesson 1', startTime: '07:50', endTime: '08:25' },
  { id: 2,          name: 'Lesson 2', startTime: '08:30', endTime: '09:05' },
  { id: 3,          name: 'Lesson 3', startTime: '09:10', endTime: '09:45' },
  { id: 'break1',   name: 'Break',    startTime: '09:45', endTime: '10:15' },
  { id: 4,          name: 'Lesson 4', startTime: '10:20', endTime: '10:55' },
  { id: 5,          name: 'Lesson 5', startTime: '11:00', endTime: '11:35' },
  { id: 'break2',   name: 'Break',    startTime: '11:35', endTime: '12:05' },
  { id: 6,          name: 'Lesson 6', startTime: '12:10', endTime: '12:45' },
  { id: 7,          name: 'Lesson 7', startTime: '12:50', endTime: '13:25' },
  { id: 'assembly', name: 'Assembly', startTime: '13:30', endTime: '14:30' },
];

// Rows shown in the timetable grid — lessons + utility only (breaks are fixed)
const GRID_ROWS = REGULAR_SCHEDULE.filter(
  p => typeof p.id === 'number' || p.id === 'utility'
);

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'savedSchedules';
const DEFAULT_SCHEDULES = { monday: MONDAY_SCHEDULE, friday: FRIDAY_SCHEDULE, regular: REGULAR_SCHEDULE };

const saveToStorage = (schedules) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules)); } catch {}
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULES;
  } catch { return DEFAULT_SCHEDULES; }
};

const getScheduleForDate = (dateStr) => {
  const schedules = loadFromStorage();
  const day = new Date(dateStr).getDay();
  if (day === 1) return schedules.monday;
  if (day === 5) return schedules.friday;
  return schedules.regular;
};

// ─────────────────────────────────────────────────────────────────────────────
// Day column accent colours (Day 1–7)
// ─────────────────────────────────────────────────────────────────────────────

const DAY_HEAD_BG = ['', 'bg-indigo-50', 'bg-sky-50', 'bg-violet-50', 'bg-teal-50', 'bg-orange-50', 'bg-rose-50', 'bg-amber-50'];
const DAY_CELL_BG = ['', 'bg-indigo-50/40', 'bg-sky-50/40', 'bg-violet-50/40', 'bg-teal-50/40', 'bg-orange-50/40', 'bg-rose-50/40', 'bg-amber-50/40'];

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [saveStatus, setSaveStatus] = useState({ text: 'All changes saved', showTick: true });

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('timetableTemplates');
    if (saved) return JSON.parse(saved);
    const days = {};
    for (let day = 1; day <= 7; day++) {
      days[day] = {};
      REGULAR_SCHEDULE.forEach(p => { days[day][p.id] = ''; });
    }
    return days;
  });

  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [dateAssignments, setDateAssignments] = useState([]);

  useEffect(() => {
    localStorage.setItem('timetableTemplates', JSON.stringify(timetable));
    setSaveStatus({ text: 'Saving…', showTick: false });
    const t = setTimeout(() => setSaveStatus({ text: 'All changes saved', showTick: true }), 1000);
    return () => clearTimeout(t);
  }, [timetable]);

  // ── weekday generation with holiday auto-detection ──────────────────────

  const generateWeekdays = (start, end) => {
    const dates = [];
    const cur = new Date(start);
    const endDate = new Date(end);
    let dayNum = 1;
    let weekNum = 1;
    let weekBuf = [];

    const startDow = cur.getDay();
    if (startDow !== 1) {
      cur.setDate(cur.getDate() + (startDow === 0 ? 1 : -(startDow - 1)));
    }

    while (cur <= endDate) {
      const dow = cur.getDay();
      if (dow !== 0 && dow !== 6) {
        const dateStr = cur.toISOString().split('T')[0];
        const holiday = getHolidayForDate(dateStr);
        const entry = {
          date: dateStr,
          dayNumber: holiday ? 0 : dayNum,
          dayOfWeek: dow,
          dayName: cur.toLocaleDateString('en-US', { weekday: 'long' }),
          weekNumber: weekNum,
          holiday: holiday ? holiday.name : null,
        };
        weekBuf.push(entry);
        if (!holiday) dayNum = dayNum === 7 ? 1 : dayNum + 1;
        if (dow === 5 || cur >= endDate) {
          dates.push(...weekBuf);
          weekBuf = [];
          weekNum++;
        }
      }
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const handleDateRangeChange = (field, value) => {
    const next = { ...dateRange, [field]: value };
    setDateRange(next);
    if (next.startDate && next.endDate) {
      setDateAssignments(generateWeekdays(next.startDate, next.endDate));
    }
  };

  const updateDayNumber = (index, newNum) => {
    if (!window.confirm('This will update day numbers for all subsequent dates. Continue?')) return;
    setDateAssignments(prev => {
      const next = [...prev];
      next[index] = { ...next[index], dayNumber: newNum };
      if (newNum !== 0) {
        let last = newNum;
        for (let i = index + 1; i < next.length; i++) {
          if (next[i].holiday) {
            next[i] = { ...next[i], dayNumber: 0 };
          } else {
            last = last === 7 ? 1 : last + 1;
            next[i] = { ...next[i], dayNumber: last };
          }
        }
      }
      return next;
    });
  };

  // ── CSV export ──────────────────────────────────────────────────────────

  const generateAndDownload = () => {
    let csv = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private\n';

    const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const fmtTime = (t) => {
      if (!t) return '';
      const [h, m] = t.split(':');
      return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };
    const addRow = ({ subject, date, start, end, desc }) => {
      csv += [subject, fmtDate(date), fmtTime(start), fmtDate(date), fmtTime(end), 'FALSE', desc, '', 'FALSE']
        .map(f => `"${f}"`).join(',') + '\n';
    };

    dateAssignments.forEach(a => {
      if (a.dayNumber === 0) return;
      const daySchedule = timetable[a.dayNumber];
      if (!daySchedule) return;
      getScheduleForDate(a.date).forEach(period => {
        let subject = '', desc = '';
        if (typeof period.id === 'number') {
          subject = daySchedule[period.id]; desc = `Session ${period.id}`;
        } else if (period.id === 'break1' || period.id === 'break2') {
          subject = daySchedule[period.id] || 'Break'; desc = 'Break Time';
        } else if (period.id === 'utility') {
          subject = daySchedule[period.id] || 'Meeting/Utility'; desc = 'Meeting/Utility Session';
        } else if (a.dayOfWeek === 1) {
          if (period.id === 'homeroom') { subject = 'PD'; desc = 'Professional Development'; }
          else if (period.id === 'meetings') { subject = 'Meetings'; desc = 'Staff Meetings'; }
        } else if (a.dayOfWeek === 5 && period.id === 'assembly') {
          subject = 'Assembly'; desc = 'School Assembly';
        }
        if (subject) addRow({ subject, date: a.date, start: period.startTime, end: period.endTime, desc });
      });
    });

    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'parklands-timetable.csv';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  const handleClearCalendar = () => {
    if (!window.confirm('This will clear all timetable entries. Continue?')) return;
    const empty = {};
    for (let day = 1; day <= 7; day++) {
      empty[day] = {};
      REGULAR_SCHEDULE.forEach(p => { empty[day][p.id] = ''; });
    }
    setTimetable(empty);
    setDateRange({ startDate: '', endDate: '' });
    setDateAssignments([]);
  };

  const handleCellChange = (day, periodId, value) => {
    setTimetable(prev => ({ ...prev, [day]: { ...prev[day], [periodId]: value } }));
  };

  const handleKeyNav = (e, rowEl, cellEl) => {
    const cells = Array.from(rowEl.parentElement.children);
    const rows = Array.from(rowEl.parentElement.parentElement.children);
    const rowIdx = rows.indexOf(rowEl);
    const cellIdx = Array.from(rowEl.children).indexOf(cellEl);

    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      rows[rowIdx + 1]?.children[cellIdx]?.querySelector('input')?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      rows[rowIdx - 1]?.children[cellIdx]?.querySelector('input')?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      rowEl.children[cellIdx - 1]?.querySelector('input')?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      rowEl.children[cellIdx + 1]?.querySelector('input')?.focus();
      e.preventDefault();
    }
  };

  // ── derived stats ───────────────────────────────────────────────────────

  const holidayCount = dateAssignments.filter(a => a.holiday).length;
  const totalWeeks = dateAssignments.length > 0 ? dateAssignments[dateAssignments.length - 1].weekNumber : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="clay-card px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0"
                   style={{ boxShadow: '4px 4px 14px rgba(79,70,229,0.35)' }}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">Parklands College</h1>
                <p className="text-sm text-slate-400 font-medium">Timetable Generator</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                {saveStatus.showTick
                  ? <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  : <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
                <span>{saveStatus.text}</span>
              </div>
              <button
                onClick={handleClearCalendar}
                className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 active:bg-red-200 transition-colors duration-150 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* ── Timetable Grid ────────────────────────────────────────────── */}
        <div className="clay-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Timetable Template</h2>
              <p className="text-sm text-slate-400">Enter subjects for each Day 1–7 rotation</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide bg-slate-100 min-w-[110px]">
                    Period
                  </th>
                  <th className="border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide bg-slate-100 min-w-[120px]">
                    Time (Reg.)
                  </th>
                  {[1,2,3,4,5,6,7].map(day => (
                    <th key={day}
                        className={`border-r last:border-r-0 border-slate-200 px-3 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide min-w-[88px] ${DAY_HEAD_BG[day]}`}>
                      Day {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GRID_ROWS.map(period => {
                  const isLesson = typeof period.id === 'number';
                  return (
                    <tr key={period.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="border-r border-slate-200 px-4 py-2.5 whitespace-nowrap bg-white">
                        {isLesson ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {period.id}
                            </span>
                            <span className="font-medium text-slate-700">{period.name}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            {period.name}
                          </span>
                        )}
                      </td>
                      <td className="border-r border-slate-200 px-4 py-2.5 font-mono text-xs text-slate-400 whitespace-nowrap bg-white">
                        {period.startTime}–{period.endTime}
                      </td>
                      {[1,2,3,4,5,6,7].map(day => (
                        <td key={`${day}-${period.id}`}
                            className={`border-r last:border-r-0 border-slate-200 p-1.5 ${DAY_CELL_BG[day]}`}>
                          <input
                            type="text"
                            value={timetable[day]?.[period.id] || ''}
                            onChange={(e) => handleCellChange(day, period.id, e.target.value)}
                            onKeyDown={(e) => {
                              const row = e.target.closest('tr');
                              const cell = e.target.closest('td');
                              handleKeyNav(e, row, cell);
                            }}
                            className="clay-input w-full px-2 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-300"
                            autoComplete="off"
                            spellCheck="false"
                            placeholder={isLesson ? 'Subject…' : 'Optional…'}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Breaks, Assembly, Homeroom, and Lines are fixed — they export automatically based on the day type.
          </p>
        </div>

        {/* ── Term Dates ────────────────────────────────────────────────── */}
        <div className="clay-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Term Dates</h2>
              <p className="text-sm text-slate-400">SA public holidays are auto-detected and marked as No Schedule</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="start-date" className="text-sm font-medium text-slate-700">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="clay-input px-3 py-2.5 text-sm text-slate-800 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="end-date" className="text-sm font-medium text-slate-700">End Date</label>
              <input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="clay-input px-3 py-2.5 text-sm text-slate-800 cursor-pointer"
              />
            </div>
          </div>

          {holidayCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>{holidayCount}</strong> SA public {holidayCount === 1 ? 'holiday' : 'holidays'} detected and set to No Schedule
              </span>
            </div>
          )}
        </div>

        {/* ── Daily Schedule ────────────────────────────────────────────── */}
        {dateAssignments.length > 0 && (
          <div className="clay-card p-6">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sun className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Daily Schedule</h2>
                  <p className="text-sm text-slate-400">
                    {dateAssignments.length} school days · {totalWeeks} weeks
                    {holidayCount > 0 && ` · ${holidayCount} holidays excluded`}
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: 'Monday', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
                { label: 'Friday', cls: 'bg-violet-100 text-violet-700 border-violet-200' },
                { label: 'Regular', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
                { label: 'Public Holiday', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
              ].map(({ label, cls }) => (
                <span key={label} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-100">
                      <th className="border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-[70px]">Week</th>
                      <th className="border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-[100px]">Day</th>
                      <th className="border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-[110px]">Date</th>
                      <th className="border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-[160px]">Schedule</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide min-w-[130px]">Day #</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dateAssignments.map((a, index) => {
                      const isFirstInWeek = index === 0 || a.weekNumber !== dateAssignments[index - 1].weekNumber;
                      const scheduleType = a.dayOfWeek === 1 ? 'Monday' : a.dayOfWeek === 5 ? 'Friday' : 'Regular';
                      let rowCls = 'transition-colors ';
                      if (a.holiday) rowCls += 'bg-amber-50 hover:bg-amber-100/70';
                      else if (a.dayOfWeek === 1) rowCls += 'bg-blue-50/60 hover:bg-blue-100/60';
                      else if (a.dayOfWeek === 5) rowCls += 'bg-violet-50/60 hover:bg-violet-100/60';
                      else rowCls += 'bg-white hover:bg-slate-50';
                      if (isFirstInWeek) rowCls += ' border-t-2 border-slate-300';

                      return (
                        <tr key={a.date} className={rowCls}>
                          <td className="border-r border-slate-200 px-4 py-2.5 text-xs">
                            {isFirstInWeek && (
                              <span className="bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                                Wk {a.weekNumber}
                              </span>
                            )}
                          </td>
                          <td className="border-r border-slate-200 px-4 py-2.5 font-medium text-slate-700">{a.dayName}</td>
                          <td className="border-r border-slate-200 px-4 py-2.5 font-mono text-xs text-slate-500">
                            {new Date(a.date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="border-r border-slate-200 px-4 py-2.5">
                            {a.holiday ? (
                              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full">
                                <Sun className="w-3 h-3" />
                                {a.holiday}
                              </span>
                            ) : (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                                scheduleType === 'Monday' ? 'bg-blue-100 text-blue-700' :
                                scheduleType === 'Friday' ? 'bg-violet-100 text-violet-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {scheduleType}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <select
                              value={a.dayNumber}
                              onChange={(e) => updateDayNumber(index, parseInt(e.target.value))}
                              className="clay-input px-2 py-1 text-xs text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-300"
                            >
                              <option value={0}>No Schedule</option>
                              {[1,2,3,4,5,6,7].map(d => (
                                <option key={d} value={d}>Day {d}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Generate Button ───────────────────────────────────────────── */}
        <div className="flex justify-end pb-2">
          <button
            onClick={generateAndDownload}
            disabled={dateAssignments.length === 0}
            className="clay-btn-primary flex items-center gap-2.5 px-6 py-3 text-base"
          >
            <Download className="w-5 h-5" />
            Generate Calendar CSV
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;
