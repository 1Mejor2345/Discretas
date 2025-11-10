// script.js - Implementación básica de las interacciones y algoritmos.
// Nota: Para instancias grandes algunos algoritmos son lentos. Este demo apunta a mostrar
// funcionamiento, animaciones y el vínculo con matemáticas discretas del curso.

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let points = [];
let dragging = null;
const radius = 6;

const presets = {
  'ecuador': [
    {name:'Quito', x: 400, y: 80, lat:-0.1807, lon:-78.4678},
    {name:'Guayaquil', x: 400, y: 330, lat:-2.17099, lon:-79.92236},
    {name:'Cuenca', x: 330, y: 230, lat:-2.90055, lon:-79.00449},
    {name:'Manta', x: 330, y: 170, lat:-0.95, lon:-80.7167},
    {name:'Loja', x: 300, y: 360, lat:-4.0069, lon:-79.21},
    {name:'Ambato', x: 380, y: 150, lat:-1.25, lon:-78.62},
    {name:'Machala', x: 350, y: 390, lat:-3.26, lon:-79.95},
    {name:'Esmeraldas', x: 250, y: 80, lat:0.999, lon:-79.65},
    {name:'Portoviejo', x: 290, y: 210, lat:-1.05, lon:-80.45},
    {name:'Santo Domingo', x: 320, y: 270, lat:0.253, lon:-79.175}
  ],
  'world': [
    {name:'Quito', x:200,y:100},
    {name:'Lima', x:260,y:150},
    {name:'Bogotá', x:180,y:60},
    {name:'Santiago', x:210,y:380},
    {name:'Buenos Aires', x:340,y:420},
    {name:'São Paulo', x:320,y:300},
    {name:'Mexico City', x:80,y:60},
    {name:'Madrid', x:600,y:80},
    {name:'London', x:640,y:60},
    {name:'New York', x:480,y:60}
  ]
};

