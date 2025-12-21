import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

console.log('[PASSPORT] Initializing strategies...')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err, null)
    }
})

// Google Strategy
if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === '413851872074-50dqt1bt3h5ljbor4gcba8h8nm08v5qd.apps.googleusercontent.com') {
    console.warn('[OAUTH] Google Client ID is missing or using dummy value. Google login will not work.');
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '413851872074-50dqt1bt3h5ljbor4gcba8h8nm08v5qd.apps.googleusercontent.com',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOCSPX-5pUW7H6pUW7H6pUW7H6pUW7H6',
            callbackURL: '/api/auth/google/callback',
            state: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id })

                if (!user) {
                    // Check if user exists with same email
                    user = await User.findOne({ email: profile.emails[0].value })

                    if (user) {
                        user.googleId = profile.id
                        user.oauthProvider = 'google'
                        await user.save()
                    } else {
                        user = await new User({
                            googleId: profile.id,
                            firstName: profile.name.givenName || profile.displayName,
                            lastName: profile.name.familyName || '',
                            email: profile.emails[0].value,
                            role: 'user',
                            oauthProvider: 'google'
                        }).save()
                    }
                }
                return done(null, user)
            } catch (err) {
                return done(err, null)
            }
        }
    )
)

// GitHub Strategy
if (!process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID === 'dummy_id') {
    console.warn('[OAUTH] GitHub Client ID is missing or using dummy value. GitHub login will not work.');
}

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || 'dummy_id',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_secret',
            callbackURL: '/api/auth/github/callback',
            state: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ githubId: profile.id })

                if (!user) {
                    // Check if user exists with same email (GitHub might not provide email if private)
                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`
                    user = await User.findOne({ email })

                    if (user) {
                        user.githubId = profile.id
                        user.oauthProvider = 'github'
                        await user.save()
                    } else {
                        user = await new User({
                            githubId: profile.id,
                            firstName: profile.displayName || profile.username,
                            lastName: '',
                            email,
                            role: 'user',
                            oauthProvider: 'github'
                        }).save()
                    }
                }
                return done(null, user)
            } catch (err) {
                return done(err, null)
            }
        }
    )
)

export default passport
