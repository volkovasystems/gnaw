"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
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
			"called": "called",
			"child": "child_process",
			"harden": "harden",
			"letgo": "letgo"
		}
	@end-include
*/

var called = require( "called" );
var child = require( "child_process" );
var harden = require( "harden" );
var letgo = require( "letgo" );

var gnaw = function gnaw( command, synchronous ){
	/*;
		@meta-configuration:
			{
				"command:required": "string",
				"synchronous": "boolean"
			}
		@end-meta-configuration
	*/

	if( typeof command != "string" ||
		!command )
	{
		throw new Error( "invalid command" );
	}

	if( synchronous ){
		try{
			var output = child.execSync( command ).toString( "utf8" );

			return output.trim( ).replace( /^\s*|\s*$/gm, "" );

		}catch( error ){
			error = gnaw.resolveError( error );

			if( error ){
				throw error;

			}else{
				return error;
			}
		}

	}else{
		var catcher = letgo.bind( this )( );

		child.exec( command,
			function onExecute( error, output ){
				var cache = catcher.cache;

				if( error ){
					error = gnaw.resolveError( error );

					if( error ){
						cache.error = error;
						cache.result = null;

						cache.callback( error, null );

					}else{
						cache.error = null;
						cache.result = null;

						cache.callback( null, null );
					}

				}else{
					output = output.trim( ).replace( /^\s*|\s*$/gm, "" );

					cache.error = null;
					cache.result = output;

					cache.callback( null, output );
				}
			} );

		return catcher;
	}
};

harden( "resolveError", function resolveError( error ){
	var _error = error.toString( "utf8" ).trim( ).split( "\n" );

	_error = _error.reverse( );
	_error.pop( );
	error = _error.reverse( ).join( "\n" );

	if( error ){
		return new Error( error );

	}else{
		return "";
	}
}, gnaw );

module.exports = gnaw;
