// Reusable Node.js scraper template for parsing HTML table-based prosecutor directories

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Fetch data from a URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string>} - The HTML response.
 */
async function fetchData(url) {
    const response = await axios.get(url);
    return response.data;
}

/**
 * Extract rows from the HTML table.
 * @param {Cheerio} $ - The cheerio object.
 * @param {string} tableSelector - Selector for the target table.
 * @returns {Array} - Array of rows data.
 */
function extractRows($, tableSelector) {
    const rows = [];
    $(tableSelector).find('tr').each((index, element) => {
        const rowData = [];
        $(element).find('td').each((i, cell) => {
            rowData.push($(cell).text().trim());
        });
        if (rowData.length) rows.push(rowData);
    });
    return rows;
}

/**
 * Parse the cells of a table row.
 * @param {Array} row - The row data.
 * @returns {Object} - Parsed row object.
 */
function parseRow(row) {
    return { 
        // Assuming the row has specific structure, modify as needed:
        name: row[0],
        title: row[1],
        email: row[2],
    };
}

/**
 * Convert extracted data to CSV format.
 * @param {Array} data - Extracted data.
 * @returns {string} - CSV formatted string.
 */
function convertToCSV(data) {
    return data.map(row => row.join(',')).join('\n');
}

/**
 * Main scraper function to orchestrate the process.
 * @param {string} url - The URL of the pitcher directory.
 * @param {string} tableSelector - The selector for the HTML table.
 * @returns {Promise<void>} - Promise that resolves when complete.
 */
async function main(url, tableSelector) {
    const html = await fetchData(url);
    const $ = cheerio.load(html);
    const rows = extractRows($, tableSelector);
    const parsedData = rows.map(parseRow);
    const csvOutput = convertToCSV(parsedData);
    fs.writeFileSync('output.csv', csvOutput);
}

// Example usage:
// main('http://example.com/prosecutor-directory', 'table.some-class');
