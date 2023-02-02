// TODO: Create auth service that will do the following:
const Token = require('../models/token.model');
const tokens = require('../databases/tokens');
const {usersService} = require('./users.service');

const token = require('../models/token.model');

// 1. Create a method that will take in an email and password; based on the email,
//      find the user in the database and compare the password. If the password is correct, then
//      generate a token and store it in the database. If the user already owns a token in
//      the database we have to delete the previous token before creating a new one. and then we have to return the token.


class AuthsService {
    database;
    users;

    constructor(database,usersService) {
        this.database = database;
        this.users = usersService;
    }

    login( email, password ) {
 
        const user = this.users.find().find(user => user.email === email);
        if (!user){
            throw new Error('User not found');
            }

            if(user.password===password){
               const crypto = require('crypto');
               const tok =  crypto.randomBytes(64).toString('hex');
            
               const userID = user.id;

                if(this.findOneOrFail(user.id).id !== undefined ){
                    const token = new Token(user.id, tok);
                    this.delete(userID)
                    tokens.push(token);
                    return tok;
                }
                else{
                    const token = new Token(user.id, tok);
                    this.database.push(token)
                    return tok;
                }
            }
}


    findOneOrFail(id) {

        const user = usersService.find().find(user => user.id === id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    delete(user) {
        this.database.splice(this.database.indexOf(user), 1);
    }

    // 2. Create a method that will take in a token and return the user's who owns the token.
    userByToken(tok){
        
        const tokId = this.database.find(tokId => tokId.token === tok )
        if (!tokId){
            throw new Error('User not found');
            } 
            const user = this.findOneOrFail(tokId.id)
             return {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        
        }
        
    }
    
const authsService = new AuthsService(tokens,usersService);

module.exports = { authsService };

