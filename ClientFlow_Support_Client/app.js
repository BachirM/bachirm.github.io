const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let clients=[
{id:1,name:"Camille R.",company:"Atelier Nova",email:"camille.r@example.test",phone:"+41 22 555 01 12",channel:"E-mail",last:"Aujourd’hui",note:"Préfère les réponses écrites"},
{id:2,name:"Nicolas D.",company:"Indépendant",email:"nicolas.d@example.test",phone:"+41 79 555 02 18",channel:"Téléphone",last:"Aujourd’hui",note:"Disponible le matin"},
{id:3,name:"Sarah M.",company:"Maison Sarah",email:"sarah.m@example.test",phone:"+41 78 555 03 21",channel:"Chat",last:"Hier",note:""},
{id:4,name:"Yanis B.",company:"Studio YB",email:"yanis.b@example.test",phone:"+41 76 555 04 33",channel:"E-mail",last:"Hier",note:""},
{id:5,name:"Julie P.",company:"Association Horizon",email:"julie.p@example.test",phone:"+41 79 555 05 44",channel:"Téléphone",last:"17.11.2026",note:""}
];
let interactions=[
{id:501,client:1,date:"18.11.2026",channel:"E-mail",type:"Information",subject:"Question sur les horaires d’ouverture",summary:"Les horaires et les modalités d’accueil ont été communiqués.",status:"Terminé",next:""},
{id:502,client:2,date:"18.11.2026",channel:"Téléphone",type:"Demande administrative",subject:"Mise à jour des coordonnées",summary:"Coordonnées confirmées avec le client. Mise à jour à effectuer dans le dossier.",status:"En cours",next:"Mettre à jour le dossier et confirmer par e-mail"},
{id:503,client:3,date:"17.11.2026",channel:"Chat",type:"Réclamation",subject:"Retour concernant une commande",summary:"Écoute de la cliente, reformulation de sa demande et transmission au service concerné.",status:"En attente",next:"Faire un retour à la cliente après réponse du service"},
{id:504,client:4,date:"17.11.2026",channel:"E-mail",type:"Assistance",subject:"Accompagnement à la création du compte",summary:"Les étapes de création du compte ont été expliquées.",status:"Terminé",next:""},
{id:505,client:5,date:"16.11.2026",channel:"Téléphone",type:"Suivi",subject:"Retour après demande de renseignement",summary:"Le client souhaite recevoir une documentation complémentaire.",status:"À traiter",next:"Envoyer la documentation"}
];
let tasks=[
{id:1,text:"Confirmer la mise à jour des coordonnées à Nicolas D.",due:"Aujourd’hui · 14:00",done:false},
{id:2,text:"Faire un retour à Sarah M. après réponse du service",due:"Aujourd’hui · 16:00",done:false},
{id:3,text:"Envoyer la documentation à Julie P.",due:"Aujourd’hui · 17:00",done:false},
{id:4,text:"Vérifier que le dossier de Camille R. est complet",due:"Demain · 10:00",done:true}
];
const templates=[
["Accusé de réception","Bonjour,\n\nNous vous remercions pour votre message. Votre demande a bien été prise en compte.\n\nNous revenons vers vous dès que nous disposons des éléments nécessaires.\n\nAvec nos meilleures salutations."],
["Demande de précision","Bonjour,\n\nAfin de pouvoir traiter votre demande correctement, pourriez-vous nous communiquer quelques précisions complémentaires ?\n\nNous restons à votre disposition et vous remercions de votre collaboration."],
["Transmission au service concerné","Bonjour,\n\nMerci pour les informations communiquées. Votre demande a été transmise au service compétent pour examen.\n\nNous assurons le suivi et vous tiendrons informé(e) de la suite donnée."],
["Clôture et satisfaction","Bonjour,\n\nNous espérons que les informations apportées répondent à votre demande.\n\nN’hésitez pas à nous recontacter si vous avez besoin d’un complément. Nous vous remercions de votre confiance."]
];
function toast(msg){let t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function clientName(id){return clients.find(c=>c.id===id)?.name||"Client inconnu"}
function pill(s){let cl=s==="Terminé"?"done":s==="En attente"||s==="À traiter"?"wait":"progress";return `<span class="pill ${cl}">${s}</span>`}
function channelIcon(c){return c==="Téléphone"?"☎":c==="E-mail"?"✉":c==="Chat"?"◌":c==="Courrier"?"▤":"♧"}
function renderOverview(){
$("#recentList").innerHTML=interactions.slice().reverse().slice(0,4).map(i=>`<div class="interaction-item"><div class="channel-icon">${channelIcon(i.channel)}</div><div><strong>${esc(clientName(i.client))} · ${esc(i.subject)}</strong><p>${esc(i.type)} · ${esc(i.channel)}</p></div><div>${pill(i.status)}</div></div>`).join("");
$("#overviewTasks").innerHTML=tasks.filter(t=>!t.done).slice(0,3).map(taskHtml).join("")||"<p class='muted'>Aucun suivi en attente.</p>";
$("#statTotal").textContent=interactions.length+13;$("#statWaiting").textContent=interactions.filter(i=>i.status==="En attente"||i.status==="À traiter").length;$("#statFollow").textContent=tasks.filter(t=>!t.done).length;$("#statClients").textContent=clients.length+7;$("#todoBadge").textContent=tasks.filter(t=>!t.done).length;
}
function taskHtml(t){return `<div class="task ${t.done?"done":""}"><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""}><div><strong>${esc(t.text)}</strong><small>${esc(t.due)}</small></div></div>`}
function renderClients(){
let q=($("#clientSearch")?.value||"").toLowerCase();let rows=clients.filter(c=>(c.name+c.company+c.email).toLowerCase().includes(q));
$("#clientRows").innerHTML=rows.map(c=>`<tr><td><strong>${esc(c.name)}</strong><small>${esc(c.company||"")}</small></td><td>${esc(c.email)}<small>${esc(c.phone)}</small></td><td>${esc(c.channel)}</td><td>${esc(c.last)}</td><td><span class="pill done">Actif</span></td></tr>`).join("")||`<tr><td colspan="5">Aucun client trouvé.</td></tr>`;$("#clientCount").textContent=rows.length+" client(s)";
}
function renderInteractions(){
let q=($("#interactionSearch")?.value||"").toLowerCase(),type=$("#typeFilter")?.value||"",status=$("#statusFilter")?.value||"";
let rows=interactions.filter(i=>(clientName(i.client)+i.subject).toLowerCase().includes(q)&&(!type||i.type===type)&&(!status||i.status===status));
$("#interactionRows").innerHTML=rows.slice().reverse().map(i=>`<tr><td>${i.date}</td><td><strong>${esc(clientName(i.client))}</strong><small>${esc(i.subject)}</small></td><td>${esc(i.channel)}</td><td>${esc(i.type)}</td><td>${pill(i.status)}</td></tr>`).join("")||`<tr><td colspan="5">Aucune interaction trouvée.</td></tr>`;
}
function renderTasks(){$("#allTasks").innerHTML=tasks.map(taskHtml).join("")}
function renderTemplates(){$("#templates").innerHTML=templates.map((t,n)=>`<article class="template-card"><div class="eyebrow">MODÈLE ${String(n+1).padStart(2,"0")}</div><h3>${t[0]}</h3><p>${esc(t[1])}</p><button data-copy="${n}">Copier le texte</button></article>`).join("")}
function refresh(){renderOverview();renderClients();renderInteractions();renderTasks();renderTemplates();$("#iClient").innerHTML=clients.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function go(view){$$(".view").forEach(v=>v.classList.toggle("active",v.id===view));$$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.goto)));
$$("[data-open]").forEach(b=>b.addEventListener("click",()=>$("#"+b.dataset.open).showModal()));
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
$("#clientSearch").addEventListener("input",renderClients);$("#interactionSearch").addEventListener("input",renderInteractions);$("#typeFilter").addEventListener("change",renderInteractions);$("#statusFilter").addEventListener("change",renderInteractions);
document.addEventListener("change",e=>{if(e.target.matches("[data-task]")){let t=tasks.find(t=>t.id===+e.target.dataset.task);t.done=e.target.checked;refresh();toast(t.done?"Suivi marqué comme effectué":"Suivi réactivé")}});
document.addEventListener("click",e=>{let b=e.target.closest("[data-copy]");if(b){let text=templates[+b.dataset.copy][1];if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>toast("Réponse copiée."));}else toast("Copie non disponible dans ce navigateur.")}});
$("#interactionForm").addEventListener("submit",e=>{e.preventDefault();let id=Date.now();let next=$("#iNext").value.trim();interactions.push({id,client:+$("#iClient").value,date:new Date().toLocaleDateString("fr-CH"),channel:$("#iChannel").value,type:$("#iType").value,subject:$("#iSubject").value.trim(),summary:$("#iSummary").value.trim(),status:$("#iStatus").value,next});if(next)tasks.unshift({id,text:next+" · "+clientName(+$("#iClient").value),due:"À planifier",done:false});e.target.closest("dialog").close();e.target.reset();refresh();toast("Interaction enregistrée.")});
$("#clientForm").addEventListener("submit",e=>{e.preventDefault();clients.push({id:Date.now(),name:$("#cName").value.trim(),company:$("#cCompany").value.trim(),email:$("#cEmail").value.trim(),phone:$("#cPhone").value.trim(),channel:$("#cChannel").value,last:"Aujourd’hui",note:$("#cNote").value.trim()});e.target.closest("dialog").close();e.target.reset();refresh();toast("Client ajouté au répertoire.")});
refresh();