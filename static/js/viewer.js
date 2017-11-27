String.prototype.format = function () {
  let content = this;
  for ( let i = 0; i < arguments.length; i++ ) {
    content = content.replace( "{" + i + "}", arguments[i] );
  }
  return content;
};

$( function () {
  const $preparing = $( '#preparing' );
  const $ready = $( '#ready' );

  const preparing_template = `<li class="list-group-item bg-warning">
        <h1 class="align-middle font-weight-bold">{0}</h1>
    </li>`;
  const ready_template = `<li class="list-group-item bg-success">
        <h1 class="align-middle font-weight-bold">{0}</h1>
    </li>`;

  const socket = io();

  socket.on( 'update', function ( orders ) {
    $preparing.html( "" );
    orders.preparing.forEach( ( element ) => {
      $preparing.append( preparing_template.format( element ) );
    } );
    $ready.html( "" );
    orders.ready.forEach( ( element ) => {
      $ready.append( ready_template.format( element ) );
    } );
  } );

} );