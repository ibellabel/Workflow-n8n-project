const authModel = require('./auth.model');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
                company_id: user.role === 'COMPANY' ? user.id : null,
                candidate_id: profileData ? profileData.id : null, 
                full_name: profileData ? profileData.full_name : null,
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor en autenticación." });
    }
};

exports.registerCandidate = async (req, res) => {
    try {
        const { userId, email, fullName } = req.body;

        if (!userId || !email || !fullName) {
            return res.status(400).json({ error: "userId, email y fullName son requeridos" });
        }

        if (!UUID_REGEX.test(userId)) {
            return res.status(400).json({ error: "userId debe ser un UUID válido" });
        }

        const account = await authModel.createCandidateAccount({
            userId,
            email,
            fullName
        });

        res.status(201).json({
            message: "Candidato registrado correctamente",
            ...account
        });
    } catch (error) {
        console.error("Error registrando candidato:", error);

        if (error.code === '23505') {
            return res.status(409).json({ error: "Ya existe una cuenta con esos datos" });
        }

        res.status(500).json({ error: "No se pudo completar el registro del candidato" });
    }
};

exports.getSessionProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!UUID_REGEX.test(userId)) {
            return res.status(400).json({ error: "userId debe ser un UUID válido" });
        }

        const user = await authModel.findActiveUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "No se encontró un perfil activo para este usuario" });
        }

        let candidateProfile = null;

        if (user.role === 'CANDIDATE') {
            candidateProfile = await authModel.findCandidateProfileByUserId(user.id);
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                company_id: user.role === 'COMPANY' ? user.id : null,
                candidate_id: candidateProfile ? candidateProfile.id : null,
                full_name: candidateProfile ? candidateProfile.full_name : null
            }
        });
    } catch (error) {
        console.error("Error consultando sesión:", error);
        res.status(500).json({ error: "No se pudo consultar la sesión del usuario" });
    }
};

exports.registerCompany = async (req, res) => {
    try {
        const { userId, email, companyName, nit, headquarters } = req.body;

        if (!userId || !email || !companyName || !nit || !headquarters) {
            return res.status(400).json({
                error: "userId, email, companyName, nit y headquarters son requeridos"
            });
        }

        if (!UUID_REGEX.test(userId)) {
            return res.status(400).json({ error: "userId debe ser un UUID válido" });
        }

        const account = await authModel.createCompanyAccount({
            userId,
            email,
            companyName,
            nit,
            headquarters
        });

        res.status(201).json({
            message: "Empresa registrada correctamente",
            ...account
        });
    } catch (error) {
        console.error("Error registrando empresa:", error);

        if (error.code === '23505') {
            return res.status(409).json({ error: "Ya existe una cuenta con esos datos" });
        }

        res.status(500).json({ error: "No se pudo completar el registro de la empresa" });
    }
};
