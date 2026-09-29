const PERIOD_DAYS = {
  week: 7,
  month: 30,
  year: 365
};

export function getCreatedAfterQualifier(period) {
  const days = PERIOD_DAYS[period];
  if (!days) return "";

  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return `created:>=${date.toISOString().slice(0, 10)}`;
}
