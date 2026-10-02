require("dotenv").config()
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const{resume, selfDescription, jobDescription } = require("./src/services/ai.service")


const connectToDB = require ("./src/config/database")
const app =require("./src/app");
const generateInterviewReport = require("./src/services/ai.service");

connectToDB()

// generateInterviewReport({resume, selfDescription, jobDescription})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("app is listening")
})