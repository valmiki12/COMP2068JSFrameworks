## Additional Feature: Keyword Search in Public Data View

### Description
This feature allows users to search through their finances by entering keywords in the search bar. The search is case-insensitive and supports filtering by category or amount.

### How It Works
1. Users enter a keyword in the search bar (e.g., "Rent" or "450").
2. The app displays all matching entries from the user's finances.

### Example
- Searching for "Rent" returns all finance entries with "Rent" in the category.
- Searching for "450" returns all entries with "450" in the amount.

### Technologies Used
- MongoDB's `$regex` operator for flexible search.
- Dynamic query handling in Express.js.

