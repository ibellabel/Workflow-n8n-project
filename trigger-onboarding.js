const axios = require('axios');

async function triggerWebhook() {
    const webhookUrl = 'http://localhost:5678/webhook-test/ingesta-cv';
    console.log("Enviando petición a:", webhookUrl);
    
    try {
        const response = await axios.post(webhookUrl, {
            cv_url: "http://host.docker.internal:8080/cv_simulado.pdf"
        });
        
        console.log("✅ Éxito! El flujo recibió los datos.");
        console.log("Respuesta:", response.data);
    } catch (error) {
        if (error.response) {
            console.error(`❌ Error ${error.response.status}:`, error.response.data);
            if (error.response.status === 404) {
                console.log("💡 El webhook no está activo. Ve a n8n, haz clic en 'Execute Workflow' y vuelve a correr este script inmediatamente.");
            }
        } else {
            console.error("❌ Error de red:", error.message);
        }
    }
}

triggerWebhook();
