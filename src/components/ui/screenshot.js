const EventEmitter = require( './../../helpers/eventEmitter' );
const { globalShortcut } = require( 'electron' );
const spotlight = require( 'node-spotlight' );

module.exports = class ScreenShot extends EventEmitter{

	constructor( options ) {

		super( options );

		this.paths = [];
		this.checker = null;
		this.iterations = 0;
		this.iterationsLimit = 10;

		this.isEnable = true;

		this.observe();

		this.searchScreenShot( true );

	}

	enable(){
		this.isEnable = true;
	}

	disable(){
		this.isEnable = false;
	}

	observe(){

		let _this = this;

		globalShortcut.register( 'Command+Shift+3' , () => {
			_this.startChecker();
		});

		globalShortcut.register( 'Command+Shift+4' , () => {
			_this.startChecker();
		});

	}

	startChecker(){

		let _this = this;

		this.endChecker();

		this.checker = setInterval( function(){
			_this.searchScreenShot();
			_this.iterations++;
		}, 1000 );

	}

	endChecker(){

		if( this.checker ){
			clearInterval( this.checker );
		}

		this.iterations = 0;

	}

	searchScreenShot( start ){

		let _this = this;

		spotlight( 'kMDItemIsScreenCapture=1', null, [] )
		.on( 'data', function( datas ){

			if( start ){

				_this.paths.push( datas.path );

			} else {

				if( _this.paths.indexOf( datas.path ) === -1 ){

					if( _this.isEnable ){
						_this.trigger( 'screen-shot', datas.path );
					}

					_this.paths.push( datas.path );
					_this.endChecker();

				} else {
					if( _this.iterations >= _this.iterationsLimit ){
						clearInterval( _this.checker );
					}
				}

			}

		})
		.on( 'error', function( error ){
			_this.trigger( 'error', error );
		});

	}

}
