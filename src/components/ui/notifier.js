const EventEmitter = require( './../../helpers/eventEmitter' );
const path = require( 'path' );
const playSound = require( 'play-sound' )( opts = {} );

module.exports = class Notifier extends EventEmitter{

	constructor( options ) {

		super( options );

		this.sounds = {
			link: path.join( __dirname, '/../../..' + this.options.sounds.link ),
			upload: path.join( __dirname, '/../../..' + this.options.sounds.upload )
		};

	}

	play( mode ){

		let _this = this;

		playSound.play( this.sounds[ mode ], function( error ){
			if( error ){
				_this.trigger( 'error', error );
			}
		});

	}

}
