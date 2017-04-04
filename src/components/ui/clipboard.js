const EventEmitter = require( './../../helpers/eventEmitter' );
const { clipboard } = require( 'electron' );

module.exports = class ClipBoard extends EventEmitter{

	constructor( options ) {

		super( options );
	}

	write( string ){

		clipboard.writeText( string );

	}

	clear(){

		clipboard.clear();

	}

}
