"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "gnaw",
			"path": "gnaw/gnaw.js",
			"file": "gnaw.js",
			"module": "gnaw",
			"author": "Richeve S. Bebedor",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/gnaw.git",
			"test": "gnaw-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Consumes the command returns the output.

		Optional synchronous flag can be set for synchronous execution.

		A callback catching function will be return to pass a callback for the result.
	@end-module-documentation

	@include:
		{
			"clazof": "clazof",
			"child": "child_process",
			"depher": "depher",
			"falzy": "falzy",
			"harden": "harden",
			"letgo": "letgo",
			"optall": "optall",
			"protype": "protype",
			"raze": "raze",
			"truly": "truly",
			"zelf": "zelf"
		}
	@end-include
*/

const clazof = require( "clazof" );
const child = require( "child_process" );
const depher = require( "depher" );
const falzy = require( "falzy" );
const harden = require( "harden" );
const letgo = require( "letgo" );
const optall = require( "optall" );
const protype = require( "protype" );
const raze = require( "raze" );
const truly = require( "truly" );
const zelf = require( "zelf" );

harden( "AND", Symbol.for( "and" ) );
harden( "OR", Symbol.for( "or" ) );
harden( "PIPE", Symbol.for( "pipe" ) );

const AND_SEPARATOR = " && ";
const OR_SEPARATOR = " || ";
const PIPE_SEPARATOR = " | ";

const resolveError = function resolveError( error ){
	/*;
		@meta-configuration:
			{
				"error:required": Error
			}
		@end-meta-configuration
	*/

	let issue = error.toString( "utf8" ).trim( ).split( "\n" );

	issue = issue.reverse( );
	issue.pop( );
	error = issue.reverse( ).join( "\n" );

	if( truly( error ) ){
		return new Error( error );

	}else{
		return "";
	}
};

const resolveOutput = function resolveOutput( output ){
	/*;
		@meta-configuration:
			{
				"output:required": "string"
			}
		@end-meta-configuration
	*/

	if( !protype( output, STRING ) ){
		throw new Error( "invalid output string" );
	}

	return output.trim( ).replace( /^\s*|\s*$/gm, "" );
};

const gnaw = function gnaw( command, synchronous, separator, option ){
	/*;
		@meta-configuration:
			{
				"command:required": "string",
				"synchronous": "boolean",
				"separator": "symbol",
				"option": "object"
			}
		@end-meta-configuration
	*/

	let parameter = raze( arguments );

	separator = depher( parameter, SYMBOL, AND );

	command = optall( parameter, STRING )
		.join( ( separator === OR )?
					OR_SEPARATOR :
				( separator === PIPE )?
					PIPE_SEPARATOR :
					AND_SEPARATOR );

	synchronous = depher( parameter, BOOLEAN, false );

	option = depher( parameter, OBJECT, { } );

	if( falzy( command ) || !protype( command, STRING ) ){
		throw new Error( "invalid command" );
	}

	if( synchronous ){
		try{
			return resolveOutput( child.execSync( command, option ).toString( "utf8" ) );

		}catch( error ){
			error = resolveError( error );

			if( clazof( error, Error ) ){
				throw error;

			}else{
				return "";
			}
		}

	}else{
		let catcher = letgo.bind( zelf( this ) )( function later( cache ){
			child.exec( command, option,
				function done( error, output ){
					if( clazof( error, Error ) ){
						error = resolveError( error );

						if( clazof( error, Error ) ){
							cache.callback( error, "" );

						}else{
							cache.callback( null, "" );
						}

					}else{
						cache.callback( null, resolveOutput( output ) );
					}

					catcher.release( );
				} );
		} );

		return catcher;
	}
};

module.exports = gnaw;
