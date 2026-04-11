const authModel = require('./auth.model');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Email y password son requeridos" });
        }

        // 1. Buscar el usuario delegando en el Modelo
        const user = await authModel.findActiveUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas o usuario inactivo" });
        }
        
        // MVP: Comparación simple del password (En prod usar bcrypt)
        if (user.password_hash !== password) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Actualizar último login
        await authModel.updateLastLogin(user.id);

        let profileData = null;
        
        // 2. Si es candidato, buscar su ID de candidato profile delegando en el Modelo
        if (user.role === 'CANDIDATE') {
            profileData = await authModel.findCandidateProfileByUserId(user.id);
        }

        // 3. Devolver datos de sesión (Controller Response)
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
