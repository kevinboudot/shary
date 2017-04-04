const EventEmitter = require( './../../helpers/eventEmitter' );
const request = require( 'request' );

module.exports = class Website extends EventEmitter{

	constructor( options ) {

		super( options );

	}

	send( queue ){

		let _this = this;

		request.post({
			headers: {
				'content-type': 'application/json'
			},
			url: this.options.service,
			body: JSON.stringify( queue )
		}, function( error, response, body ){

			if( error || response.statusCode !== 200 ){
				_this.trigger( 'error', error || response.statusCode );
				return false;
			}

			let info = JSON.parse( body );

			// response :
			// { "link" : 'https://mysite.com/74876589' }

			_this.trigger( 'sent', info.link );

		});

	}

}
