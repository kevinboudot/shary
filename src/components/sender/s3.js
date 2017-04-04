const EventEmitter = require( './../../helpers/eventEmitter' );
const AWS = require( 'aws-sdk' );

module.exports = class S3 extends EventEmitter{

	constructor( options ) {

		super( options );

		// create client

		AWS.config.update({
			signatureVersion: this.options.signatureVersion,
			credentials: new AWS.Credentials({
				accessKeyId: this.options.key,
				secretAccessKey: this.options.secret
			}),
		});

		this.client = new AWS.S3();

	}

	send( queue ){

		let _this = this;

		queue.forEach( ( item ) => {
			_this.sendFile( item );
		});

	}

	sendFile( item ){

		let params = {
			Bucket: this.options.bucket,
			Body: item.data,
			ContentType: ( item.mimetype ) ? item.mimetype : 'application/octet-stream',
			Key: this.options.path + item.filename,
			ACL: this.options.acl
		};

		let _this = this;

		this.client.upload( params, ( error, payload ) => {

			if( error ){
				_this.trigger( 'error', error );
				return false;
			}

			if( item.index === 0 ){
				_this.trigger( 'sent' );
			}

		});

	}

}
