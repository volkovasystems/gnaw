
const assert = require( "assert" );
const gnaw = require( "./gnaw.js" );

assert.deepEqual( gnaw( "ls", true ).split( /\s/ ), [
	"gnaw.js",
	"gnaw-test.js",
	"node_modules",
	"package.json",
	"README.md",
	"yarn.lock"
], "should be deeply equal" );

gnaw( "ls" )
	( function done( error, result ){
		assert.deepEqual( result.split( /\s/ ), [
			"gnaw.js",
			"gnaw-test.js",
			"node_modules",
			"package.json",
			"README.md",
			"yarn.lock"
		], "should be deeply equal" );

		console.log( "ok" );
	} );

gnaw( "lsx" )
	( function done( error, result ){
		assert.equal( error instanceof Error, true, "should be error" );

		console.log( "ok" );
	} );

const letgo = require( "letgo" );
let self = { "hello": "world" }
let catcher = letgo.bind( self )( gnaw.bind( self )( "ls" ) )
	.push( function callback( error, result ){
		console.log( "callback", arguments );

		return catcher.pass( error, result );
	} );

catcher( function callback( ){
	console.log( "callback 2", arguments );
} );
