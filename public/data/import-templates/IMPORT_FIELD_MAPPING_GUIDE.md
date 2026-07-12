# IMPORT FIELD MAPPING GUIDE

This document outlines the field mapping rules for converting common CSV column names from state bar/DA directories to the USPD canonical schema fields.

## Seat-Based Tracking Fields (Required)

| State Bar/DA Directory Column Name | USPD Canonical Schema Field | Description |
|-------------------------------------|-----------------------------|-------------|
| DA Name / Prosecutor Name           | name                        | Full name of the prosecutor |
| State                               | state                       | Two-letter state abbreviation |
| County / Region / Circuit           | county_or_region            | County, region, or judicial circuit |
| Office Title / Role                 | office                      | Official title (e.g., District Attorney) |
| Current Status                      | is_current                  | Boolean: true if currently holding office |
| Seat Identifier                     | seat_id                     | Auto-generated from state + county (format: `{state}-{normalized-county}`) |

## Temporal Fields (For Seat History)

| Column Name                         | USPD Field      | Format |
|-------------------------------------|-----------------|--------|
| Start Date / Term Start             | start_date      | ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ` |
| End Date / Term End                 | end_date        | ISO 8601 or null for current |

## Contact & Office Information

| Column Name                         | USPD Field      |
|-------------------------------------|-----------------|
| Website / URL                       | website         |
| Email                               | email           |
| Phone                               | phone           |
| Office Address                      | office_address  |

## Campaign & Performance Indicators

| Column Name                         | USPD Field            |
|-------------------------------------|-----------------------|
| Campaign Theme / Platform           | campaign_theme        |
| Small Town Focus                    | small_town_focus      |
| Incarceration Signal / Policy       | incarceration_signal  |

## Source & Verification

| Column Name                         | USPD Field            |
|-------------------------------------|-----------------------|
| Source URLs                         | source_urls           |
| Notes / Comments                    | notes                 |
| Last Verified                       | last_verified_at      |

## Seat ID Generation Algorithm

The `seat_id` is automatically generated using this algorithm:

1. Convert state to lowercase
2. Convert county_or_region to lowercase
3. Replace slashes (`/`) with hyphens
4. Replace spaces with hyphens
5. Remove all non-alphanumeric characters (except hyphens)

**Examples:**
- State: `GA`, County: `Laurens / Johnson / Twiggs / Treutlen` → `ga-laurens-johnson-twiggs-treutlen`
- State: `PA`, County: `Lebanon County` → `pa-lebanon-county`
- State: `MS`, County: `DeSoto County` → `ms-desoto-county`

## CSV Import Template

Use the template at `public/data/import-templates/prosecutor-bulk-import-template.csv`:

```csv
id,name,office,jurisdiction,state,county_or_region,seat_id,is_current,start_date,end_date,small_town_focus,campaign_theme,incarceration_signal,source_urls,notes,last_verified_at
```

## Best Practices

1. **One Current Per Seat**: Only ONE prosecutor per seat should have `is_current: true`
2. **Mark Transitions**: When adding a new current prosecutor, mark the previous one as `is_current: false` with an `end_date`
3. **Use Reliable Sources**: Election results, official appointments, news coverage
4. **Document Gaps**: If start/end dates are unknown, leave as empty and note in `notes` field

## Migration Notes

If importing historical data:
- Set `is_current: false` for all previous prosecutors
- Provide `start_date` and `end_date` when known
- Add notes explaining transitions (election loss, appointment, retirement, etc.)

See `MIGRATION_TO_SEAT_TRACKING.md` for detailed migration instructions.