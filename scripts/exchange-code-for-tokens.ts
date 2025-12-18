import { google } from 'googleapis';
import 'dotenv/config';

async function exchangeCode() {
  const code = process.argv[2]; // Get code from command line
  
  if (!code) {
    console.error('❌ Please provide the authorization code');
    console.log('Usage: npx tsx scripts/exchange-code-for-tokens.ts YOUR_CODE');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    'http://localhost'
  );

  try {
    console.log('🔄 Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n✅ Success! Add these to your .env:\n');
    console.log(`GOOGLE_OAUTH_ACCESS_TOKEN="${tokens.access_token}"`);
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN="${tokens.refresh_token}"`);
    console.log(`GOOGLE_OAUTH_TOKEN_EXPIRY="${tokens.expiry_date}"`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 The code might be expired or already used.');
    console.log('Run this to get a new code:');
    console.log('npx tsx scripts/get-oauth-url.ts');
  }
}

exchangeCode();