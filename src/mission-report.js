/** Campaign results are presentation-only. No money, saves or physics change. */
export function missionReport({won,chapter,elapsed,limit,damage=0,impacts=0,routeChoice=null,finalChoice=null,failure=''}={}){
 if(!Number.isInteger(chapter)||chapter<1||chapter>15||!Number.isFinite(elapsed)||elapsed<0||!Number.isFinite(limit)||limit<=0)throw new TypeError('Invalid mission report');
 const safeDamage=Math.max(0,Math.min(100,Number.isFinite(damage)?damage:0));
 const safeImpacts=Math.max(0,Math.trunc(Number.isFinite(impacts)?impacts:0));
 const remaining=Math.max(0,limit-elapsed);
 const pace=elapsed/limit;
 const grade=!won?'SIN CLASIFICAR':pace<=.55&&safeDamage<=20?'S':pace<=.8&&safeDamage<=50?'A':'B';
 const summary=!won?(failure||'Vuelve a intentarlo; los objetivos no se han completado.'):grade==='S'?'Ejecución impecable.':grade==='A'?'Operación completada con solvencia.':'Misión superada. Hay margen para mejorar.';
 const consequence=chapter===14||chapter===15?(finalChoice||'Decisión no registrada'):chapter===8||chapter===9?(routeChoice||'Ruta no registrada'):null;
 return Object.freeze({grade,summary,remaining,elapsed,damage:safeDamage,impacts:safeImpacts,consequence,pace,won});
}

/** One canonical cause for both the result title and its report. */
export function missionFailureTitle({won=false,captured=false,tailLost=0,chapter=1}={}){
 if(won)return 'MISIÓN COMPLETADA';
 if(captured)return 'GAEL HA SIDO DETENIDO';
 if(chapter===7&&tailLost>=9)return 'CONTACTO PERDIDO';
 return 'EL TIEMPO SE AGOTÓ';
}