function dist(a,b){ // Euclidean distance on canvas coords
  const dx = a.x-b.x, dy = a.y-b.y;
  return Math.hypot(dx,dy);
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // edges will be drawn by animation routines; draw points
  for(let i=0;i<points.length;i++){
    const p = points[i];
    ctx.beginPath();
    ctx.fillStyle = '#0b4686';
    ctx.arc(p.x,p.y,radius,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle='black';
    ctx.font='12px sans-serif';
    ctx.fillText(p.name ? p.name : i+1, p.x+8, p.y+4);
  }
}

canvas.addEventListener('mousedown', (e)=>{
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX-rect.left, my = e.clientY-rect.top;
  for(let i=0;i<points.length;i++){
    const p = points[i];
    if(dist(p,{x:mx,y:my})<12){ dragging = i; return; }
  }
  // create new point
  points.push({x:mx,y:my});
  draw();
});

canvas.addEventListener('mousemove', (e)=>{
  if(dragging===null) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX-rect.left, my = e.clientY-rect.top;
  points[dragging].x = mx; points[dragging].y = my;
  draw();
});

canvas.addEventListener('mouseup', ()=>{ dragging = null; });
canvas.addEventListener('mouseleave', ()=>{ dragging = null; });

document.getElementById('gen').addEventListener('click', ()=>{
  const preset = document.getElementById('preset').value;
  const n = parseInt(document.getElementById('npoints').value) || 8;
  points = [];
  if(preset==='random'){
    for(let i=0;i<n;i++) points.push({x:50+Math.random()*700, y:40+Math.random()*420, name:`P${i+1}`});
  } else if(preset==='ecuador'){
    points = JSON.parse(JSON.stringify(presets['ecuador'])).slice(0,n);
  } else {
    points = JSON.parse(JSON.stringify(presets['world'])).slice(0,n);
  }
  draw();
});

document.getElementById('clear').addEventListener('click', ()=>{ points=[]; draw(); });

/* ---------- Algorithms (implementaciones simples para demo) ---------- */

// Brute force: try all permutations (skip if n too big)
function bruteForceTour(pts){
  const n = pts.length;
  if(n>9) return {tour:null, cost:Infinity, note:'n demasiado grande para fuerza bruta'};
  const idx = Array.from({length:n}, (_,i)=>i);
  let best = null, bestCost = Infinity;
  function next_permutation(a){
    // simple next_permutation implementation
    let i=a.length-2; while(i>=0 && a[i]>=a[i+1]) i--;
    if(i<0) return false;
    let j=a.length-1; while(a[j]<=a[i]) j--;
    [a[i],a[j]]=[a[j],a[i]];
    let l=i+1, r=a.length-1;
    while(l<r){ [a[l],a[r]]=[a[r],a[l]]; l++; r--; }
    return true;
  }
  // start with 0 fixed at position 0 to avoid rotations
  const perm = idx.slice();
  // iterate all permutations but treat tours as circular; we can fix first city to 0
  const others = perm.slice(1);
  function tourCostFromOrder(order){
    let c=0;
    for(let i=0;i<order.length;i++){
      const a=pts[order[i]];
      const b=pts[order[(i+1)%order.length]];
      c+=dist(a,b);
    }
    return c;
  }
  // generate perms of others
  function permute(arr, start=0){
    if(start===arr.length){
      const order = [0,...arr];
      const c = tourCostFromOrder(order);
      if(c<bestCost){ bestCost=c; best=order.slice(); }
      return;
    }
    for(let i=start;i<arr.length;i++){
      [arr[start],arr[i]]=[arr[i],arr[start]];
      permute(arr, start+1);
      [arr[start],arr[i]]=[arr[i],arr[start]];
    }
  }
  permute(others);
  return {tour:best, cost:bestCost, note:'Óptimo (fuerza bruta para n pequeño)'};
}

// Nearest Neighbor
function nearestNeighbor(pts, start=0){
  const n=pts.length;
  const vis=Array(n).fill(false);
  const tour=[];
  let cur=start; tour.push(cur); vis[cur]=true;
  while(tour.length<n){
    let best=null, bestd=Infinity;
    for(let i=0;i<n;i++) if(!vis[i]){
      const d = dist(pts[cur], pts[i]);
      if(d<bestd){ bestd=d; best=i; }
    }
    tour.push(best); vis[best]=true; cur=best;
  }
  // close tour
  let cost=0; for(let i=0;i<n;i++){ cost+=dist(pts[tour[i]], pts[tour[(i+1)%n]]); }
  return {tour,cost};
}

// 2-opt local improvement
function twoOpt(pts, initial){
  // initial: array of indices for tour
  let tour = initial.slice();
  const n = tour.length;
  function tourCost(arr){ let c=0; for(let i=0;i<n;i++) c+=dist(pts[arr[i]], pts[arr[(i+1)%n]]); return c; }
  let improved=true;
  while(improved){
    improved=false;
    for(let i=1;i<n-1;i++){
      for(let k=i+1;k<n;k++){
        // reverse segment i..k
        const newTour = tour.slice(0,i).concat(tour.slice(i,k+1).reverse()).concat(tour.slice(k+1));
        if(tourCost(newTour) < tourCost(tour)){
          tour = newTour; improved=true;
        }
      }
      if(improved) break;
    }
  }
  return {tour, cost: tourCost(tour)};
}

// Prim MST and 2-approx using doubled tree + Euler tour + shortcut
function mst2Approx(pts){
  const n=pts.length;
  const inMST=Array(n).fill(false);
  const key=Array(n).fill(Infinity);
  const parent=Array(n).fill(-1);
  key[0]=0;
  for(let cnt=0;cnt<n;cnt++){
    let u=-1, best=Infinity;
    for(let v=0;v<n;v++) if(!inMST[v] && key[v]<best){ best=key[v]; u=v; }
    if(u===-1) break;
    inMST[u]=true;
    for(let v=0;v<n;v++){
      const w=dist(pts[u],pts[v]);
      if(!inMST[v] && w<key[v]){ key[v]=w; parent[v]=u; }
    }
  }
  // build adjacency
  const adj = Array.from({length:n}, ()=>[]);
  for(let v=1;v<n;v++){
    const u=parent[v];
    if(u>=0){ adj[u].push(v); adj[v].push(u); }
  }
  // Eulerian traversal of doubled tree -> do DFS to create preorder (=walk)
  const visited = Array(n).fill(false);
  const walk=[];
  function dfs(u){
    visited[u]=true; walk.push(u);
    for(const v of adj[u]) if(!visited[v]) dfs(v);
    // when returning, also add u to make Eulerian-like walk (we already push on entry)
  }
  dfs(0);
  // shortcut to get Hamiltonian tour: remove repeated nodes keeping order
  const seen = new Set();
  const tour = [];
  for(const v of walk){
    if(!seen.has(v)){ tour.push(v); seen.add(v); }
  }
  // ensure all nodes present (if isolated nodes existed add them)
  for(let i=0;i<n;i++) if(!seen.has(i)) tour.push(i);
  // compute cost
  let cost=0; for(let i=0;i<tour.length;i++) cost+=dist(pts[tour[i]], pts[tour[(i+1)%tour.length]]);
  return {tour,cost};
}

// Held-Karp DP (bitmask) returning cost and tour (reconstruct)
function heldKarp(pts){
  const n = pts.length;
  if(n>16) return {tour:null, cost:Infinity, note:'n demasiado grande para Held-Karp demo'};
  const ALL = 1<<n;
  const dp = Array.from({length:ALL}, ()=>Array(n).fill(Infinity));
  const parent = Array.from({length:ALL}, ()=>Array(n).fill(-1));
  dp[1<<0][0]=0;
  for(let mask=0; mask<ALL; mask++){
    for(let u=0; u<n; u++){
      if(!(mask & (1<<u))) continue;
      const cur = dp[mask][u];
      if(cur===Infinity) continue;
      for(let v=0; v<n; v++){
        if(mask & (1<<v)) continue;
        const nmask = mask | (1<<v);
        const w = dist(pts[u], pts[v]);
        if(cur + w < dp[nmask][v]){ dp[nmask][v] = cur + w; parent[nmask][v]=u; }
      }
    }
  }
  // close tour
  let best = Infinity, last=-1;
  for(let u=0; u<n; u++){
    const c = dp[ALL-1][u] + dist(pts[u], pts[0]);
    if(c<best){ best=c; last=u; }
  }
  if(best===Infinity) return {tour:null, cost:Infinity};
  // reconstruct
  const tour = [];
  let mask = ALL-1, cur = last;
  while(cur!==-1){
    tour.push(cur);
    const p = parent[mask][cur];
    mask = mask ^ (1<<cur);
    cur = p;
  }
  tour.reverse();
  return {tour, cost:best};
}

/* ---------- Animation & match orchestration ---------- */

function drawTour(tour, color='#ff4500', lineWidth=3, offset=0){
  if(!tour) return;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  for(let i=0;i<tour.length;i++){
    const a=points[tour[i]], b=points[tour[(i+1)%tour.length]];
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}

function visualizeTourAnimated(result, label, color, callback){
  // simple: draw incremental edges with small delay
  const tour = result.tour;
  if(!tour){ if(callback) callback(); return; }
  let i=0;
  const iv = setInterval(()=>{
    draw(); // clear and redraw points
    drawTour(tour.slice(0,i+1), color, 4);
    // also draw full other tours if previously stored
    i++;
    if(i>=tour.length){
      clearInterval(iv);
      // draw full tour solid
      draw(); drawTour(tour, color, 4);
      if(callback) callback();
    }
  }, 300);
}

// orchestrate match
document.getElementById('startMatch').addEventListener('click', async ()=>{
  const selects = Array.from(document.querySelectorAll('.alg-select'));
  const players = selects.map((s,i)=>({name:`Jugador ${i+1}`, alg:s.value}));
  if(points.length<3){ alert('Genera al menos 3 ciudades.'); return; }
  // compute tours per player
  const results = [];
  const log = document.getElementById('matchLog');
  log.innerHTML = 'Ejecución de algoritmos...<br>';
  // run sequentially with animations
  const colors = ['#e53935','#1e88e5','#43a047','#ffb300','#6a1b9a'];
  for(let i=0;i<players.length;i++){
    const p = players[i];
    log.innerHTML += `<b>${p.name}</b> usando <i>${p.alg}</i>...<br>`;
    let res;
    if(p.alg==='bruteforce') res = bruteForceTour(points);
    else if(p.alg==='nearest') res = nearestNeighbor(points,0);
    else if(p.alg==='twoopt'){ const nn = nearestNeighbor(points,0); res = twoOpt(points, nn.tour); }
    else if(p.alg==='mst2approx') res = mst2Approx(points);
    else if(p.alg==='heldkarp') res = heldKarp(points);
    else res = nearestNeighbor(points,0);
    results.push({player:p.name, alg:p.alg, result:res});
    // animate
    await new Promise(r=>visualizeTourAnimated(res, `${p.name}`, colors[i%colors.length], r));
    log.innerHTML += `→ ${p.name}: costo = ${res.cost.toFixed ? res.cost.toFixed(2) : res.cost} <br>`;
  }
  // ranking
  results.sort((a,b)=>a.result.cost - b.result.cost);
  log.innerHTML += `<hr><b>Ranking final:</b><br>`;
  results.forEach((r,idx)=>{ log.innerHTML += `${idx+1}. ${r.player} (${r.alg}) — costo ${r.result.cost.toFixed(2)}<br>`; });
});

/* ---------- UI nav ---------- */
document.getElementById('btn-play').addEventListener('click', ()=>show('play'));
document.getElementById('btn-algos').addEventListener('click', ()=>show('algos'));
document.getElementById('btn-theory').addEventListener('click', ()=>show('theory'));
document.getElementById('btn-caratula').addEventListener('click', ()=>show('caratula'));
function show(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// fill theory list mapping to syllabus (simple)
const theoryItems = [
  {title:'Grafos ponderados, ciclos Hamiltonianos', syllabus:'Unidad 5 (Teoría de grafos)'},
  {title:'Árboles y algoritmos de expansión mínima (Prim, Kruskal)', syllabus:'Unidad 5.2'},
  {title:'Algoritmo del camino más corto (Dijkstra) — uso contrastivo', syllabus:'Unidad 5.3'},
  {title:'Permutaciones y crecimiento factorial (n!)', syllabus:'Unidad 3 (Conteo)'},
  {title:'Principios de multiplicación y suma', syllabus:'Unidad 3.4'},
  {title:'Relaciones y matriz/representación de grafos', syllabus:'Unidad 2.2'},
  {title:'Complejidad y análisis: relaciones de recurrencia para DP (Held–Karp)', syllabus:'Unidad 4'},
  {title:'Demostraciones por inducción y reducción (pruebas de correctitud)', syllabus:'Unidad 1 y 4'},
  {title:'Pigeonhole / principio de casillas (cuando justificar límites)', syllabus:'Unidad 3.4'}
];
const ul = document.getElementById('theoryList');
for(const it of theoryItems){
  const li = document.createElement('li');
  li.innerHTML = `<b>${it.title}</b> — ${it.syllabus}`;
  ul.appendChild(li);
}

draw();
