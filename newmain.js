var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended : false});

var port    =   process.env.PORT || 8080;

// MySQL connection
var mysql = require ('mysql');
var connection = mysql.createConnection({
   host     : 'localhost',
   port     : '3128',
   user     : 'root',
   password : 'kvvj2703',
   database : 'mydb1'
});

connection.connect();

//Displays index.htm on web

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "translog.htm" );
 })


 //POST response


app.post('/charge', urlencodedParser, function(req, res){

switch(req.body.id){

  case 'kc' :
    name="Kartik";
    offence="Canteen";
    break;
  case 'kr' :
    name="Kartik";
    offence="Running";
    break;
  case 'yc' :
    name="Yash";
    offence="Canteen";
    break;
  case 'yr' :
    name="Yash";
    offence="Running";
    break;
  case 'sc' :
    name="Sasank";
    offence="Canteen";
    break;
  case 'sr' :
    name="Kartik";
    offence="Running";
    break;
}
var oquery="insert into logs values(null,'" + name + "','" + offence + "', 50)";
connection.query(oquery);

  res.json(' you are charged for ');

})

//POST response for right section of the app
 app.post('/calculate', urlencodedParser, function(req,res){

   var gt="select SUM(penalty) as total from logs";
   var kt="select SUM(penalty)  as kvshare from logs where Name = 'Kartik'";
   var yt="select SUM(penalty)  as yashare from logs where Name = 'Yash'";
   var st="select SUM(penalty) as sashare from logs where Name = 'Sasank'";
   var data_total=0;
   var data_kartik=0;
   var data_yash=0;
   var data_sasank=0;
connection.query(gt, function(err,trows){
  connection.query(kt, function(err,krows){
    connection.query(yt, function(err,yrows){
      connection.query(st, function(err,srows){
        var json_data ={"rtotal" : trows[0].total, "ktotal" : krows[0].kvshare, "ytotal" : yrows[0].yashare, "stotal" : srows[0].sashare  }
        res.json(json_data);

      });
    });
  });
});







 })
//POST response for View Transaction Log button
app.post('/translog', urlencodedParser, function(req, res){

var tquery = 'select * from logs where Name="'+ name +'"';

  switch (req.body.trans){
    case 'kt' :
      name='Kartik';
      break;
    case 'yt' :
      name='Yash';
      break;
    case 'st' :
      name='Sasank';
      break;
    case 'gt' :
     name="";
     break;

  }
  if (name!=""){
   connection.query(tquery, function (err, rows, fields) {
     if (!err)
        res.json(rows);

     else
       console.log(err);
   });
 }
 else {
   connection.query(sql, function (err, rows, fields) {
   if (!err)
      res.json(rows);

  else
     console.log(err);
 });
}
})

//POST response for Manage Transaction button



app.post('/example', urlencodedParser, function(req, res){


  connection.query('select * from logs', function(err, rows){
    res.json(rows);
  });

})

function log(req, res) {

  connection.query('select * from logs', function (err, rows){

    res.json(rows);

  })


}
 function del(req, res) {

   connection.query('delete from logs where S_No='+ req.body.serial);

}

app.post('/log', log);
app.post('/del', urlencodedParser, del);






 app.listen(port);
 console.log("app listening to port " + port);
