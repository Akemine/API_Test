const mysql = require('mysql')
const bodyParser = require('body-parser');
var timeout = require('connect-timeout')

const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || '';

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'tchouki';

const connection = mysql.createConnection({
host, user, password, database, multiStatements: true
})

let commande = 0

module.exports = function(app){


    app.use(bodyParser.json());




    // GET
    // Afficher toutes les commandes
    app.get('/orders', function(req, res){
        connection.query('SELECT * FROM commande INNER JOIN utilisateur ON id_user = fk_user INNER JOIN prix ON commande.type = prix.Type INNER JOIN waiting_list ON fk_statut = id_waitinglist', function(err, data){
            (err) ? res.send(err) : res.json({commande: data})
        })
    })

    // Affiche toutes les commandes d'une personne
    app.get('/orders/:username', function(req, res){
        const {username} = req.params
        connection.query("SELECT * FROM commande INNER JOIN utilisateur ON id_user = fk_user INNER JOIN prix ON commande.type = prix.Type INNER JOIN waiting_list ON fk_statut = id_waitinglist WHERE name_user = '" + username + "'", function(err, data){
            (err) ? res.send(err) : res.json({commande: data})
        })
    })

    // Affiche les utilisateurs ayant déjà passé au moins une commande
    app.get('/users', function(req, res){
        connection.query('SELECT * from utilisateur', function(err, data){
            (err) ? res.send(err) : res.json({commande: data})
        })
    })

    // Affiche les status existants pour les commandes
    app.get('/status', function(req, res){
        connection.query('SELECT * from waiting_list', function(err, data){
            (err) ? res.send(err) : res.json({commande: data})
        })
    })

    // Affiche les prix des differents choix
    app.get('/prix', function(req, res){
        connection.query('SELECT * from prix', function(err, data){
            (err) ? res.send(err) : res.json({commande: data})
        })
    })
    /////////////////////////////////
    // POST
    // Créer une nouvelle commande
    app.post('/addOrder/:username/:description/:type', function(req, res) {
        const {username} = req.params
        const {description} = req.params
        const {type} = req.params

        console.log(username)
        console.log(description)
        console.log(type)

        // connection.query(
        //     "SELECT MAX(id_commande)+1 as idCommande FROM commande",
        //     function (err, data) {
        //         (err) ? res.send(err) : res.json({commande: data})
        //     })


        connection.query("INSERT INTO commande (fk_user, fk_statut, date, demande, type) VALUES" +
            " ((SELECT id_user FROM utilisateur where name_user = '"+username+"')," +
            " 1," +
            " CURRENT_DATE," +
            " '" + description + "'," +
            " '" + type + "')",
            function (err, data) {
                (err) ? res.send(err) : res.json({commande: data})
            })
    })

    // Créer une nouvel utilisateur
    app.post('/addUser/:username', function(req, res) {
        const {username} = req.params
        connection.query("INSERT INTO utilisateur VALUES ((SELECT MAX(id_user)+1 FROM utilisateur),'"+username+"')", function (err, data) {
            (err) ? res.send(err) : res.json({commande: data})
        })
    })

    // Créer un nouveau type de dessin et son prix
    app.post('/addType/:type/:prix', function(req, res) {
        const {type} = req.params
        const {prix} = req.params
        console.log(type)
        console.log(prix)
        connection.query("INSERT INTO prix (Type, prix) VALUES (?, ?)", [type, prix], function (err, data) {
            (err) ? res.send(err) : res.json({commande: data})
        })
    })

    /////////////////////////////////
    // DELETE


    //connection.end();
}


