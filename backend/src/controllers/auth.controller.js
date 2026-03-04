const db = require('../config/db');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Email y password son requeridos" });
        }

        // 1. Buscar el usuario
        const userRes = await db.query('SELECT id, email, role, password_hash FROM users WHERE email = $1 AND is_active = true', [email]);
        
        if (userRes.rows.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas o usuario inactivo" });
        }
        
        const user = userRes.rows[0];
        
        // MVP: Comparación simple del password (En prod usar bcrypt)
        if (user.password_hash !== password) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Actualizar último login
        await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

        let profileData = null;
        
        // 2. Si es candidato, buscar su ID de candidato profile (que usamos en frontend)
        if (user.role === 'CANDIDATE') {
             const candidateRes = await db.query('SELECT id, full_name, profile_score FROM candidate_profiles WHERE user_id = $1', [user.id]);
             if (candidateRes.rows.length > 0) {
                 profileData = candidateRes.rows[0];
             }
        }

        // 3. Devolver datos de sesión
        res.json({
            message: "Login exitoso",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                candidate_id: profileData ? profileData.id : null, 
                full_name: profileData ? profileData.full_name : null,
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor en autenticación." });
    }
};
