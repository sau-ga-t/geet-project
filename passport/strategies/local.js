const { client } = require('../../db/mongo');
const { comparePassword } = require('../../utils/password_utils');

const LocalStrategy = require('passport-local');

const local = new LocalStrategy(
   async function verify(username, password, cb) {
        const userQuery = { userName: username };
        var user = await client.db("users").collection("user").findOne(userQuery);
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        } else {
            comparePassword(password, user['password'], (err, match) => {
                if (!err && match) {
                    return cb(null, user);
                } else {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
            })
        }

    }
);

module.exports = local;