import React, { useState, useEffect } from 'react';
import { Download, Check, Trash2, AlertCircle, Lock } from 'lucide-react';

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
// Schedules
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

const GRID_ROWS = REGULAR_SCHEDULE.filter(p => typeof p.id === 'number' || p.id === 'utility' || p.id === 'break1' || p.id === 'break2');

// ─────────────────────────────────────────────────────────────────────────────
// Storage
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
// App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [saveStatus, setSaveStatus] = useState({ text: 'All changes saved', saved: true });

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

  const [utilities, setUtilities] = useState(() => {
    const saved = localStorage.getItem('utilities');
    if (saved) return JSON.parse(saved);
    return { tuesday: '', wednesday: '', thursday: '' };
  });

  const [exportBreaks, setExportBreaks] = useState(() => {
    const saved = localStorage.getItem('exportBreaks');
    if (saved) return JSON.parse(saved);
    return { break1: true, break2: true };
  });

  const [dateRange, setDateRange] = useState(() => {
    const saved = localStorage.getItem('dateRange');
    return saved ? JSON.parse(saved) : { startDate: '', endDate: '' };
  });

  const [dateAssignments, setDateAssignments] = useState(() => {
    const saved = localStorage.getItem('dateAssignments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('timetableTemplates', JSON.stringify(timetable));
    setSaveStatus({ text: 'Saving…', saved: false });
    const t = setTimeout(() => setSaveStatus({ text: 'All changes saved', saved: true }), 1000);
    return () => clearTimeout(t);
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('utilities', JSON.stringify(utilities));
  }, [utilities]);

  useEffect(() => {
    localStorage.setItem('exportBreaks', JSON.stringify(exportBreaks));
  }, [exportBreaks]);

  useEffect(() => {
    localStorage.setItem('dateRange', JSON.stringify(dateRange));
  }, [dateRange]);

  useEffect(() => {
    localStorage.setItem('dateAssignments', JSON.stringify(dateAssignments));
  }, [dateAssignments]);

  const generateWeekdays = (start, end) => {
    const dates = [];
    const cur = new Date(start);
    const endDate = new Date(end);
    let dayNum = 1, weekNum = 1, weekBuf = [];

    const dow0 = cur.getDay();
    if (dow0 !== 1) cur.setDate(cur.getDate() + (dow0 === 0 ? 1 : -(dow0 - 1)));

    while (cur <= endDate) {
      const dow = cur.getDay();
      if (dow !== 0 && dow !== 6) {
        const dateStr = cur.toISOString().split('T')[0];
        const holiday = getHolidayForDate(dateStr);
        weekBuf.push({
          date: dateStr,
          dayNumber: holiday ? 0 : dayNum,
          dayOfWeek: dow,
          dayName: cur.toLocaleDateString('en-US', { weekday: 'long' }),
          weekNumber: weekNum,
          holiday: holiday ? holiday.name : null,
        });
        if (!holiday) dayNum = dayNum === 7 ? 1 : dayNum + 1;
        if (dow === 5 || cur >= endDate) { dates.push(...weekBuf); weekBuf = []; weekNum++; }
      }
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const handleDateRangeChange = (field, value) => {
    const next = { ...dateRange, [field]: value };
    setDateRange(next);
    if (next.startDate && next.endDate) setDateAssignments(generateWeekdays(next.startDate, next.endDate));
  };

  const updateDayNumber = (index, newNum) => {
    if (!window.confirm('This will update day numbers for all subsequent dates. Continue?')) return;
    setDateAssignments(prev => {
      const next = [...prev];
      next[index] = { ...next[index], dayNumber: newNum };
      if (newNum !== 0) {
        let last = newNum;
        for (let i = index + 1; i < next.length; i++) {
          if (next[i].holiday) { next[i] = { ...next[i], dayNumber: 0 }; }
          else { last = last === 7 ? 1 : last + 1; next[i] = { ...next[i], dayNumber: last }; }
        }
      }
      return next;
    });
  };

  const generateAndDownload = () => {
    let csv = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private\n';
    const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const fmtTime = (t) => {
      if (!t) return '';
      const [h, m] = t.split(':');
      return new Date(2000, 0, 1, +h, +m).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };
    const addRow = ({ subject, date, start, end, desc }) => {
      csv += [subject, fmtDate(date), fmtTime(start), fmtDate(date), fmtTime(end), 'FALSE', desc, '', 'FALSE']
        .map(f => `"${f}"`).join(',') + '\n';
    };

    dateAssignments.forEach(a => {
      if (a.dayNumber === 0) return;
      const ds = timetable[a.dayNumber];
      if (!ds) return;
      getScheduleForDate(a.date).forEach(p => {
        let subject = '', desc = '';
        if (typeof p.id === 'number') { subject = ds[p.id]; desc = `Session ${p.id}`; }
        else if (p.id === 'break1' || p.id === 'break2') { if (exportBreaks[p.id]) { subject = ds[p.id] || 'Break'; desc = 'Break Time'; } }
        else if (p.id === 'utility') {
          const wd = ['', '', 'tuesday', 'wednesday', 'thursday'][a.dayOfWeek];
          subject = utilities[wd] || '';
          desc = 'Utility';
        }
        else if (a.dayOfWeek === 1) {
          if (p.id === 'homeroom') { subject = 'PD'; desc = 'Professional Development'; }
          else if (p.id === 'meetings') { subject = 'Meetings'; desc = 'Staff Meetings'; }
        } else if (a.dayOfWeek === 5 && p.id === 'assembly') { subject = 'Assembly'; desc = 'School Assembly'; }
        if (subject) addRow({ subject, date: a.date, start: p.startTime, end: p.endTime, desc });
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

  const handleCellChange = (day, id, value) =>
    setTimetable(prev => ({ ...prev, [day]: { ...prev[day], [id]: value } }));

  const handleUtilityChange = (weekday, value) =>
    setUtilities(prev => ({ ...prev, [weekday]: value }));


  const handleKeyNav = (e, row, cell) => {
    const rows = Array.from(row.parentElement.children);
    const ri = rows.indexOf(row);
    const ci = Array.from(row.children).indexOf(cell);
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      rows[ri + 1]?.children[ci]?.querySelector('input')?.focus(); e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      rows[ri - 1]?.children[ci]?.querySelector('input')?.focus(); e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      row.children[ci - 1]?.querySelector('input')?.focus(); e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      row.children[ci + 1]?.querySelector('input')?.focus(); e.preventDefault();
    }
  };

  const holidayCount = dateAssignments.filter(a => a.holiday).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="logo.png" alt="Parklands College" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Parklands College - Timetable Generator</h1>
              <p className="text-sm text-gray-500 mt-0.5">Build your rotation and export to Google Calendar</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              {saveStatus.saved
                ? <Check size={14} className="text-green-500" />
                : <span className="inline-block w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
              {saveStatus.text}
            </span>
            <button
              onClick={handleClearCalendar}
              className="flex items-center gap-1.5 text-sm text-red-600 border border-red-200 bg-white px-3 py-1.5 rounded-md hover:bg-red-50 cursor-pointer transition-colors"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>

        {/* Timetable grid */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">Timetable Template</h2>
            <p className="text-sm text-gray-500">Enter subjects for each Day 1-7 rotation. Breaks, Assembly and Lines export automatically.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[110px]">Period</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[115px]">Time</th>
                  {[1,2,3,4,5,6,7].map(d => (
                    <th key={d} className="text-center px-3 py-2.5 font-medium text-gray-600 border-r last:border-r-0 border-gray-200 min-w-[88px]">
                      Day {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRID_ROWS.map((period, idx) => {
                  const isLesson = typeof period.id === 'number';
                  return (
                    <tr key={period.id} className={`border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                      <td className="px-4 py-2 border-r border-gray-200 text-gray-700 font-medium whitespace-nowrap">
                        {isLesson ? period.name : (
                          <span className="text-gray-400 text-xs leading-tight">
                            {(period.id === 'break1' || period.id === 'break2') ? (
                              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={exportBreaks[period.id]}
                                  onChange={(e) => setExportBreaks(prev => ({ ...prev, [period.id]: e.target.checked }))}
                                  className="w-3 h-3 cursor-pointer accent-blue-500"
                                />
                                {period.name}
                              </label>
                            ) : (
                              <>
                                {period.name}
                                {period.id === 'utility' && <span className="block text-[10px] text-gray-300">Tue · Wed · Thu</span>}
                              </>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 border-r border-gray-200 text-gray-400 font-mono text-xs whitespace-nowrap">
                        {period.startTime} - {period.endTime}
                      </td>
                      {[1,2,3,4,5,6,7].map(day => (
                        <td key={`${day}-${period.id}`} className="p-1.5 border-r last:border-r-0 border-gray-100">
                          {period.id === 'utility' ? (
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-50 border border-gray-100 min-h-[26px]">
                              <Lock size={9} className="shrink-0 text-gray-300" />
                              <span className="text-xs text-gray-300">see Utilities</span>
                            </div>
                          ) : (period.id === 'break1' || period.id === 'break2') && !exportBreaks[period.id] ? (
                            <div className="px-2 py-1 min-h-[26px]" />
                          ) : (
                            <input
                              type="text"
                              value={timetable[day]?.[period.id] || ''}
                              onChange={(e) => handleCellChange(day, period.id, e.target.value)}
                              onKeyDown={(e) => handleKeyNav(e, e.target.closest('tr'), e.target.closest('td'))}
                              placeholder=""
                              className="w-full px-2 py-1 text-xs text-gray-800 bg-transparent border border-transparent rounded focus:outline-none focus:border-blue-400 focus:bg-white hover:border-gray-300 transition-colors"
                              autoComplete="off"
                              spellCheck="false"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Utilities */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="font-medium text-gray-800">Utilities</h2>
            <p className="text-sm text-gray-500">Enter your utility (club or society) per Day. Only exports when that Day falls on a Tue, Wed, or Thu.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[110px]">Period</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[115px]">Time</th>
                  {['tuesday', 'wednesday', 'thursday'].map(wd => (
                    <th key={wd} className="text-center px-3 py-2.5 font-medium text-gray-600 border-r last:border-r-0 border-gray-200 min-w-[140px] capitalize">
                      {wd}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-r border-gray-200 whitespace-nowrap">
                    <span className="text-gray-400 text-xs">Utility</span>
                  </td>
                  <td className="px-4 py-2 border-r border-gray-200 text-gray-400 font-mono text-xs whitespace-nowrap">
                    {REGULAR_SCHEDULE.find(p => p.id === 'utility').startTime} - {REGULAR_SCHEDULE.find(p => p.id === 'utility').endTime}
                  </td>
                  {['tuesday', 'wednesday', 'thursday'].map(wd => (
                    <td key={wd} className="p-1.5 border-r last:border-r-0 border-gray-100">
                      <input
                        type="text"
                        value={utilities[wd] || ''}
                        onChange={(e) => handleUtilityChange(wd, e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-1 text-xs text-gray-800 bg-transparent border border-transparent rounded focus:outline-none focus:border-blue-400 focus:bg-white hover:border-gray-300 transition-colors"
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Date range */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h2 className="font-medium text-gray-800 mb-3">Term Dates</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label htmlFor="start-date" className="block text-sm text-gray-600 mb-1">Start</label>
              <input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm text-gray-600 mb-1">End</label>
              <input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer"
              />
            </div>
          </div>
          {holidayCount > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-amber-700">
              <AlertCircle size={14} />
              {holidayCount} SA public {holidayCount === 1 ? 'holiday' : 'holidays'} detected and set to No Schedule
            </p>
          )}
        </div>

        {/* Date assignments */}
        {dateAssignments.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-medium text-gray-800">Daily Schedule</h2>
              <span className="text-sm text-gray-500">
                {dateAssignments.length} days · {dateAssignments[dateAssignments.length - 1]?.weekNumber} weeks
              </span>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[65px]">Week</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[100px]">Day</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[105px]">Date</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600 border-r border-gray-200 min-w-[160px]">Schedule</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600 min-w-[120px]">Day #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateAssignments.map((a, index) => {
                      const isFirst = index === 0 || a.weekNumber !== dateAssignments[index - 1].weekNumber;
                      const scheduleType = a.dayOfWeek === 1 ? 'Monday' : a.dayOfWeek === 5 ? 'Friday' : 'Regular';
                      let rowCls = 'border-b border-gray-100 ';
                      if (a.holiday) rowCls += 'bg-amber-50';
                      else if (a.dayOfWeek === 1) rowCls += 'bg-blue-50/40';
                      else if (a.dayOfWeek === 5) rowCls += 'bg-purple-50/30';
                      if (isFirst && index !== 0) rowCls += ' border-t-2 border-gray-300';

                      return (
                        <tr key={a.date} className={rowCls}>
                          <td className="px-4 py-2 border-r border-gray-200 text-xs text-gray-500">
                            {isFirst ? `Wk ${a.weekNumber}` : ''}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200 text-gray-700">{a.dayName}</td>
                          <td className="px-4 py-2 border-r border-gray-200 font-mono text-xs text-gray-600">
                            {new Date(a.date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-2 border-r border-gray-200">
                            {a.holiday ? (
                              <span className="text-xs text-amber-700 font-medium">{a.holiday}</span>
                            ) : (
                              <span className="text-xs text-gray-500">{scheduleType}</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={a.dayNumber}
                              onChange={(e) => updateDayNumber(index, parseInt(e.target.value))}
                              className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
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

        {/* Generate */}
        <div className="flex justify-end pb-2">
          <button
            onClick={generateAndDownload}
            disabled={dateAssignments.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors cursor-pointer"
          >
            <Download size={16} />
            Generate Calendar CSV
          </button>
        </div>

      </div>
    </div>
  );
}
