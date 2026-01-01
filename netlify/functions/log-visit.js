// netlify/functions/log-visit.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
  // 1. Get data from your website's front-end
  const data = JSON.parse(event.body);
  const userId = data.userId || 'anonymous';
  const pageUrl = data.pageUrl;

  // 2. Connect to DB (uses NETLIFY_DATABASE_URL auto-set by Netlify)
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    await client.connect();
    // 3. Save the visit to our table
    const query = 'INSERT INTO site_visits(user_id, page_url) VALUES($1, $2)';
    const values = [userId, pageUrl];
    await client.query(query, values);
    return { statusCode: 200, body: 'Visit logged!' };
  } catch (error) {
    console.error('Database error:', error);
    return { statusCode: 500, body: 'Error logging visit' };
  } finally {
    await client.end();
  }
};
