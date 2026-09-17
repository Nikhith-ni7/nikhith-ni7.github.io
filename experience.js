(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let effectsPaused = reducedMotion.matches;
  const motionButton = document.querySelector('#motion-toggle');
  const hero = document.querySelector('.hero');
  const heroCopy = document.querySelector('.hero-copy');
  const canvas = document.querySelector('#signal-canvas');
  const ctx = canvas.getContext('2d');
  const clockStarted = performance.now();
  const desk = document.querySelector('#desk-dialog');
  let deskOpener = null;
  let width = 0, height = 0, lastFrame = 0, frame = 0, angle = 0;
  let visible = true;
  let pointerX = 0, pointerY = 0;
  const points = Array.from({length: 380}, (_, i) => {
    const y = 1 - i / 379 * 2;
    const radius = Math.sqrt(1 - y*y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    return {x: Math.cos(theta)*radius, y, z: Math.sin(theta)*radius};
  });
  function clock() {
    const now = new Date();
    const time = document.querySelector('#system-time');
    time.textContent = new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(now);
    time.dateTime = now.toISOString();
    document.querySelector('#system-date').textContent = new Intl.DateTimeFormat('en-US',{weekday:'long',month:'short',day:'numeric',year:'numeric'}).format(now);
    document.querySelector('#system-timezone').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_',' ');
    const seconds = Math.floor((performance.now()-clockStarted)/1000);
    document.querySelector('#session-time').textContent = [Math.floor(seconds/60),seconds%60].map(v=>String(v).padStart(2,'0')).join(':');
  }
  clock();
  window.setInterval(()=>{if(!document.hidden)clock();},1000);
  function connectionState() { document.querySelector('#network-state').textContent = navigator.onLine ? 'Online' : 'Offline'; }
  connectionState();
  window.addEventListener('online',connectionState);
  window.addEventListener('offline',connectionState);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)clock();});

  function fitCanvas() {
    width = hero.clientWidth; height = hero.clientHeight;
    const dpr = Math.min(devicePixelRatio||1,1.6);
    canvas.width = width*dpr; canvas.height = height*dpr;
    ctx?.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }
  function draw() {
    if(!ctx)return;
    ctx.clearRect(0,0,width,height);
    const mobile = width<701;
    const cx = mobile ? width*.92 : width*.61;
    const cy = mobile ? 330 : height*.43;
    const radius = mobile ? Math.min(width*.65,280) : Math.min(width*.25,330);
    ctx.strokeStyle = 'rgba(70,153,131,0.075)';ctx.lineWidth=.7;
    for(let x=25;x<width;x+=53){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
    for(let y=15;y<height;y+=53){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    const rotation = effectsPaused ? .33 : angle;
    const c = Math.cos(rotation), s = Math.sin(rotation);
    const projected = points.map(p=>{
      const x = p.x*c-p.z*s;
      const z = p.x*s+p.z*c;
      const scale = 1+z*.18;
      return {x:cx+x*radius*scale+pointerX*9,y:cy+p.y*radius*scale+pointerY*8,z};
    });
    projected.forEach((p,i)=>{
      const alpha=(p.z+1.4)/2.4;
      ctx.fillStyle=`rgba(91,218,161,${alpha*.38})`;
      ctx.beginPath();ctx.arc(p.x,p.y,p.z>.55?1.8:1.1,0,Math.PI*2);ctx.fill();
      if(i%5===0&&p.z>-.1){const next=projected[(i+17)%projected.length];if(next.z>-.1){ctx.strokeStyle=`rgba(92,197,158,${alpha*.08})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(next.x,next.y);ctx.stroke();}}
    });
    ctx.save();ctx.translate(cx,cy);ctx.rotate(-.22);
    ctx.strokeStyle='rgba(93,193,154,0.13)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.ellipse(0,0,radius*1.16,radius*.33,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,0,radius*1.28,radius*.4,0,0,Math.PI*2);ctx.stroke();ctx.restore();
    // Decorative code atmosphere, with no implied connection to live threat telemetry.
    if(!mobile){ctx.font='10px monospace';ctx.fillStyle='rgba(79,143,124,.085)';for(let col=0;col<width/92;col++){for(let row=0;row<6;row++){const y=(row*88+col*47+(effectsPaused?0:angle*80))%(height+100);ctx.fillText(['01','{}','0x','<>','::'][Math.floor(col+row)%5],col*92+10,y);}}}
  }
  function animate(now) {
    frame = requestAnimationFrame(animate);
    if(effectsPaused||document.hidden||!visible||now-lastFrame<34)return;
    angle+=.0017;lastFrame=now;draw();
  }
  function applyMotionPreference() {
    document.body.classList.toggle('effects-paused',effectsPaused);
    motionButton.setAttribute('aria-pressed',String(effectsPaused));
    motionButton.setAttribute('aria-label',effectsPaused?'Enable visual effects':'Pause visual effects');
    motionButton.innerHTML=effectsPaused?'Enable effects <span aria-hidden="true">▷</span>':'Pause effects <span aria-hidden="true">Ⅱ</span>';
    if(effectsPaused)heroCopy.style.transform='';
    draw();
  }
  motionButton.addEventListener('click',()=>{effectsPaused=!effectsPaused;applyMotionPreference();});
  reducedMotion.addEventListener('change',e=>{effectsPaused=e.matches;applyMotionPreference();});
  let scrollQueued = false;
  function updateScroll() {
    const max=document.documentElement.scrollHeight-innerHeight;
    document.querySelector('#scroll-progress').style.transform=`scaleX(${max>0?Math.min(scrollY/max,1):0})`;
    if(!effectsPaused&&innerWidth>700){heroCopy.style.transform=`translateY(${Math.min(scrollY*.075,40)}px)`;}
    scrollQueued=false;
  }
  window.addEventListener('scroll',()=>{if(!scrollQueued){requestAnimationFrame(updateScroll);scrollQueued=true;}},{passive:true});
  hero.addEventListener('pointermove',e=>{if(effectsPaused||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5;});
  hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
  const heroObserver = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0});heroObserver.observe(hero);
  const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.07,rootMargin:'0px 0px 30px 0px'});
  document.querySelectorAll('.section-title-row,.background-grid,.project-grid').forEach(el=>{el.classList.add('reveal-ready');revealObserver.observe(el);});
  new ResizeObserver(fitCanvas).observe(hero);
  applyMotionPreference();fitCanvas();updateScroll();frame=requestAnimationFrame(animate);

  let networkVisible=false;
  const lookupButton = document.querySelector('#network-lookup');
  function networkValues(ip,location,isp) {
    document.querySelector('#network-ip').textContent=ip;
    document.querySelector('#network-location').textContent=location;
    document.querySelector('#network-isp').textContent=isp;
  }
  async function fetchWithTimeout(url) {
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
    try{const response=await fetch(url,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store'});if(!response.ok)throw new Error('Source unavailable');return await response.json();}
    finally{clearTimeout(timeout);}
  }
  lookupButton.addEventListener('click',async()=>{
    const note=document.querySelector('#network-note');
    if(networkVisible){networkValues('Not requested','Not requested','Not requested');networkVisible=false;lookupButton.innerHTML='Look up my network '+icon('arrow-up-right');note.textContent='Optional IP lookup via ipwho.is. Location is approximate.';return;}
    lookupButton.disabled=true;lookupButton.textContent='Looking up network…';note.textContent='Requesting approximate public-network details from ipwho.is…';
    try{
      const data=await fetchWithTimeout('https://ipwho.is/');
      if(data.success!==true||typeof data.ip!=='string')throw new Error('Lookup unavailable');
      networkValues(data.ip,[data.city,data.country].filter(Boolean).join(', ')||'Not provided',data.connection?.isp||'Not provided');
      networkVisible=true;note.textContent='Approximate IP location from ipwho.is. VPN status is not verified. Details are not saved by this portfolio.';
      lookupButton.innerHTML='Hide network details '+icon('x');
    }catch{
      networkValues('Unavailable','Unavailable','Unavailable');note.textContent='Network lookup is unavailable or blocked. You can try again.';lookupButton.innerHTML='Retry network lookup '+icon('arrow-right');
    }finally{lookupButton.disabled=false;}
  });

  document.querySelectorAll('[data-open-desk]').forEach(button=>button.addEventListener('click',()=>{deskOpener=button;desk.showModal();document.body.classList.add('modal-open');document.querySelector('#desk-close').focus({preventScroll:true});}));
  document.querySelector('#desk-close').addEventListener('click',()=>desk.close());
  desk.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');deskOpener?.focus({preventScroll:true});});
  desk.addEventListener('click',e=>{if(e.target===desk){const r=desk.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)desk.close();}});
  document.querySelector('#load-threat-map').addEventListener('click',()=>{
    const stage=document.querySelector('#threat-map-stage');const iframe=document.createElement('iframe');
    iframe.src='https://cybermap.kaspersky.com/en/widget/dynamic/dark';iframe.title='Kaspersky live cyberthreat map';iframe.referrerPolicy='no-referrer';iframe.loading='lazy';iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-popups');
    stage.classList.add('map-loaded');stage.replaceChildren(iframe);
  });
  let savedCatalog=null;
  function displayCatalog(data,label) {
    const valid=data.items.filter(item=>/^CVE-\d{4}-\d{4,}$/.test(item.cveID)&&typeof item.dateAdded==='string').slice(0,4);
    document.querySelector('#kev-list').innerHTML=valid.map(item=>`<a class="kev-item" href="https://www.cve.org/CVERecord?id=${encodeURIComponent(item.cveID)}" target="_blank" rel="noopener noreferrer"><div class="kev-item-head"><strong>${esc(item.cveID)}</strong><time datetime="${esc(item.dateAdded)}">${esc(item.dateAdded)}</time></div><p>${esc(item.vulnerabilityName||[item.vendorProject,item.product].filter(Boolean).join(' '))}</p></a>`).join('');
    const released=new Date(data.catalogDate);const date=Number.isNaN(released.valueOf())?'date unavailable':released.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    document.querySelector('#kev-status').textContent=`${label} · Catalog ${date} · Dates shown are date added`;
  }
  fetch('/assets/kev-snapshot.json').then(r=>{if(!r.ok)throw new Error('No saved catalog');return r.json();}).then(data=>{savedCatalog=data;displayCatalog(data,'Saved snapshot');}).catch(()=>{document.querySelector('#kev-status').textContent='Saved catalog unavailable. Refresh from CISA or open the full catalog.';});
  document.querySelector('#refresh-kev').addEventListener('click',async e=>{
    const button=e.currentTarget;button.disabled=true;button.textContent='Refreshing…';document.querySelector('#kev-status').textContent='Requesting the latest CISA catalog…';
    try{
      const data=await fetchWithTimeout('https://raw.githubusercontent.com/cisagov/kev-data/develop/known_exploited_vulnerabilities.json');
      if(!Array.isArray(data.vulnerabilities)||!data.dateReleased)throw new Error('Invalid catalog');
      const items=[...data.vulnerabilities].sort((a,b)=>String(b.dateAdded).localeCompare(String(a.dateAdded))).slice(0,4);
      displayCatalog({items,catalogDate:data.dateReleased},'Updated from CISA');
    }catch{
      if(savedCatalog)displayCatalog(savedCatalog,'Refresh unavailable; saved snapshot');else document.querySelector('#kev-status').textContent='Refresh unavailable. Open the CISA catalog for current information.';
    }finally{button.disabled=false;button.innerHTML='Refresh from CISA '+icon('arrow-right');}
  });
})();
