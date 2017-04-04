const EventEmitter = require( './../../helpers/eventEmitter' );
const Tab = require( './tab' );
const Notifier = require( './notifier' );
const ScreenShot = require( './screenshot' );
const ClipBoard = require( './clipboard' );

module.exports = class Ui extends EventEmitter{

	constructor( options ) {

		super( options );

		this.tab = new Tab( this.options.tab );
		this.notifier = new Notifier( this.options.notifier );
		this.screenshot = new ScreenShot( this.options.screenshot );
		this.clipboard = new ClipBoard( this.options.clipboard );

		this.isBusy = false;

		this.observe();

	}

	giveLink( link ){

		this.tab.setIcon( 'step' );
		this.notifier.play( 'link' );
		this.clipboard.write( link );

	}

	giveSuccess(){

		this.notifier.play( 'upload' );
		this.reset();

	}

	addFiles( files ){

		this.tab.disable();
		this.screenshot.disable();

		this.trigger( 'add-files', files );

	}

	reset(){

		this.tab.enable();
		this.screenshot.enable();
		this.tab.setIcon( 'default' );

	}

	observe(){

		this.tab.on( 'drop-files', this.dropFilesHandler, this );
		this.screenshot.on( 'screen-shot', this.screenShotHandler, this );

		this.notifier.on( 'error', this.notifierErrorHandler, this );
		this.screenshot.on( 'error', this.screenshotErrorHandler, this );

	}

	dropFilesHandler( files ){

		this.addFiles( files );

	}

	screenShotHandler( file ){

		this.tab.setIcon( 'drop' );
		this.addFiles( [file] );

	}

	notifierErrorHandler( error ){

		this.trigger( 'error', {
			from: 'notifier',
			detail: error
		});

	}

	screenshotErrorHandler( error ){

		this.trigger( 'error', {
			from: 'screenshot',
			detail: error
		});

	}

}
