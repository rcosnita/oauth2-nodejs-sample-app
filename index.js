var cookieParser = require('cookie-parser')
const express = require("express")
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const SecurityContextService = require("./security").SecurityContextService;
const app = express()
const port = 3000

passport.use(new OAuth2Strategy({
        authorizationURL: "http://localhost/auth/realms/a4/protocol/openid-connect/auth",
        tokenURL: "http://localhost/auth/realms/a4/protocol/openid-connect/token",
        clientID: "example",
        clientSecret: "f98c6122-84b7-4144-a25f-4670ee4e02a8",
        callbackURL: "http://localhost:3000/api/oauth/callback",
        scope: "openid"
    },
    function(accessToken, refreshToken, profile, cb) {
        // TODO(rcosnita) invoke introspect endpoint here in order to decode the token.
        return cb(undefined, accessToken);
    }
));

passport.serializeUser(function(accessToken, done) {
    done(undefined, accessToken);
});

passport.deserializeUser(function(accessToken, done) {
    done(undefined, accessToken);
});

function isUserAuthenticated(req, res, next) {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        res.redirect("/login");
    }

    const securitySvc = new SecurityContextService(accessToken);
    securitySvc.decode().then((securityCtx) => {
        req.securityCtx = securityCtx;
        next();
    });
}

app.use(passport.initialize());
app.use(cookieParser());

app.get("/api/oauth/callback",
    passport.authenticate('oauth2', { failureRedirect: '/login' }), (req, res) => {
    // TODO(rcosnita) extract this from access token response or a constant in code.
    let expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 10);
    res.cookie("access_token", req.user, {expires: expirationDate});
    res.redirect("/dashboard")
});

app.get("/login", passport.authenticate("oauth2"), (req, res) => {

});

app.get("/dashboard", isUserAuthenticated, (req, res) => {
    res.json(req.securityCtx);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});