// pdf-extractor.mjs

import fs from 'fs';
import pdf from 'pdf-parse';

// Function to extract data from a PDF file
const extractDataFromPDF = (filePath) => {
    return new Promise((resolve, reject) => {
        let dataBuffer = fs.readFileSync(filePath);
        pdf(dataBuffer).then(function(data) {
            // Here you can implement your pattern extraction logic
            const extractedData = {
                title: data.text.match(/Title: (.+)/)[1],
                date: data.text.match(/Date: (\d{4}-\d{2}-\d{2})/)[1],
                prosecutor: data.text.match(/Prosecutor: (.+)/)[1],
                // Add more fields as per your requirement
            };
            resolve(extractedData);
        }).catch(reject);
    });
};

// Sample usage
const pdfPath = 'path/to/pdf';

extractDataFromPDF(pdfPath).then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
});
