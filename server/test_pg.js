const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/diyamgaz'
});

async function testConnection() {
    try {
        await client.connect();
        const res = await client.query('SELECT NOW()');
        console.log('Connection successful!', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await client.end();
    }
}

testConnection();
