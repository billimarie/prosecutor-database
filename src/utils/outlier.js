import trendsData from "../data/incarcerationTrends.json";
import stateAverages from "../data/stateAverages.json";
import * as d3 from "d3";

// FIPS Mapping for initial fallback data
const fipsMap = {
  "ga-ocmulgee-harold-mclendon-2024": ["13175", "13167", "13289", "13283"],
  "pa-lebanon-michael-light-2025":    ["42075"],
  "ms-desoto-matthew-barton-2022":    ["28033"],
};

/**
 * Calculates if a prosecutor is an incarceration outlier based on their state average.
 * @param {Object} prosecutor - The prosecutor object.
 * @returns {Object|null} - { type: "high"|"low", label, ratio }
 */
export function getOutlierStatus(prosecutor) {
  if (!prosecutor || !prosecutor.state || !prosecutor.id) return null;

  const fipsList = fipsMap[prosecutor.id] || [];
  if (!fipsList.length) return null;

  const trends = fipsList.map(fips => trendsData[fips] || []).flat();
  if (!trends.length) return null;

  // Calculate local average for latest year (2022)
  const localLatest = d3.groups(trends, d => d.year)
    .map(([year, values]) => ({
      year,
      total: d3.mean(values, v => v.jail + v.prison)
    }))
    .find(d => d.year === 2022);

  if (!localLatest) return null;

  // Get state average for 2022
  const stateTrend = stateAverages[prosecutor.state] || [];
  const stateLatest = stateTrend.find(d => d.year === 2022);

  if (!stateLatest) return null;

  const localTotal = localLatest.total;
  const stateTotal = stateLatest.jail + stateLatest.prison;
  
  if (stateTotal === 0) return null;
  const ratio = localTotal / stateTotal;

  // Thresholds: Lowered for prototype visibility (3% difference)
  if (ratio >= 1.03) return { type: "high", label: "High Incarcerated", ratio };
  if (ratio <= 0.97) return { type: "low", label: "Low Incarcerated", ratio };
  
  return null;
}
