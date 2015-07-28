var express = require('express');
var app     = module.exports = express();
var mysql   = require('mysql');
var ejs     = require('ejs');	
var bodyParser = require('body-parser');

app.use('/static', express.static(__dirname  +'/app/'));
app.use(bodyParser());
app.engine('ejs', ejs.renderFile);
app.set('views','./app/public/views');
app.set('view engine','ejs');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	multipleStatements: true
	// ,debug:true
});


connection.connect(function(err){
	if(err) throw err;

	console.log('connection with db open');
});

connection.query('CREATE DATABASE IF NOT EXISTS test01 DEFAULT CHARACTER SET UTF8 DEFAULT COLLATE utf8_general_ci', function(err) {
	if (err) throw err;

	console.log('create database');
});

connection.changeUser({database:'test01'}, function(err){
	if (err) throw err;
	console.log('change databse');
});

connection
.query('CREATE TABLE IF NOT EXISTS Usuarios( UsuID INT NOT NULL AUTO_INCREMENT, UsuNombre VARCHAR (50) NOT NULL, UsusPass VARCHAR (50) NOT NULL, PRIMARY KEY(UsuID));'
	+'CREATE TABLE IF NOT EXISTS Producto ( ProID VARCHAR (5), ProDesc Varchar (50), ProValor DECIMAL(13,3));'
	+'CREATE TABLE IF NOT EXISTS Pedido ( PedID INT AUTO_INCREMENT, PedUsu INT, pedProd INT, pedVrUnit DECIMAL(13,2), PedCant FLOAT, PedSubTot DECIMAL(13,2), PedIva FLOAT, PedTotal DECIMAL(13,2), PRIMARY KEY(PEdID));',
function(err, results){
	if(err) throw err;
	console.log('create tables');

});
connection
.query('DROP TRIGGER IF EXISTS `validation_user`; CREATE TRIGGER `validation_user` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN IF NEW.UsuNombre REGEXP "[^a-zA-Z0-9_ ]" THEN SET NEW.UsuNombre = UsuNombre; END IF; END',
	function(err, results){
	if(err) throw err;
	console.log('create trigger');

});

app.get('/', function(req, res){
	res.render('index');
});

app.post('/', function(req, res){
	var query = 'INSERT INTO `test01`.`usuarios` (`UsuID`, `UsuNombre`, `UsusPass`) VALUES (NULL, ?, ?);';
	connection.query(query,[req.body.nombre, req.body.pass] ,function(err, rows){
		if(err) {
			res.json(err);
		}else{
			res.json(req.body);
		}
	});
});

app.post('/producto', function(req, res){

	var query = 'INSERT INTO `test01`.`producto` (`ProID`, `ProDesc`, `ProValor`) VALUES (?, ?, ?)';
	connection.query(query,[makeid(), req.body.des, req.body.valor] ,function(err, rows){
		if(err) throw err;


		res.json(req.body);
	});
	res.json(req.body);
});



function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.listen(process.env.PORT || 3000);