# Data Documentation: U.S. Prosecutor Database

This document outlines the data sources, processing logic, and mathematical models used to generate the accountability metrics and visualizations within the platform.

## 📊 Primary Data Source

### Vera Institute of Justice: Incarceration Trends
- **Dataset**: `incarceration_trends_county.csv`
- **URL**: [https://github.com/vera-institute/incarceration-trends](https://github.com/vera-institute/incarceration-trends)
- **Scope**: Longitudinal data on jail and prison populations for every U.S. county from 1970–2024.
- **Usage**: We use the years **2002–2022** to reflect modern prosecutorial terms and provide sufficient historical context.

---

## 🧮 Incarceration Visualizer (D3 Charts)

The trends chart in the [ProsecutorView.vue](file:///src/views/ProsecutorView.vue) visualizes three distinct data streams:

1.  **Local Jail Rate**: The `total_jail_pop_rate` per 100,000 residents for the specific counties in the prosecutor's jurisdiction.
2.  **State Prison Rate**: The `total_prison_pop_rate` per 100,000 residents that originate from that specific jurisdiction.
3.  **State Average (Benchmark)**: The arithmetic mean of the combined incarceration rate across all counties in that state.

### The Math: Local Aggregation
If a prosecutor's jurisdiction covers multiple counties (e.g., a multi-county circuit in GA), the system calculates the **mean** of the rates across all member counties for each year:
$$LocalRate_{year} = \frac{\sum_{i=1}^{n} CountyRate_{i, year}}{n}$$
where $n$ is the number of counties in the jurisdiction.

---

## 🛡️ "High / Low Incarcerated" Badges

Badges represent an automated "Outlier Analysis" that triggers when a jurisdiction significantly deviates from its state's average.

### The Math: Outlier Ratio
The system calculates a **Ratio** based on the most recent validated data year (2022):

$$Ratio = \frac{LocalTotalRate_{2022}}{StateAverageRate_{2022}}$$

### Badge Thresholds
To provide visceral accountability signals while remaining statistically robust, we use the following thresholds:

| Badge Type | Threshold | Logic |
| :--- | :--- | :--- |
| 🔴 **High Incarceration** | **Ratio ≥ 1.03** | Local rate is **3% or more** above the state average. |
| 🟢 **Low Incarcerated** | **Ratio ≤ 0.97** | Local rate is **3% or more** below the state average. |
| ⚪ **No Badge** | **0.97 < Ratio < 1.03** | Performance is within the "normalized" range for that state. |

> [!NOTE]
> These thresholds are intentionally set to trigger for even subtle deviations from the average to ensure that the "unopposed" incumbent status quo is always challenged by comparative data.

---

## 🛠️ Data Pipeline Scripts

- **[ak-scraper.mjs](file:///scripts/pilot-scraping/ak-scraper.mjs)**: Pulls regional Office and Supervising DA names from the Alaska Dept of Law.
- **[fetchIncarcerationData.mjs](file:///scripts/fetchIncarcerationData.mjs)**: The primary engine for downloading, parsing, and filtering the Vera dataset. It generates:
  - `incarcerationTrends.json`: Localized historical data.
  - `stateAverages.json`: Global state-wide benchmarks.
- **[outlier.js](file:///src/utils/outlier.js)**: The centralized logic shared between the home listing and profile pages to ensure badge consistency.
