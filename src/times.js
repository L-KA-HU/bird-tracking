export const tsToDate = ts => new Date(ts * 1000);

export const getTimeRange = (features) => {
  if (!Array.isArray(features) || features.length === 0) return [0, 0];
  let min = Infinity, max = -Infinity;
  for (const f of features) {
    const times = f?.properties?.times || [];
    for (const t of times) {
      if (t < min) min = t;
      if (t > max) max = t;
    }
  }
  if (!isFinite(min) || !isFinite(max)) return [0, 0];
  return [min, max];
};
