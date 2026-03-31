# Agentic Programming

We are utilizing LLM coding help. This is the document we will use to add AI-generated Implementation Plans.

## Antigravity's Recommendations
> Updated: March 31st, 2026

## Initial Findings (Homepage)
- **Title:** U.S. Prosecutor Database
- **Tagline:** Tracking local, state & federal prosecutors across all 50 states.
- **Records indexed:** 704
- **Search functionality:**
    - Text search (Name, office, jurisdiction)
    - Filter by Role: `All`, `Attorney General`, `District Attorney`, `State Attorney`, `U.S. Attorney`
    - Filter by State: `All`, 50 states + territories.
    - Reset button
- **Content:**
    - Cards representing individual prosecutors.
    - Card info: Role, State, Name, Jurisdiction, Office, unique ID.
- **Navigation:**
    - Header: "CIVIC ACCOUNTABILITY PROJECT" (home link).
    - No obvious footer or other page links.

## Profile Page Findings (e.g., Brad Carlyon)
- **Data displayed:**
    - Name
    - Roles (sometimes duplicated, e.g., "District Attorney · District Attorney")
    - Jurisdiction: State, County / Region.
    - Contact: Website link, Email (often missing), Phone.
    - Notes: (e.g., "Imported from legacy manual CSV. Verify campaign/incarceration evidence before publication.")
- **Missing Data:** No actual case data, election dates, or "accountability" metrics yet.

## Potential Improvements / Missing Features
1. **Data Completeness:** Many "Jurisdiction", "Email", and "Phone" fields are empty or have "—".
2. **Case Analysis:** The goal mentions "analyze each prosecutor's cases", but no case data is visible.
3. **Elections Info:** No election dates or information about the next election.
4. **Accountability Metrics:** No data on incarceration rates, racial disparities, or other accountability metrics.
5. **Interactive Map:** A map of the US to browse by state/county visually.
6. **Contribution/Feedback:** No "Report an Error" or "Submit Data" feature.
7. **About Page:** No information about the project, the team, or the data sources (besides a note about CSV).
8. **UI/UX:**
    - Role title duplication (e.g., "District Attorney · District Attorney").
    - Plain design, could benefit from more visual hierarchy.
    - Search could be enhanced with auto-complete.
9. **Filtering:** No multi-select for roles or states.
10. **Export:** No way to export the data (CSV/JSON).

## Next Steps
1. [x] Check dropdown values for Role and State.
2. [x] Test search functionality.
3. [x] Explore individual prosecutor profile page.
4. [x] Check if there are any hidden pages (e.g., /about, /contact).
5. [x] Finalize recommendations.

## Final Summary
The U.S. Prosecutor Database is a functional prototype for tracking prosecutors. It features a robust search and filtering system on the homepage. However, the profile pages are relatively sparse, lacking the "case analysis" and "accountability" data mentioned in the project goals. The site structure is basic, with no secondary pages like "About" or "Contact" currently implemented.
