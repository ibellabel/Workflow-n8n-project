require('dotenv').config();
const { Pool } = require('pg');
const axios = require('axios');

async function runTests() {
    console.log("🚀 Iniciando prueba de conexiones...\n");

    // 1. Test Database
    console.log("⏳ Probando conexión a PostgreSQL...");
    const connString = process.env.DATABASE_URL;
    
    if (!connString) {
        console.error("❌ ERROR: DATABASE_URL no está definida en .env");
    } else {
        const pool = new Pool({
            connectionString: connString,
            ssl: connString.includes('supabase') ? { rejectUnauthorized: false } : false,
            connectionTimeoutMillis: 5000 
        });

        try {
            const res = await pool.query('SELECT NOW()');
            console.log("✅ Conexión exitosa a PostgreSQL. Servidor db retornó:", res.rows[0].now);
        } catch (err) {
            console.error("❌ ERROR: Al conectar a PostgreSQL:", err.message);
        } finally {
            await pool.end();
        }
    }

    console.log("\n-----------------------------------\n");

    // 2. Test N8N Webhook
    console.log("⏳ Probando conexión a Webhook N8N...");
    const webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/cv-upload';
    console.log("URL de prueba:", webhookUrl);
    
    try {
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('candidate_id', 'TEST-001');
        formData.append('expected_salary_cop', '3000000');
        formData.append('city', 'Medellín');
        
        // Un archivo de texto a memoria simulando un CV
        formData.append('cv', Buffer.from('CV Test'), 'test-cv.pdf');

        const response = await axios.post(webhookUrl, formData, { 
            headers: formData.getHeaders(),
            timeout: 5000
        });

        console.log("✅ Conexión exitosa a N8N. El flujo retornó:", response.status, response.statusText);
        console.log("Cuerpo de la respuesta:", response.data);
    } catch (err) {
        if (err.response) {
            console.error(`❌ ERROR: N8N retornó código de error ${err.response.status}`);
            console.error("Detalles:", err.response.data);
            if (err.response.status === 404 && webhookUrl.includes('webhook-test')) {
                console.warn("💡 TIP: Estás llamando a un 'webhook-test'. Asegúrate de estar ejecutando el nodo Webhook en la interfaz web de n8n ('Listen for test event').");
            }
        } else if (err.request) {
            console.error("❌ ERROR: No hubo respuesta de N8N. Posiblemente N8N no está en ejecución en puerto 5678.");
            console.error("Mensaje:", err.message);
        } else {
            console.error("❌ ERROR: Error al hacer la petición a N8N:", err.message);
        }
    }
}

runTests();
