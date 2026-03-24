# IMPORT FIELD MAPPING GUIDE

This document outlines the field mapping rules for converting common CSV column names from state bar/DA directories to the USPD canonical schema fields.

| State Bar/DA Directory Column Name | USPD Canonical Schema Field |
|-------------------------------------|-----------------------------|
| DA Name                             | da_name                     |
| Title                               | title                       |
| Jurisdiction                        | jurisdiction                |
| County                              | county                      |
| Additional Column Names...          | ...                         |

## Mapping Details

- **DA Name**: Maps directly to `da_name`.
- **Title**: Maps to `title` in the schema.
- **Jurisdiction**: Corresponds to `jurisdiction` in the canonical fields.
- **County**: Refers to `county` in the schema.
- **[Additional notes can be included here]**

Please ensure that the mapping aligns with the current version of the USPD schema.