import {EmbeddedCalculator} from './embedded-calculator.mjs';
// The full URL exposes expression editing; Desmos' ?embed mode is graph-only.
export const DESMOS_EMBED_URL='https://www.desmos.com/calculator';
export class DesmosTool extends EmbeddedCalculator {
  constructor(){super({id:'desmos',title:'Desmos',url:DESMOS_EMBED_URL,link:DESMOS_EMBED_URL});}
}
