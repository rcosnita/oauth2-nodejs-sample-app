class SecurityContext {
    constructor(scopes, user, accessToken) {
        this._scopes = scopes;
        this._user = user;
        this._accessToken = accessToken;
    }

    get scopes() {
        return this._scopes;
    }

    get user() {
        return this._user;
    }

    get accessToken() {
        return this._accessToken;
    }

    toJSON() {
        return {
            accessToken: this.accessToken,
            scopes: this.scopes,
            user: this.user
        }
    }
}

class SecurityContextService {
    constructor(accessToken) {
        this._accessToken = accessToken;
    }

    get accessToken() {
        return this._accessToken;
    }

    decode() {
        return new Promise((complete, reject) => {
            // TODO(rcosnita) replace this with an actual fetch of the user information (/introspect endpoint).
            complete(new SecurityContext(
                ["a", "b", "c"],
                {"firstName": "Radu Viorel", "lastName": "Cosnita"},
                this._accessToken));
        });
    }
}

module.exports = {
    SecurityContext: SecurityContext,
    SecurityContextService: SecurityContextService,
};