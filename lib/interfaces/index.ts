import { Network, NetworkOptions } from './network';
import { Printer } from './printer';
import { File } from './file';

export type InterfaceT = Network | Printer | File;

export function getInterface ( 
    uri: string | InterfaceT, 
    options: NetworkOptions ): InterfaceT {
    const networkRegex = /^tcp:\/\/([^\/:]+)(?::(\d+))?\/?$/i;
    const printerRegex = /^printer:([^\/]+)(?:\/([\w-]*))?$/i;

    const net       = typeof uri === "string" ? networkRegex.exec( uri ) : null;
    const printer   = typeof uri === "string" ? printerRegex.exec( uri ) : null;

    if ( typeof uri === "object" ) {
        return uri;
    } else if ( net ) {
        return new Network( net[ 1 ], parseInt( net[ 2 ] ), options );
    } else if ( printer ) {
        return new Printer( printer[ 1 ], printer[ 2 ] );
    } else {
        return new File( uri );
    }
}
