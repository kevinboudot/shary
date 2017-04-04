const EventEmitter = require( './../../helpers/eventEmitter' );
const fs = require( 'fs' );
const path = require( 'path' );
const fileType = require( 'file-type' );
const S3 = require( './s3' );
const Website = require( './website' );

module.exports = class Sender extends EventEmitter{

	constructor( options ) {

		super( options );

		this.s3 = new S3( this.options.s3 );
		this.website = new Website( this.options.website );

		this.observe();

	}

	createQueue( files ){

		// queue ID as timestamp

		let id = Date.now();
		let s3 = [];
		let website = [];

		// loop files

		files.forEach( ( localpath, index ) => {

			// get local file infos

			let data = fs.readFileSync( localpath );
			let extension = path.extname( localpath );
			let filename = path.basename( localpath );
			let mimetype = fileType( data )[ 'mime' ];

			// create a final filename (if only one file : "id.ext" else : "id-index.ext")

			let s3Filename = files.length === 1 ? id + extension : id + '-' + index + extension;

			// prepare item for website

			website.push({
				queue: id,
				index: index,
				total: files.length,
				filename: filename,
				extension: extension,
				mimetype: mimetype,
				s3Filename: s3Filename
			});

			// prepare item for s3

			s3.push({
				data: data,
				mimetype: mimetype,
				filename: s3Filename,
				index: index
			});

		});

		// return queue

		return {
			id: id,
			website: website,
			s3: s3
		};

	}

	send( files ){

		// create queue from files

		let queue = this.createQueue( files );

		// send infos to website

		this.website.send( queue.website );

		// treat files to s3

		this.s3.send( queue.s3 );

	}

	observe(){

		// observe s3 events

		this.s3.on( 'error', this.s3ErrorHandler, this );
		this.s3.on( 'sent', this.s3SentHandler, this );

		// observe website events

		this.website.on( 'error', this.websiteErrorHandler, this );
		this.website.on( 'sent', this.websiteSentHandler, this );

	}

	s3ErrorHandler( error ){

		this.trigger( 'error', {
			from: 's3',
			detail: error
		});

	}

	s3SentHandler(){

		this.trigger( 's3-sent' );

	}

	websiteErrorHandler( error ){

		this.trigger( 'error', {
			from: 'website',
			detail: error
		});

	}

	websiteSentHandler( link ){

		this.trigger( 'website-sent', link );

	}

}
