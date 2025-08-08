import dayjs from "dayjs";

/**
 * calculate completed seconds for a single routine item
 */
export function completedSecondsForRoutine(item) {
  const orig = item.originalDurationSeconds || 0;
  const rem = item.remainingSeconds || 0;
  const completed = Math.max(0, orig - rem); // ensure non-negative
  return completed;
}

/**
 * Build stats object from a UserRoutine doc
 * returns: { totalHours, todayHours, longestDayHours, dailyMap, currentStreak, longestStreak }
 */
export function computeStats(userRoutine) {
  const history = userRoutine.history || [];
  const dailyMap = {}; // date -> completed seconds

  let totalSeconds = 0;
  let longestDaySeconds = 0;

  history.forEach((day) => {
    const s = (day.routines || []).reduce(
      (acc, r) => acc + completedSecondsForRoutine(r),
      0
    );
    dailyMap[day.date] = s;
    totalSeconds += s;
    if (s > longestDaySeconds) longestDaySeconds = s;
  });

  // also include today from top-level routines if today isn't yet in history
  const today = dayjs().utc().format("YYYY-MM-DD");
  if (!dailyMap[today]) {
    const todaySeconds = (userRoutine.routines || []).reduce(
      (acc, r) => acc + completedSecondsForRoutine(r),
      0
    );
    if (todaySeconds > 0) {
      dailyMap[today] = todaySeconds;
      totalSeconds += todaySeconds;
      if (todaySeconds > longestDaySeconds) longestDaySeconds = todaySeconds;
    }
  }

  // compute streaks (consecutive days with >0)
  const dates = Object.keys(dailyMap).sort(); // ascending
  let currentStreak = 0,
    longestStreak = 0,
    prevDate = null;
  for (let i = dates.length - 1; i >= 0; i--) {
    const d = dates[i];
    if (dailyMap[d] <= 0) {
      prevDate = null;
      break;
    }
    if (!prevDate) {
      // first day in backwards loop
      currentStreak = 1;
      prevDate = d;
    } else {
      // check if previous day is consecutive
      const prev = dayjs(prevDate).subtract(1, "day").format("YYYY-MM-DD");
      if (d === prev) {
        currentStreak++;
        prevDate = d;
      } else {
        break;
      }
    }
  }
  // compute longest streak overall (simple scan)
  let streak = 0;
  for (let i = 0; i < dates.length; i++) {
    const d = dates[i];
    if (dailyMap[d] > 0) {
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else {
      streak = 0;
    }
  }

  return {
    totalHours: +(totalSeconds / 3600).toFixed(2),
    todayHours: +((dailyMap[today] || 0) / 3600).toFixed(2),
    longestDayHours: +(longestDaySeconds / 3600).toFixed(2),
    dailyMap, // raw seconds per date
    currentStreak,
    longestStreak,
  };
}

/**
 * Small textual SVG badge
 */
export function buildBadgeSVG({ totalHours, todayHours, longestDayHours }) {
  const width = 420;
  const height = 64;
  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="6" fill="#0d1117"/>
  <text x="14" y="22" fill="#adbac7" font-family="Arial, Helvetica, sans-serif" font-size="13">Total hours</text>
  <text x="14" y="44" fill="#0ea5a4" font-family="Arial, Helvetica, sans-serif" font-size="18">${totalHours}h</text>

  <text x="170" y="22" fill="#adbac7" font-family="Arial, Helvetica, sans-serif" font-size="13">Today</text>
  <text x="170" y="44" fill="#7dd3fc" font-family="Arial, Helvetica, sans-serif" font-size="18">${todayHours}h</text>

  <text x="300" y="22" fill="#adbac7" font-family="Arial, Helvetica, sans-serif" font-size="13">Longest day</text>
  <text x="300" y="44" fill="#c7a5ff" font-family="Arial, Helvetica, sans-serif" font-size="18">${longestDayHours}h</text>
</svg>`;
}

/**
 * Build contribution-style 52x7 grid SVG for up to HISTORY_KEEP_DAYS days.
 * dailyMap: { "YYYY-MM-DD": seconds }
 */
export function buildContributionSVG(dailyMap = {}, days = 365) {
  // Build a 52 columns x 7 rows grid (approx for 365 days)
  const cell = 12;
  const padding = 6;
  const gap = 4;
  const cols = Math.ceil(days / 7);
  const width = padding * 2 + cols * (cell + gap);
  const height = padding * 2 + 7 * (cell + gap);

  // convert dailyMap to array of last `days` dates
  const dayjs = require("dayjs");
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(dayjs().utc().subtract(i, "day").format("YYYY-MM-DD"));
  }

  // find max value to normalize color strength
  const values = dates.map((d) => dailyMap[d] || 0);
  const max = Math.max(...values, 1);

  const rects = dates
    .map((date, idx) => {
      const col = Math.floor(idx / 7);
      const row = idx % 7;
      const x = padding + col * (cell + gap);
      const y = padding + row * (cell + gap);
      const v = dailyMap[date] || 0;
      // choose color intensity based on fraction
      const fraction = v / max;
      // map to 5 levels
      const level = Math.min(4, Math.floor(fraction * 5));
      // color palette (darker for more)
      const palette = ["#161b22", "#0f766e", "#047857", "#16a34a", "#a3e635"];
      const color = palette[level];
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${color}">
      <title>${date}: ${(v / 3600).toFixed(2)}h</title>
    </rect>`;
    })
    .join("\n");

  const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${rects}
</svg>`;

  return svg;
}
