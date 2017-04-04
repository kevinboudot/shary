// Electron's App

const { app } = require( 'electron' );

// config

const fs = require( 'fs' );
const path = require( 'path' );
const yaml = require( 'js-yaml' );
const Config = yaml.safeLoad( fs.readFileSync( path.join( __dirname, './config.yml' ), 'utf8' ) );

// components

const Ui = require( './components/ui' );
const Sender = require( './components/sender' );

class Shary {

	constructor() {

		this.config = Config;

		// listen Electron's app "ready" event

		app.on( 'ready', this.appReadyHandler.bind( this ) );

	}

	appReadyHandler(){

		this.ui = new Ui( this.config.ui );
		this.sender = new Sender( this.config.sender );

		this.observe();

	}

	observe(){

		this.ui.on( 'add-files', this.addFilesHanlder, this);
		this.sender.on( 'website-sent', this.websiteSentHanlder, this);
		this.sender.on( 's3-sent', this.s3SentHanlder, this);

		this.errorHandler = this.errorHandler.bind( this );
		this.ui.on( 'error', this.errorHandler, this);
		this.sender.on( 'error', this.errorHandler, this);

	}

	addFilesHanlder( files ){

		this.sender.send( files );

	}

	websiteSentHanlder( link ){

		this.ui.giveLink( link );

	}

	s3SentHanlder(){

		this.ui.giveSuccess();

	}

	errorHandler( error ){

		console.log( error );

	}

}

new Shary();
