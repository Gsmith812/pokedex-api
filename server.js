require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');

const app = express();

app.use(morgan('dev'));

app.use(function validateBearerToken (req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN;
    console.log('validate bearer token middleware')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }
    //move to next middleware
    next();
});

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

function handleGetTypes(req, res) {
    res.json(validTypes);
}



app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) {
    const { type, name } = req.query;
    //validate type
    if(type) {
        if(!validTypes.includes(type)) {
            return res.status(400).json({error: `Type must match one of these: ${validTypes.join(', ')}`})
        }
    }
    if(type && name) {
        let results = POKEDEX.pokemon.filter(pokemon => 
            pokemon.type.includes(type) && pokemon.name.toLowerCase().includes(name.toLowerCase())
        );
        return res.json(results);
    }
    if(type && !name) {
        let results = POKEDEX.pokemon.filter(pokemon => pokemon.type.includes(type));
        return res.json(results);
    }
    if(!type && name) {
        let results = POKEDEX.pokemon.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()));
        return res.json(results);
    }
}

app.get('/pokemon', handleGetPokemon);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});