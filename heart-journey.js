// A small orthographic globe, centred on the Asia-Pacific region.
// City coordinates are longitude / latitude; the route follows a great-circle arc.
const R=211,CX=360,CY=263,rad=Math.PI/180,lon0=130*rad,lat0=9*rad;
const sydney=[151.2093,-33.8688],beijing=[116.4074,39.9042];
function project([lon,lat]){const l=lon*rad-lon0,p=lat*rad;return {x:CX+R*Math.cos(p)*Math.sin(l),y:CY-R*(Math.cos(lat0)*Math.sin(p)-Math.sin(lat0)*Math.cos(p)*Math.cos(l)),visible:Math.sin(lat0)*Math.sin(p)+Math.cos(lat0)*Math.cos(p)*Math.cos(l)>=0}}
function path(points,close=false){let started=false;return points.map(p=>{const q=project(p);if(!q.visible){started=false;return ''}const cmd=started?'L':'M';started=true;return cmd+q.x.toFixed(2)+','+q.y.toFixed(2)}).join(' ')+(close?' Z':'')}
function vector([lon,lat]){const a=lon*rad,p=lat*rad;return [Math.cos(p)*Math.cos(a),Math.sin(p),Math.cos(p)*Math.sin(a)]}
function greatCircle(from,to){const a=vector(from),b=vector(to),angle=Math.acos(a.reduce((s,v,i)=>s+v*b[i],0)),points=[];for(let i=0;i<=80;i++){let t=i/80,k=Math.sin((1-t)*angle)/Math.sin(angle),j=Math.sin(t*angle)/Math.sin(angle),v=a.map((n,i)=>n*k+b[i]*j);points.push([Math.atan2(v[2],v[0])/rad,Math.asin(v[1])/rad])}return points}
const continents=[
[[39,52],[44,61],[60,68],[88,72],[112,73],[141,69],[164,66],[178,60],[170,54],[157,53],[156,47],[145,44],[142,35],[135,34],[128,38],[124,33],[121,25],[115,21],[109,18],[106,10],[101,6],[100,14],[95,17],[91,23],[87,21],[80,8],[76,10],[72,21],[65,25],[58,24],[54,30],[45,33],[42,42]],
[[113,-22],[114,-27],[116,-33],[124,-35],[130,-32],[136,-35],[141,-38],[147,-39],[153,-30],[153,-25],[149,-21],[146,-15],[142,-11],[138,-13],[136,-12],[131,-12],[127,-15],[122,-17],[120,-20]],
[[144,-40],[148,-41],[147,-44],[145,-43]],
[[131,-2],[139,-2],[145,-5],[151,-6],[148,-10],[142,-8],[138,-7]],
[[109,6],[117,7],[119,2],[117,-3],[112,-3],[109,0]],
[[95,5],[99,2],[104,-5],[105,-6],[101,-3]],
[[106,-6],[114,-7],[115,-8],[108,-8]],
[[121,18],[124,17],[125,12],[126,8],[124,7],[121,12]],
[[130,31],[134,34],[137,35],[140,39],[141,43],[144,45],[145,42],[141,38],[139,35],[135,33]],
[[172,-35],[178,-38],[176,-41],[173,-40]],
[[173,-41],[171,-44],[166,-46],[169,-46],[174,-42]]
];
const heart='M0 8 C-3 5-12-1-12-8 C-12-17-3-20 0-13 C3-20 12-17 12-8 C12-1 3 5 0 8Z';
export function globeJourneyHTML(){
const start=project(sydney),end=project(beijing),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const routePoints=greatCircle(sydney,beijing);let route=path(routePoints);const shiftedEnd={x:end.x+11,y:end.y};route=route.replace(/L[-\d.]+,[-\d.]+\s*$/,`L${shiftedEnd.x.toFixed(2)},${shiftedEnd.y.toFixed(2)}`);
const grids=[];for(let lon=-180;lon<=180;lon+=20)grids.push(path(Array.from({length:91},(_,i)=>[lon,-90+i*2])));for(let lat=-60;lat<=60;lat+=20)grids.push(path(Array.from({length:181},(_,i)=>[-180+i*2,lat])));
return `<p class="eyebrow">SYDNEY TO BEIJING</p><div class="journey-stage"><svg class="journey-planet" viewBox="0 0 720 540" role="img" aria-label="悉尼的心沿着路线移向北京，与北京的另一颗心相聚"><title>悉尼的心，去北京</title><defs><radialGradient id="ocean" cx="35%" cy="30%" r="75%"><stop stop-color="#538b88"/><stop offset=".55" stop-color="#285d5b"/><stop offset="1" stop-color="#173f42"/></radialGradient><radialGradient id="airGlow"><stop offset=".82" stop-color="#d8e6ca" stop-opacity="0"/><stop offset=".94" stop-color="#d8e6ca" stop-opacity=".22"/><stop offset="1" stop-color="#d8e6ca" stop-opacity="0"/></radialGradient><linearGradient id="land" x2="1" y2="1"><stop stop-color="#d8d9b3"/><stop offset="1" stop-color="#9cb69a"/></linearGradient><linearGradient id="heartPaint" x2=".7" y2="1"><stop stop-color="#f38a77"/><stop offset="1" stop-color="#bb3f48"/></linearGradient><filter id="heartShadow" x="-80%" y="-80%" width="260%" height="260%"><feDropShadow dy="3" stdDeviation="3" flood-color="#102e33" flood-opacity=".35"/></filter><clipPath id="planetClip"><circle cx="360" cy="263" r="211"/></clipPath><path id="heartRoute" d="${route}"/><g id="heartIcon" filter="url(#heartShadow)"><path d="${heart}" fill="url(#heartPaint)" stroke="#ffceac" stroke-width="1"/><path d="M-8-9Q-8-14-4-13" fill="none" stroke="#ffd4bd" stroke-width="2" stroke-linecap="round"/></g></defs><ellipse cx="360" cy="495" rx="132" ry="11" fill="#153d3c" opacity=".10"/><circle cx="360" cy="263" r="232" fill="url(#airGlow)"/><circle cx="360" cy="263" r="211" fill="url(#ocean)" stroke="#b4c6b0" stroke-width="1.3"/><g clip-path="url(#planetClip)"><g fill="none" stroke="#dce8c3" stroke-opacity=".13" stroke-width=".7">${grids.map(d=>`<path d="${d}"/>`).join('')}</g><g fill="url(#land)" stroke="#e0e5c6" stroke-opacity=".4" stroke-width=".7">${continents.map(p=>`<path d="${path(p,true)}"/>`).join('')}</g></g><path d="${route}" fill="none" stroke="#f7db9b" stroke-width="1.6" stroke-dasharray="3 7" opacity=".65"/><path class="journey-trail" d="${route}" pathLength="1" fill="none" stroke="#ffe2a4" stroke-width="2.4" stroke-linecap="round"/><g transform="translate(${start.x.toFixed(2)} ${start.y.toFixed(2)})"><circle r="4" fill="#f8e3b2"/><circle r="10" fill="none" stroke="#f8e3b2" opacity=".5"/></g><g transform="translate(${end.x.toFixed(2)} ${end.y.toFixed(2)})"><circle r="4" fill="#f8e3b2"/><circle class="journey-arrival" r="17" fill="none" stroke="#ffe3ad" stroke-width="1.5"/></g><use href="#heartIcon" x="${(end.x-11).toFixed(2)}" y="${end.y.toFixed(2)}"/><g class="journey-moving-heart" transform="translate(${reduced?shiftedEnd.x:start.x} ${reduced?shiftedEnd.y:start.y})"><use href="#heartIcon"/></g></svg></div><button class="action secondary" id="replayJourney">再看一次</button>`;
}

// Drive motion from the moment this interaction opens, including every replay.
export function startGlobeJourney(svg){
 const moving=svg.querySelector('.journey-moving-heart'),route=svg.querySelector('#heartRoute'),trail=svg.querySelector('.journey-trail');
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){trail.style.strokeDashoffset='0';return}
 const length=route.getTotalLength(),began=performance.now();
 function frame(now){if(!svg.isConnected)return;const t=Math.max(0,Math.min(1,(now-began-1100)/4800)),e=t*t*(3-2*t),p=route.getPointAtLength(length*e);moving.setAttribute('transform',`translate(${p.x} ${p.y})`);trail.style.strokeDashoffset=String(1-e);if(t<1)requestAnimationFrame(frame)}
 requestAnimationFrame(frame);
}
