var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var Paho = require('mqtt')

//******************************************************************************************
//***CONFIGURACION Y USO DE CODIGO MQTT PARA SERVIDOR EN NODE*******************************
//******************************************************************************************

var location = {
				hostname: "m14.cloudmqtt.com",
				port: "10246"
}

// Create a client instance
client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
 
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
 
// connect the client
client.connect({onSuccess:onConnect});
 
 
// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("World");
  message = new Paho.MQTT.Message("Hello");
  message.destinationName = "World";
  client.send(message);
}
 
// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}
 
// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}

//******************************************************************************************


var socketOn = false;

client.on('connect',function(){
	client.subscribe('presence');
	client.publish('presence','Hello mqtt');
	socketOn = true;
	alert("CONECTADO MQTT");
});

client.on('message',function(topic,message){
	console.log(message.toString());
	if(socketOn)
	{
		io.emit('chat message',message.toString());
	}
	// client.end();
});

app.get('/',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/index.html');
});

app.get('/jquery.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/node_modules/jquery/dist/jquery.js');
});

app.get('/d3.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/d3.v3.min.js');
});

app.get('/script.js',function(req,res)
{
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname+'/script.js');
});

app.use(express.static(__dirname+'/public'))

io.on('connection',function(socket)
{
	console.log('a user connected');
	io.on('connection',function(socket){
		socket.broadcast.emit("hi");
	});

	socket.on('disconnect',function(){
		console.log('user disconnected')
	});

	socket.on('chat message',function(msg){
		console.log('message: '+msg);
		io.emit('chat message',msg);
		socketOn = true;
	});
});

http.listen(3000,function()
{
	console.log('listening on *:3000');
});
