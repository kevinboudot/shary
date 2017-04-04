const EventEmitter = require('./../../helpers/eventEmitter');
const { app, Tray, Menu } = require( 'electron' );
const fs = require( 'fs' );
const path = require( 'path' );
const AutoLaunch = require( 'auto-launch' );
const Storer = require( './../storer' );

module.exports = class Tab extends EventEmitter{

	constructor( options ) {

		super( options );

		this.icons = {
			default: path.join( __dirname, '/../../..' + this.options.icons.default ),
			drag: path.join( __dirname, '/../../..' + this.options.icons.drag ),
			drop: path.join( __dirname, '/../../..' + this.options.icons.drop ),
			step: path.join( __dirname, '/../../..' + this.options.icons.step )
		};

		this.isEnable = true;

		this.hideDockIcon();
		this.createAutolaunch();
		this.createTray();
		this.createMenu();

		this.observe();

	}

	hideDockIcon(){

		app.dock.hide()

	}

	createAutolaunch(){

		this.autolaunch = new AutoLaunch({
			name: 'Share'
		});

		if( Storer.get( 'launchAtStart' ) ){
			this.autolaunch.enable();
		}

	}

	// https://github.com/electron/electron/blob/master/docs/api/tray.md

	createTray(){

		this.tray = new Tray( this.icons.default );
		this.tray.setToolTip( this.options.tooltip );

	}

	createMenu(){

		let _this = this;

		this.menu = Menu.buildFromTemplate([
			{
				label: 'Launch at start',
				type: 'checkbox',
				checked: Storer.get( 'launchAtStart' ),
				click( item ){
					Storer.set( 'launchAtStart', item.checked );
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Quit',
				click(){
					app.quit();
				}
			}
		]);

		//Storer

		this.tray.setContextMenu( this.menu );

	}

	enable(){
		this.isEnable = true;
	}

	disable(){
		this.isEnable = false;
	}

	observe(){

		this.dragEnterHandler = this.dragEnterHandler.bind( this );
		this.tray.on( 'drag-enter', this.dragEnterHandler );

		this.dragLeaveHandler = this.dragLeaveHandler.bind( this );
		this.tray.on( 'drag-leave', this.dragLeaveHandler );

		this.dragEndHandler = this.dragEndHandler.bind( this );
		this.tray.on( 'drag-end', this.dragEndHandler );

		this.dragDropHandler = this.dragDropHandler.bind( this );
		this.tray.on( 'drop', this.dragDropHandler );

		this.dragDropFileHandler = this.dragDropFileHandler.bind( this );
		this.tray.on( 'drop-files', this.dragDropFileHandler );

	}

	dragEnterHandler(){

		if(this.isEnable){
			this.setIcon( 'drag' );
		}

	}

	dragLeaveHandler(){

		this.setIcon( 'default' );

	}

	dragEndHandler(){

	}

	dragDropHandler(){

		if(this.isEnable){
			this.setIcon( 'drop' );
		}

	}

	dragDropFileHandler( event, files ){

		if(this.isEnable){
			this.trigger( 'drop-files', files );
		}

	}

	setIcon( mode ){

		this.tray.setImage( this.icons[mode] );

	}

	destroy(){

		// this.tray.off( 'drag-enter', this.dragEnterHandler );
		// this.tray.off( 'drag-leave', this.dragLeaveHandler );
		// this.tray.off( 'drag-end', this.dragEndHandler );
		// this.tray.off( 'drop', this.dragDropHandler );
		// this.tray.off( 'drop-files', this.dragDropFileHandler );

		// this.tray.destroy();

	}

}
