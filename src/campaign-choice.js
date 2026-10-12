/** CHASE 404 · route decision from mission 08, versioned local storage. */
export const ROUTE_KEY='chase404.campaign.choice.v1';
export const VALID_ROUTES=Object.freeze(['AVENIDA OESTE','CALLE DE SERVICIO']);
export function readRoute(storage){try{const item=JSON.parse(storage.getItem(ROUTE_KEY));return item?.version===1&&VALID_ROUTES.includes(item.route)?item.route:null;}catch{return null;}}
export function writeRoute(storage,route){if(!VALID_ROUTES.includes(route))return false;try{storage.setItem(ROUTE_KEY,JSON.stringify({version:1,route}));return true;}catch{return false;}}
