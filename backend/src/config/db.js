const { Pool } = require('pg');
require('dotenv').config();

const connString = process.env.DATABASE_URL?.trim();

const pool = new Pool({
    connectionString: connString,
    ssl: connString && connString.includes('supabase') ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000 // 10 seconds timeout
});

// Probar conexión tempranamente
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.warn('⚠️ No se detectó una conexión a PostgreSQL activa.');
        console.warn('Error detail:', err.message);
        console.warn('Los endpoints intentarán usar la base de datos, pero fallarán si no se levanta el servicio pg.');
    } else {
        console.log('✅ Conexión exitosa a PostgreSQL');
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    transaction: async (callback) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};
