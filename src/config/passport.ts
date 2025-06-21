import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/userModel';

const userModel = new UserModel();

// Estrategia local
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const isValid = await userModel.verifyPassword(username, password);
            if (isValid) {
                const user = await userModel.findByUsername(username);
                return done(null, user);
            }
            return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        } catch (error) {
            return done(error);
        }
    }
));

// Estrategia Google OAuth (opcional)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Buscar o crear usuario
            let user = await userModel.findByUsername(profile.emails?.[0].value || '');
            if (!user) {
                // Crear nuevo usuario con Google
                const randomPassword = Math.random().toString(36).slice(-8);
                await userModel.createUser(profile.emails?.[0].value || '', randomPassword);
                user = await userModel.findByUsername(profile.emails?.[0].value || '');
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}

// Serialización del usuario
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Deserialización del usuario
passport.deserializeUser(async (id: number, done) => {
    try {
        const db = await userModel['db']; // Accedemos al db del modelo
        const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
        done(null, user);
    } catch (error) {
        done(error);
    }
});