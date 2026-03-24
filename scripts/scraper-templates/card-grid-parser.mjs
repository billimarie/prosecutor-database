// card-grid-parser.mjs

// Node.js scraper template for parsing card/profile grid-based prosecutor directories
// This script handles pagination and extracts name, title, and jurisdiction from card elements.

const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeProsecutorDirectories(url) {
    let page = 1;
    let results = [];
    let hasMorePages = true;

    while (hasMorePages) {
        const response = await axios.get(`${url}?page=${page}`);
        const $ = cheerio.load(response.data);

        // Change the selector below based on the actual HTML structure of the card elements
        $('.card-element').each((index, element) => {
            const name = $(element).find('.card-name').text().trim();
            const title = $(element).find('.card-title').text().trim();
            const jurisdiction = $(element).find('.card-jurisdiction').text().trim();

            results.push({ name, title, jurisdiction });
        });

        // Check if there's a next page
        hasMorePages = $('.pagination .next').length > 0;
        page++;
    }

    return results;
}

// Example usage
// const baseUrl = 'https://example.com/prosecutors';
// scrapeProsecutorDirectories(baseUrl).then(data => console.log(data));

module.exports = scrapeProsecutorDirectories;
