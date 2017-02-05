const gnaw = require( "./gnaw.js" );

console.log( gnaw( "ls", true ) )

gnaw( "ls" )
	( function done( error, result ){
		console.log( arguments );
	} )


gnaw( "lsx" )
	( function done( error, result ){
		console.log( arguments );
	} );
