/** Vehicle roster: distinct physical tuning and original liveries. */
export const CARS=Object.freeze([
 {id:'racer',name:'RACER 04',type:'BALANCED',tag:'Equilibrio y control',color:[235,63,63],accent:[251,245,231],tune:{power:1,topSpeed:1,grip:1,steer:1,brakes:1},body:'stock'},
 {id:'falcon',name:'FALCON GT',type:'SPRINTER',tag:'Aceleración explosiva',color:[57,156,239],accent:[232,244,255],tune:{power:1.18,topSpeed:.97,grip:1,steer:1.04,brakes:1},body:'coupe'},
 {id:'comet',name:'COMET RS',type:'SPEEDSTER',tag:'Velocidad punta',color:[251,184,61],accent:[34,48,69],tune:{power:.89,topSpeed:1.12,grip:.94,steer:.93,brakes:.92},body:'gt'},
 {id:'viper',name:'VIPER XR',type:'CORNER KING',tag:'Dominio de las curvas',color:[79,220,163],accent:[29,56,55],tune:{power:.96,topSpeed:.97,grip:1.26,steer:1.15,brakes:1.1},body:'sport'},
 {id:'nova',name:'NOVA 88',type:'DRIFTER',tag:'Deslizamiento controlado',color:[205,110,235],accent:[245,215,255],tune:{power:1.05,topSpeed:1.02,grip:.79,steer:1.16,brakes:1.04},body:'rally'},
 {id:'blaze',name:'BLAZE V12',type:'HEAVY GT',tag:'Potencia y estabilidad',color:[249,111,77],accent:[255,224,161],tune:{power:1.11,topSpeed:1.06,grip:.93,steer:.87,brakes:1.18},body:'muscle'}
]);
export const getCar=(id)=>CARS.find(c=>c.id===id)||CARS[0];
