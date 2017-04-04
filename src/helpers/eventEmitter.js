module.exports = class EventEmitter {

	constructor( options ) {

		this.options = options;

		this.listeners = new Map();

	}

	on( label, callback, context) {

		callback = context ? callback.bind(context) : callback;

		this.listeners.has( label ) || this.listeners.set( label, [] );
		this.listeners.get( label ).push( callback );

	}

	off( label, callback ) {

		let listeners = this.listeners.get( label );
		let index;

		if ( listeners && listeners.length ) {

			index = listeners.reduce( ( i, listener, index ) => {

				return ( typeof listener == 'function' && listener === callback ) ? i = index : i;

			}, -1 );

			if ( index > -1 ) {

				listeners.splice( index, 1 );
				this.listeners.set( label, listeners );
				return true;

			}

		}

		return false;

	}

	trigger( label, ...args ) {

		let listeners = this.listeners.get( label );

		if ( listeners && listeners.length ) {

			listeners.forEach( ( listener ) => {
				listener.apply( listener, [ ...args ] );
			} );

			return true;

		}

		return false;

	}


}
