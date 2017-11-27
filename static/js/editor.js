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
  const global_orders = {
    preparing: [],
    ready: []
  };

  const preparing_template = `<li class="list-group-item bg-warning">
        <h3 class="align-middle font-weight-bold">{0}</h3>
        <input class="move_button btn btn-dark float-right" type="button" value="Ready">
    </li>`;
  const ready_template = `<li class="list-group-item bg-success">
        <h3 class="align-middle font-weight-bold">{0}</h3>
        <input class="remove_button btn btn-dark float-right" type="button" value="Dismiss">
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
    global_orders.preparing = orders.preparing;
    global_orders.ready = orders.ready;
  } );

  $preparing.on( 'click', '.move_button', function ( event ) {
    socket.emit( 'move', event.target.previousElementSibling.innerText );
  } );

  $ready.on( 'click', '.remove_button', function ( event ) {
    socket.emit( 'remove', event.target.previousElementSibling.innerText );
  } );

  const $add_button = $( '#add_button' );
  const $id = $( '#id' );
  $id.tooltip( {
    title: "Please check your input",
    trigger: 'manual'
  } );

  // TODO add tooltips
  // const error_reasons = {
  //   isNaN: "It is not a number!",
  //   isEmpty: "The field is empty!",
  //   isIn: "ID is already in the list!"
  // };
  // const show_tooltip = ( message ) => {
  //   $id.attr( 'title', message )
  //     .tooltip( 'fixTitle' )
  //     .tooltip( 'show' );
  //   setTimeout( () => {
  //     $id.tooltip( 'hide' );
  //   }, 1000 );
  // };

  $add_button.on( 'click', function () {
    let value = $id.val();
    if ( isNaN( value ) || value === "" || global_orders.preparing.indexOf( +value ) !== -1 || global_orders.ready.indexOf( +value ) !== -1 ) {
      $id.tooltip( 'show' );
      setTimeout( () => {
        $id.tooltip( 'hide' );
      }, 1000 );
    } else {
      socket.emit( 'add', value );
    }
  } );
} );