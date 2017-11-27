const path = require( 'path' );
const express = require( 'express' );
const app = express();
const http = require( 'http' ).Server( app );
const io = require( 'socket.io' )( http );

app.use( express.static( path.join( __dirname, './static' ) ) );
app.set( 'views', path.join( __dirname, './views' ) );
app.set( 'view engine', 'pug' );

app.get( '/', function ( req, res ) {
  res.render( 'main', { isEditor: false } );
} );

app.get( '/edit', function ( req, res ) {
  res.render( 'main', { isEditor: true } );
} );

const orders = {
  preparing: [1, 2, 3, 4, 5, 6],
  ready: [7, 8, 9, 10, 11, 12]
};

io.on( 'connection', function ( socket ) {
  io.emit( 'update', orders );

  socket.on( 'move', function ( to_move ) {
    orders.preparing.splice( orders.preparing.indexOf( +to_move ), 1 );
    orders.ready.unshift( +to_move );
    io.emit( 'update', orders );
  } );

  socket.on( 'remove', function ( to_remove ) {
    orders.ready.splice( orders.ready.indexOf( +to_remove ), 1 );
    io.emit( 'update', orders );
  } );

  socket.on( 'add', function ( to_add ) {
    orders.preparing.push( +to_add );
    io.emit( 'update', orders );
  } );
} );

http.listen( 8081, function () {
  console.log( 'listening on *:8081' );
} );