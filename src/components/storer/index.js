const EventEmitter = require('./../../helpers/eventEmitter');
const fs = require( 'fs' );
const path = require( 'path' );
const yaml = require( 'js-yaml' );
const Config = yaml.safeLoad( fs.readFileSync( path.join( __dirname, './../../config.yml' ), 'utf8' ) );

class Storer{

	constructor() {

		this.config = Config.storer;

		this.defaults = {
			launchAtStart: true
		};

		this.file = path.join( __dirname + '/../../', this.config.file );
		this.filecontent = fs.readFileSync( this.file, 'utf-8' );
		this.datas = this.filecontent.length ? JSON.parse( this.filecontent ) : this.defaults;

		this.write();

	}

	set( key, val ){

		this.datas[ key ] = val;
		this.write();

	}

	get( key ){

		return this.datas[ key ];

	}

	unset( key ){

		delete this.datas[ key ];

		this.write();

	}


	write(){

		fs.writeFileSync( this.file, JSON.stringify( this.datas ) );

	}

}

module.exports = new Storer();
