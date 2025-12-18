import { google } from "googleapis";
import open from "open";
import "dotenv/config";

async function main() {
  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    throw new Error("Missing AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET");
  }

  const client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    "http://localhost"
  );

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive"],
  });

  console.log("Opening browser...");
  console.log(url);

  await open(url);
}

main().catch(console.error);
