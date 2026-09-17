const ICONS = {
  'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  'arrow-up-right': '<path d="M6 18 18 6M6 6h12v12"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  shield: '<path d="m12 3 8 3v6c0 4-5 8-8 9-3-1-8-5-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  'file-check': '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6m-12 5 3 3 5-6"/>',
  fingerprint: '<path d="M6 6a8.5 8.5 0 0 1 14 6v3M3 13v-1a9 9 0 0 1 .6-3M6 16v-4a6 6 0 0 1 12 0v4m-9 5v-9a3 3 0 0 1 6 0v5c0 2-.3 3-1 5m-2-10v5m-8 2 1-2m12 4 1-3"/>',
  graduation: '<path d="m2 8 10-5 10 5-10 5-10-5Zm4 3v6c4 3 8 3 12 0v-6m4-3v8"/>',
  radar: '<circle cx="12" cy="12" r="9"/><path d="M16.2 7.8A6 6 0 1 0 18 12M12 12l7-7"/><circle cx="12" cy="12" r="2"/>',
  network: '<rect x="8" y="2" width="8" height="6" rx="1"/><rect x="2" y="16" width="7" height="6" rx="1"/><rect x="15" y="16" width="7" height="6" rx="1"/><path d="M12 8v4m-6.5 4v-4h13v4"/>',
  github: '<path d="M9 19c-4 1-4-2-6-2m14 5v-4c0-1-.3-1.8-1-2 3-.3 6-1.5 6-6 0-1.2-.5-2.4-1.3-3.3.1-1 .1-2.2-.4-3.2-1.1-.2-2.4.4-3.5 1.1a13 13 0 0 0-7.6 0C8 3.9 6.8 3.3 5.7 3.5c-.5 1-.5 2.2-.4 3.2A5.1 5.1 0 0 0 4 10c0 4.5 3 5.7 6 6-.7.2-1 1-1 2v4"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.shield}</svg>`;
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderIcons(root = document) { root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
const domainNames = ['All projects', ...CAPABILITIES.map(c => c.name)];
const params = new URLSearchParams(location.search);
let activeDomain = domainNames.includes(params.get('domain')) ? params.get('domain') : 'All projects';
let query = params.get('q') || '';
let currentProject = null;
let activeTab = 'overview';
const dialog = document.querySelector('#project-dialog');
const search = document.querySelector('#search');
const grid = document.querySelector('#project-grid');
search.value = query;

function art(id) {
  const box = (x,y,w,h,fill='#fff',stroke='#acc3e8',radius=6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
  const line = (d,color='#94afd9',dash='') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.4" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
  const circle = (x,y,r,color='#fff',stroke='#aac2e7') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="${stroke}"/>`;
  const text = (x,y,t) => `<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
  let body = '';
  if(id==='macos') {
    body = circle(182,74,53,'none','#d5e0f3')+circle(182,74,40,'none','#d5e0f3')+box(155,49,54,42)+line('M174 92v8m-9 0h34')+`<g transform="translate(172,58)" fill="none" stroke="#638ed6" stroke-width="1.5"><path d="M0 10V7a9 9 0 0 1 18 0v9M4 18V7a5 5 0 0 1 10 0v12M9 7v16"/></g>`+line('M222 73h42', '#92b0dc','3 4')+box(267,38,104,69)+circle(279,52,2,'#6c94d9','#6c94d9')+line('M287 52h64M279 66h32m6 0h26M279 80h67M279 93h40','#b0c7e8')+text(316,125,'UNIFIED LOGS');
  } else if(id==='mitm') {
    body = line('M112 67h185','#7599c5','4 4')+box(74,45,57,39)+line('M94 85v7m-12 0h41')+box(288,46,55,38)+line('M300 60h30m-30 10h30')+circle(211,65,25,'#fff','#9ebadd')+`<path d="m211 51 11 4v9c0 7-11 14-11 14s-11-7-11-14v-9Z" fill="#eaf0ff" stroke="#6f92cf"/>`+line('m207 64 3 3 6-8','#4277d2')+text(103,115,'WINDOWS VM')+text(211,115,'KALI / MITM')+text(316,115,'GATEWAY')+circle(156,66,3,'#6f98d1','#6f98d1')+circle(265,66,3,'#6f98d1','#6f98d1');
  } else if(id==='vmware') {
    body = box(111,43,59,48,'#fff','#adb4df')+line('M123 56h34m-34 12h23m-23 12h34','#b0b7de')+line('M171 68h36m0-31v66m0-66h35m-35 32h35m-35 34h35','#adb4df','3 3')+box(244,24,83,25,'#fff','#b9c1e4')+box(244,56,83,25,'#fff','#b9c1e4')+box(244,90,83,25,'#fff','#b9c1e4')+text(285,40,'135 / RPC')+text(285,72,'139 / NBT')+text(285,106,'445 / SMB')+text(140,116,'NMAP SCAN')+circle(352,102,4,'#8795d3','#8795d3');
  } else {
    body = line('M224 49v25m-97 0h193m-193 0v16m97-16v16m96-16v16','#a8c5c6')+box(199,15,51,35,'#fff','#a3bfc5')+line('M210 30h28m-28 8h28','#8eadbd')+box(104,92,46,29,'#fff','#aac5c9')+box(201,92,46,29,'#fff','#aac5c9')+box(297,92,46,29,'#fff','#aac5c9')+line('M117 102h20m-20 7h20M214 102h20m-20 7h20M310 102h20m-20 7h20','#a0bec7')+circle(159,109,4,'#8cadd3','#8cadd3')+text(127,138,'ENDPOINTS')+text(224,138,'CAMERAS')+text(320,138,'SERVICES');
  }
  const darkBody = body.replace(/#fff/g, '#122c2b').replace(/#eaf0ff/g, '#1d4335').replace(/#d5e0f3/g, '#234c3d').replace(/#acc3e8|#aac2e7|#b9c1e4|#a3bfc5|#aac5c9|#adb4df|#9ebadd/g, '#487b65').replace(/#638ed6|#6f92cf|#4277d2|#6f98d1|#6c94d9/g, '#6dcf9a').replace(/#94afd9|#92b0dc|#b0c7e8|#7599c5|#b0b7de|#a8c5c6|#8eadbd|#a0bec7/g, '#517c70');
  return `<svg viewBox="0 0 420 150" aria-hidden="true">${darkBody}</svg>`;
}

function setURL() {
  const url = new URL(location.href);
  if(activeDomain==='All projects') url.searchParams.delete('domain'); else url.searchParams.set('domain',activeDomain);
  if(query) url.searchParams.set('q',query); else url.searchParams.delete('q');
  if(currentProject) {url.searchParams.set('project',currentProject.id); if(activeTab!=='overview')url.searchParams.set('tab',activeTab);else url.searchParams.delete('tab');}
  else {url.searchParams.delete('project');url.searchParams.delete('tab');}
  history.replaceState(null,'',url);
}
function renderFilters() {
  document.querySelector('#filters').innerHTML=domainNames.map(name=>{
    const count=name==='All projects'?PROJECTS.length:PROJECTS.filter(p=>p.domains.includes(name)).length;
    return `<button class="filter" data-domain="${esc(name)}" aria-pressed="${activeDomain===name}">${esc(name)}<span>${count}</span></button>`;
  }).join('');
}
function renderProjects() {
  const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible=PROJECTS.filter(p=>(activeDomain==='All projects'||p.domains.includes(activeDomain))&&terms.every(t=>JSON.stringify(p).toLowerCase().includes(t)));
  grid.innerHTML=visible.map(p=>`<article class="project-card"><div class="card-art art-${p.id}" aria-hidden="true"><div class="art-grid"></div><span class="art-meta">CASE ${p.number}</span>${art(p.id)}<span class="art-corner">${p.artLabel}</span></div><div class="card-body"><div class="card-domain">${p.category}</div><h3>${p.title}</h3><p class="card-description">${p.short}</p><div class="insight">${icon('radar')}<span>${p.insight}</span></div><div class="tag-list">${p.tools.slice(0,4).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="card-footer"><span>${icon('file-check')}${p.evidenceLabel}</span><button class="case-button" data-project="${p.id}" aria-label="Explore ${esc(p.title)}">Explore case study ${icon('arrow-up-right')}</button></div></div></article>`).join('');
  document.querySelector('#results-count').textContent=`Showing ${visible.length} ${visible.length===1?'project':'projects'}${activeDomain!=='All projects'?' in '+activeDomain:''}`;
  document.querySelector('#empty-state').hidden=visible.length!==0;
  document.querySelector('#reset-filters').hidden=activeDomain==='All projects'&&!query;
}
function applyFilter(name,clearSearch=false) {
  activeDomain=name;
  if(clearSearch){query='';search.value='';}
  renderFilters();renderProjects();setURL();
}
function clearFilters(){applyFilter('All projects',true);}
document.querySelector('#filters').addEventListener('click',e=>{
  const button=e.target.closest('[data-domain]');if(button){const name=button.dataset.domain;applyFilter(name);document.querySelector(`[data-domain="${name}"]`).focus({preventScroll:true});}
});
search.addEventListener('input',()=>{query=search.value;renderProjects();setURL();});
document.querySelector('#reset-filters').addEventListener('click',clearFilters);
document.querySelector('#empty-reset').addEventListener('click',()=>{clearFilters();search.focus({preventScroll:true});});
document.querySelector('#capabilities').innerHTML=CAPABILITIES.map(c=>`<button class="capability" data-capability="${c.name}" aria-label="Explore ${PROJECTS.filter(p=>p.domains.includes(c.name)).length} ${c.name} projects"><span class="capability-icon">${icon(c.icon)}</span><span class="capability-copy"><span class="capability-title">${c.label}</span><span class="capability-description">${c.description}</span></span><span class="capability-count">0${PROJECTS.filter(p=>p.domains.includes(c.name)).length}${icon('arrow-up-right')}</span></button>`).join('');
document.querySelector('#capabilities').addEventListener('click',e=>{const b=e.target.closest('[data-capability]');if(b){applyFilter(b.dataset.capability,true);document.querySelector('#projects').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector(`[data-domain="${b.dataset.capability}"]`).focus({preventScroll:true});}});

function renderTable(table) {return `<div class="evidence-table-wrap"><table><thead><tr>${table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function openProject(id,tab='overview') {
  const p=PROJECTS.find(x=>x.id===id);if(!p)return;
  currentProject=p;
  document.querySelector('#dialog-source').href=p.repository;
  document.querySelector('#dialog-eyebrow').textContent=`CASE ${p.number} / ${p.category}`;
  document.querySelector('#dialog-title').textContent=p.title;
  document.querySelector('#dialog-description').textContent=p.description;
  document.querySelector('#dialog-tags').innerHTML=p.domains.map(d=>`<span class="tag">${esc(d)}</span>`).join('');
  document.querySelector('#panel-overview').innerHTML=`<div class="detail-intro"><div><h3>The question</h3><p>${esc(p.objective)}</p></div><div class="context-box"><span>ENVIRONMENT & SCOPE</span><p>${esc(p.scope)}</p></div></div><h3>Investigation workflow</h3><div class="workflow">${p.workflow.map((w,i)=>`<div class="workflow-step"><span>0${i+1}</span><strong>${esc(w)}</strong></div>`).join('')}</div><h3>Key findings</h3><div>${p.findings.map(f=>`<div class="finding"><div class="finding-title">${icon('radar')}${esc(f[0])}</div><p>${esc(f[1])}</p></div>`).join('')}</div><div class="source-note"><strong>Evidence scope.</strong> ${esc(p.boundary)}</div>`;
  document.querySelector('#panel-evidence').innerHTML=`<h3>Follow the evidence</h3><p>Selected excerpts and summaries from the original project documentation.</p>${p.evidence.map(e=>`<article class="evidence-item"><div class="evidence-item-head"><h3>${esc(e.title)}</h3><span class="evidence-type">${esc(e.type)}</span></div>${e.description?`<p>${esc(e.description)}</p>`:''}${e.code?`<div class="code-block"><pre><code>${esc(e.code)}</code></pre></div>`:''}${e.table?renderTable(e.table):''}<a class="source-link" href="${esc(e.link||e.url||p.repository+(e.anchor||''))}" target="_blank" rel="noopener noreferrer">${e.linkLabel||'View supporting source'} ${icon('arrow-up-right')}</a></article>`).join('')}<div class="source-note">${esc(p.boundary)}</div>${p.page?`<a class="source-link" href="${p.page}" target="_blank" rel="noopener noreferrer">Read the original project page ${icon('arrow-up-right')}</a>`:''}`;
  document.querySelector('#panel-skills').innerHTML=`<h3>Recruiter-relevant capabilities</h3><div class="skill-grid">${p.skills.map(s=>`<div class="skill-item"><strong>${esc(s[0])}</strong><p>${esc(s[1])}</p></div>`).join('')}</div><h3>Tools & environment</h3><div class="tool-list tag-list">${p.tools.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="controls-header"><h3>Security controls</h3><span class="suggested-label">Recommended</span></div><ul class="controls-list">${p.controls.map(c=>`<li>${esc(c)}</li>`).join('')}</ul><div class="source-note"><strong>Planned extension.</strong> ${esc(p.next)}</div>`;
  selectTab(['overview','evidence','skills'].includes(tab)?tab:'overview');
  if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');document.querySelector('#dialog-close').focus({preventScroll:true});}
  document.querySelector('.dialog-scroll').scrollTop=0;
  setURL();
}
function selectTab(name,focus=false) {
  activeTab=name;
  document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===name;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;if(active&&focus)b.focus();});
  document.querySelectorAll('[role=tabpanel]').forEach(p=>p.hidden=p.id!==`panel-${name}`);
  setURL();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-project]');if(b)openProject(b.dataset.project);});
document.querySelector('#dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{currentProject=null;document.body.classList.remove('modal-open');setURL();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('.dialog-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)selectTab(b.dataset.tab);});
document.querySelector('.dialog-tabs').addEventListener('keydown',e=>{
  const tabs=[...document.querySelectorAll('[data-tab]')];const i=tabs.indexOf(document.activeElement);if(i<0)return;
  let next;if(e.key==='ArrowRight')next=(i+1)%3;else if(e.key==='ArrowLeft')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;
  e.preventDefault();selectTab(tabs[next].dataset.tab,true);
});
document.querySelector('#dialog-next').addEventListener('click',()=>{if(currentProject)openProject(PROJECTS[(PROJECTS.indexOf(currentProject)+1)%PROJECTS.length].id,activeTab);});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!document.querySelector('dialog[open]')&&!e.ctrlKey&&!e.metaKey&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();search.focus();}});
window.addEventListener('popstate',()=>{
  const p=new URLSearchParams(location.search);activeDomain=domainNames.includes(p.get('domain'))?p.get('domain'):'All projects';query=p.get('q')||'';search.value=query;renderFilters();renderProjects();
  if(PROJECTS.some(x=>x.id===p.get('project')))openProject(p.get('project'),p.get('tab')||'overview');else if(dialog.open)dialog.close();
});
renderIcons();renderFilters();renderProjects();
if(params.has('project'))openProject(params.get('project'),params.get('tab')||'overview');
