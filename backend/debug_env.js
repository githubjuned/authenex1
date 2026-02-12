require('dotenv').config();
console.log("NEWSDATA_API_KEY Present:", !!process.env.NEWSDATA_API_KEY);
console.log("Key Start:", process.env.NEWSDATA_API_KEY ? process.env.NEWSDATA_API_KEY.substring(0, 5) : "N/A");
