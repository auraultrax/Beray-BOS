(() => {
 const $=s=>document.querySelector(s),toast=$('#toast'),lock=$('#lockStage'),stage=$('#appStage'),frame=$('#appFrame');
 let publications=[];
 function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2600);}
 function openPage(page){const builtIn=/^index[1-4]\\.html(?:[?#]|$)/.test(page);frame.setAttribute('sandbox',builtIn?'allow-scripts allow-forms allow-same-origin allow-popups':'allow-scripts allow-forms allow-pointer-lock allow-popups allow-downloads');frame.src=page;stage.classList.add('open');}
 function openPublished(row){if(!row||!row.public_base_url){notify('Uygulama henüz yayımlanmamış.');return;}openPage(row.public_base_url);}
 function showHome(){stage.classList.remove('open');frame.src='about:blank';}
 window.addEventListener('message',e=>{
   if(e.source!==document.querySelector('#lockStage iframe')?.contentWindow && e.source!==frame.contentWindow)return;
   if(e.data?.type==='BERAY_UNLOCK'){lock.style.display='none';notify('Beray hazır. Hoş geldin.');}
   if(e.data?.type==='BERAY_GO_HOME')showHome();
 });
 document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>openPage(b.dataset.page)));\n $('#appBack').addEventListener('click',showHome);
 $('#lockNow').addEventListener('click',()=>{stage.classList.remove('open');lock.style.display='block';lock.querySelector('iframe').contentWindow.location.reload();});
 function tick(){const d=new Date();$('#homeClock').textContent=d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})+' · '+d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'});}
 tick();setInterval(tick,15000);
 function installed(){try{return JSON.parse(localStorage.getItem('beray-installed')||'[]')}catch{return[]}}
 function saveInstalled(list){localStorage.setItem('beray-installed',JSON.stringify(list));renderInstalled();}
 function renderInstalled(){
   const list=installed(),host=$('#installedApps');$('#installedCount').textContent=list.length+' uygulama';
   if(!list.length){host.innerHTML='<p style="color:#8da0b9;font-size:13px;grid-column:1/-1">BSTORE\'dan eklediğin uygulamalar burada görünecek.</p>';return;}
   host.innerHTML='';list.forEach(item=>{const b=document.createElement('button');b.className='custom-app';b.innerHTML='<span class="app-letter"></span><span><strong></strong><small></small></span>';b.querySelector('.app-letter').textContent=(item.project_name||'B').slice(0,1).toUpperCase();b.querySelector('strong').textContent=item.project_name||item.slug;b.querySelector('small').textContent='Sürüm '+(item.version||'1.0');b.onclick=()=>openPublished(item);host.appendChild(b);});
 }
 async function loadApps(){
   try{const {data,error}=await window.beraySupabase.from('beray_publications').select('id,kind,slug,project_name,version,public_base_url').eq('is_active',true).order('project_name');if(error)throw error;publications=data||[];}catch(e){console.warn('Beray katalog:',e.message);}
 }
 function renderResults(term){
   const host=$('#installedApps');if(!term){renderInstalled();document.querySelectorAll('#coreApps .app-tile').forEach(x=>x.style.display='flex');return;}
   document.querySelectorAll('#coreApps .app-tile').forEach(x=>x.style.display=(x.textContent.toLowerCase().includes(term)?'flex':'none'));
   const matches=publications.filter(x=>(x.project_name+' '+x.slug+' '+x.kind).toLowerCase().includes(term));
   host.innerHTML='';
   matches.forEach(item=>{const card=document.createElement('div');card.className='custom-result';const icon=document.createElement('span');icon.className='app-letter';icon.textContent=item.kind==='app'?'B':'W';const meta=document.createElement('div');meta.className='custom-result-meta';const title=document.createElement('strong');title.textContent=item.project_name;const sub=document.createElement('small');sub.textContent=(item.kind==='app'?'BSTORE uygulaması':'BYSAM sitesi')+' · v'+item.version;meta.append(title,sub);const actions=document.createElement('div');actions.className='custom-result-actions';const open=document.createElement('button');open.className='mini-action';open.textContent='Aç';open.onclick=()=>openPublished(item);actions.append(open);if(item.kind==='app'){const install=document.createElement('button');install.className='mini-action primary';const already=installed().some(x=>x.id===item.id);install.textContent=already?'Eklendi':'Ana ekrana ekle';install.disabled=already;install.onclick=()=>{window.BerayOS.install(item);install.textContent='Eklendi';install.disabled=true;};actions.append(install);}card.append(icon,meta,actions);host.appendChild(card);});
   const own=installed().filter(x=>(x.project_name+' '+x.slug).toLowerCase().includes(term));
   own.forEach(item=>{if(matches.some(x=>x.id===item.id))return;const b=document.createElement('button');b.className='custom-app';b.textContent=item.project_name;b.onclick=()=>openPublished(item);host.appendChild(b);});
   if(!matches.length&&!own.length&&document.querySelectorAll('#coreApps .app-tile[style*="display: none"]').length===4)host.innerHTML='<p style="color:#8da0b9;grid-column:1/-1">Sonuç bulunamadı.</p>';
 }
 $('#appSearch').addEventListener('input',e=>renderResults(e.target.value.trim().toLowerCase()));
 $('#appSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const term=e.target.value.trim().toLowerCase();const result=publications.find(x=>(x.project_name+' '+x.slug).toLowerCase().includes(term));if(result)openPublished(result);}});
 window.BerayOS={openPage,openPublished,showHome,install:item=>{const list=installed().filter(x=>x.id!==item.id);list.unshift(item);saveInstalled(list);notify('Uygulama ana ekrana eklendi.');}};
 renderInstalled();
 setTimeout(()=>$('#boot').classList.add('hide'),3850);
 setTimeout(()=>$('#boot').remove(),4600);
 loadApps();
})();