const fs = require("fs");
const csv = require("csv-parser");

/**
 * Parses a CSV file and returns an array of transaction objects.
 * @param {string} filePath - Absolute path to the uploaded CSV file
 * @returns {Promise<Array>} Parsed transactions
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const transactions = [];

    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
      .on("data", (row) => {
        // Normalize whitespace in values
        const normalized = Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
        );
        transactions.push(normalized);
      })
      .on("end", () => resolve(transactions))
      .on("error", (err) => reject(new Error(`CSV parsing failed: ${err.message}`)));
  });
};

/**
 * Deletes a file from disk after processing.
 * @param {string} filePath
 */
const cleanupFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.warn(`Warning: could not delete temp file ${filePath}`);
  });
};

module.exports = { parseCSV, cleanupFile };
