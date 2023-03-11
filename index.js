#!/usr/bin/env node

const http = require("http");
const https = require("https");

process.on("uncaughtException", () => {
  process.exit(0);
});

process.on("unhandledRejection", () => {
  process.exit(0);
});

const url = process.env.CAPROVER_NOTIFY_URL; // Get URL from environment variable
const gitCommitSHA = process.env.CAPROVER_GIT_COMMIT_SHA;
const postData = {
  gitHash: gitCommitSHA,
};

if (!url) {
  console.error(
    "Error: CAPROVER_NOTIFY_URL not provided in environment variable"
  );
  process.exit(0);
}

console.log(`Sending notification to "${url}"`);

const urlInfo = new URL(url);
const options = {
  protocol: urlInfo.protocol,
  hostname: urlInfo.hostname,
  port: urlInfo.port,
  path: urlInfo.pathname + urlInfo.search,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const protocol = options.protocol === "https:" ? https : http;

const req = protocol.request(options, (res) => {
  console.log(
    `Send notification ${
      res.statusCode === 200 ? "success" : "failed"
    } (statusCode: ${res.statusCode})`
  );
});

req.on("error", (error) => {
  console.error(error);
});

req.write(JSON.stringify(postData));
req.end();
