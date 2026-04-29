const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.uagnuhefmfdnjuvofqcf:N8NWFBack2245@aws-0-us-west-2.pooler.supabase.com:6543/postgres' });

async function test() {
    try {
        const query = 'UPDATE candidate_profiles SET profile_score = $1, feedback_notes = $2, expected_salary_cop = $3, location_city = $4, work_preferences = $5, parsed_cv_data = $6, updated_at = NOW() WHERE id = $7';
        const values = [80, 'Test', 6000000, 'Bogota', 'Híbrido', { skills: ['Python'] }, '98796621-ca93-460d-9cd4-f53c518d6df1'];
        await pool.query(query, values);
        console.log('OK');
    } catch (e) {
        console.error('ERROR:', e.message);
    }
    pool.end();
}
test();
