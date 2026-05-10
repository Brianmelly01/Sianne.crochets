// This script sets the DATABASE_URL with the @ properly encoded
// then runs prisma db push
const { execSync } = require("child_process");

const password = "Siane@Melly008.";
const encoded = encodeURIComponent(password);
const host = "aws-1-eu-west-3.pooler.supabase.com";
const user = "postgres.fxjtesiecuehiumrdfqu";

const url = `postgresql://${user}:${encoded}@${host}:5432/postgres`;
process.env.DATABASE_URL = url;
process.env.DIRECT_URL = url;

console.log("Using host:", host);
console.log("Encoded password:", encoded);
console.log("Running prisma db push...\n");

try {
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
  });
} catch (e) {
  process.exit(1);
}
