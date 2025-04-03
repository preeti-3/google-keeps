const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "db.json");

const readDb = () => {
    const data = fs.readFileSync(dbPath);  // sync read 
    return JSON.parse(data);
};

// Write the data to db.json [CREATE]
const writeDb = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = { writeDb, readDb };