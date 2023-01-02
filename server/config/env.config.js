const env = process.env;

module.exports = {
    "httpPort": parseInt(env.HTTP_PORT, 10) || 3000,
    "httpsPort": parseInt(env.HTTPS_PORT, 10) || 4443,
    "jwt_secret": env.JWT_SECRET,
    "jwtExpiration": parseInt(env.JWT_EXPIRE_TOKEN, 10) || 3600,           // 1 hour
    "jwtRefreshExpiration": parseInt(env.JWT_REFRESH_TOKEN, 10) || 86400,   // 24 hours
    "dbCnf": {
        "dialect": env.DIALECT,
        "dbName": env.DEFAULT_DB_DATABASE,
        "dbConfig": {
            "server": env.DEFAULT_DB_SERVER,
            "pool": {
                "max": 10,
                "min": 0,
                "idleTimeoutMillis": 30000
            },
            "options": {
                "port": parseInt(env.DEFAULT_DB_PORT, 10),
                "database": env.DEFAULT_DB_DATABASE,
                "encrypt": false, // for azure
                "trustServerCertificate": true, // change to true for local dev / self-signed certs
                "requestTimeout": parseInt(process.env.DB_REQUESTTIMEOUT, 10) || 30000,
                // "cryptoCredentialsDetails": {
                //     "minVersion": 'TLSv1'
                // }
            },
            "authentication": {
                "type": "default",
                "options": {
                    "userName": env.DEFAULT_DB_USER,
                    "password": env.DEFAULT_DB_PASSWORD
                }
            }
        }
    },
    "emailFrom": env.E_FROM,
    "smtpOptions": {
        "host": env.E_HOST,
        "port": parseInt(env.E_PORT, 10) || 465,
        "auth": {
            "user": env.E_USER,
            "pass": env.E_PASS
        }
    }
};