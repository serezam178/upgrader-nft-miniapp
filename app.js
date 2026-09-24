/* Static visual catalogue. No checkout, network API or Telegram user data. */
const products = {
  nft: [
    {id:'2674',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',symbol:'Star',min:1,max:180,ton:'0.24',rub:'29.18',animation:'2674'},
    {id:'2338',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'violet',symbol:'Diamond',min:1,max:134,ton:'0.15',rub:'18.09',animation:'2338'},
    {id:'1877',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'amber',symbol:'Moon',min:1,max:34,ton:'0.22',rub:'26.26',animation:'1877'},
    {id:'945',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',symbol:'Star',min:1,max:34,ton:'0.12',rub:'14.44',animation:'945'},
    {id:'3614',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'amber',symbol:'Diamond',min:1,max:34,ton:'0.12',rub:'14.59',animation:'3614'},
    {id:'3289',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'amber',symbol:'Star',min:1,max:180,ton:'0.12',rub:'14.59',animation:'3289'},
    {id:'2627',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'pine',symbol:'Star',min:1,max:180,ton:'1.21',rub:'147.35',animation:'2627'},
    {id:'946',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',symbol:'Moon',min:1,max:34,ton:'0.12',rub:'14.44',animation:'946'},
    {id:'779',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'violet',symbol:'Moon',min:1,max:180,ton:'0.3',rub:'36.91',animation:'779'},
    {id:'3269',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',symbol:'Star',min:1,max:180,ton:'0.4',rub:'48.58',animation:'3269'},
    {id:'3442',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'amber',symbol:'Diamond',min:1,max:30,ton:'0.59',rub:'71.49',animation:'3442'},
    {id:'655',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'violet',symbol:'Moon',min:1,max:180,ton:'0.3',rub:'36.91',animation:'655'},
    {id:'614',name:'Rare Bird',collection:'Rare Bird',glyph:'🦜',bg:'violet',symbol:'Star',min:1,max:180,rub:'5.66'},
    {id:'615',name:'Rare Bird',collection:'Rare Bird',glyph:'🦚',bg:'blue',symbol:'Moon',min:1,max:30,rub:'4.36'},
    {id:'616',name:'Rare Bird',collection:'Rare Bird',glyph:'🪶',bg:'amber',symbol:'Diamond',min:2,max:179,rub:'2.89'}
  ],
  username: [
    ['goldyfix','3.65',1,90],['cuavas','3.65',1,90],['sendlives','3.65',1,90],['ywopa','3.65',1,90],['wacude','3.65',1,90],['sorbish','3.65',1,90],['portbold','3.65',1,90],['mihyp','3.67',1,90],['br_0s','1.91',1,90],['tobycollyer','3.67',1,180]
  ].map(([name,rub,min,max],i)=>({id:String(i+1),name:'@'+name,glyph:'@',bg:['violet','blue','pine','amber'][i%4],min,max,rub})),
  number: [
    ['+888 0953 7412','165.04',100,180],['+888 0370 2141','172.53',34,180],['+888 0226 4750','171.18',34,180],['+888 0504 2473','163.09',34,180],['+888 0843 7159','163.09',34,90],['+888 0157 4932','163.09',34,90],['+888 0769 3604','164.44',34,180],['+888 0125 1254','256.09',34,90],['+888 0727 0919','256.09',34,90],['+888 0926 4924','165.79',34,90]
  ].map(([name,rub,min,max],i)=>({id:String(i+1),name,glyph:'☎',bg:['slate','mint','violet','blue'][i%4],min,max,rub}))
};

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
let tab = 'nft';
let lastFocus = null;
let toastTimer;
const animationHandles = new Map();
const animationObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) {
    const container = entry.target;
    if (entry.isIntersecting) {
      let animation = animationHandles.get(container);
      if (!animation && window.lottie) {
        animation = window.lottie.loadAnimation({
          container, renderer:'canvas', loop:!reducedMotion, autoplay:!reducedMotion,
          path:`./assets/nft/durovsglasses-${container.dataset.animation}.json`
        });
        animation.addEventListener('DOMLoaded',()=>container.classList.add('is-loaded'));
        animationHandles.set(container,animation);
      } else if (!reducedMotion) animation?.play();
    } else animationHandles.get(container)?.pause();
  }
},{rootMargin:'100px'}) : null;

const tg = window.Telegram?.WebApp;
document.body.classList.toggle('in-telegram',Boolean(tg?.initData));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#171717');
  tg.setBackgroundColor('#171717');
}

function toast(message) {
  $('toast').textContent = message;
  $('toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>$('toast').classList.remove('show'),2200);
}

function fillCollections() {
  const select = $('collection');
  select.replaceChildren();
  const names = [...new Set(products[tab].map(item=>item.collection).filter(Boolean))];
  for (const name of names) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.append(option);
  }
}

function setTab(next) {
  tab = next;
  for (const button of document.querySelectorAll('.tab')) {
    const active = button.dataset.tab === tab;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
  }
  const isNft = tab === 'nft';
  $('collectionFilter').hidden = !isNft;
  $('backdropFilter').classList.toggle('filter-wide',!isNft);
  $('symbolFilter').hidden = !isNft;
  $('backdrop').value = 'Все';
  $('symbol').value = 'Все';
  $('sort').value = 'default';
  fillCollections();
  renderCatalog();
}

function filteredProducts() {
  let items = products[tab].filter(item => (tab !== 'nft' || item.collection === $('collection').value) && ($('backdrop').value === 'Все' || item.bg === ({'Amber':'amber','Slate':'slate','Violet':'violet','Pine Green':'pine'}[$('backdrop').value])) && (tab !== 'nft' || $('symbol').value === 'Все' || item.symbol === $('symbol').value));
  const sort = $('sort').value;
  if (sort === 'price-asc') items.sort((a,b)=>Number(a.rub.replaceAll(' ',''))-Number(b.rub.replaceAll(' ','')));
  if (sort === 'price-desc') items.sort((a,b)=>Number(b.rub.replaceAll(' ',''))-Number(a.rub.replaceAll(' ','')));
  if (sort === 'name') items.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
  return items;
}

function card(item) {
  const button = document.createElement('button');
  button.className = 'card';
  button.type = 'button';
  button.setAttribute('aria-label',`${item.name} ${item.id}, ${item.rub} рублей`);
  const art = document.createElement('div');
  art.className = `art ${item.bg}`;
  const id = document.createElement('span');
  id.className = 'id'; id.textContent = tab === 'nft' ? `#${item.id}` : tab === 'username' ? 'Username' : '+888';
  const glyph = document.createElement('span');
  glyph.className = 'glyph'; glyph.textContent = item.glyph;
  const duration = document.createElement('span');
  duration.className = 'duration'; duration.textContent = `${item.min}–${item.max} дн.`;
  if (item.animation) {
    const animation = document.createElement('div');
    animation.className='nft-animation'; animation.dataset.animation=item.animation;
    art.classList.add('has-animation');
    art.append(animation);
  }
  art.append(id,glyph,duration);
  const name = document.createElement('strong');
  name.className = 'card-title'; name.textContent = item.name;
  const price = document.createElement('div');
  price.className = 'price';
  const main = document.createElement('strong');
  if (item.ton) {
    const icon = document.createElement('img'); icon.className='ton'; icon.src='./assets/ton.svg'; icon.alt='TON';
    main.append(icon,`${item.ton} /день`);
  } else main.textContent=`${item.rub} ₽/день`;
  const rub = document.createElement('small'); rub.textContent=item.ton?`~${item.rub} руб.`:'Демо-цена';
  price.append(main,rub);
  button.append(art,name,price);
  button.addEventListener('click',()=>openDetail(item,button));
  return button;
}

function renderCatalog() {
  animationObserver?.disconnect();
  for (const animation of animationHandles.values()) animation.destroy();
  animationHandles.clear();
  const items = filteredProducts();
  const title = tab === 'nft' ? $('collection').value : tab === 'username' ? 'NFT-юзернеймы' : 'NFT-номера +888';
  $('collectionTitle').textContent = title;
  $('resultNote').textContent = `${items.length} ${items.length === 1 ? 'позиция' : 'позиций'} · сохранённый снимок каталога`;
  $('grid').replaceChildren(...items.map(card));
  document.querySelectorAll('.nft-animation').forEach(container => {
    if (animationObserver) animationObserver.observe(container);
  });
  $('emptyState').hidden = items.length > 0;
}

function openDetail(item,origin) {
  lastFocus = origin;
  const title=tab==='nft'?'NFT':tab==='username'?'Username':'Number';
  const message=tab==='nft'?'Перейдите в бот для покупки NFT. Оплата в демо недоступна.':'Перейдите в бот для аренды. Оформление в демо недоступно.';
  if (tg?.initData && typeof tg.showPopup === 'function') {
    tg.showPopup({title,message,buttons:[
      {id:'cancel',type:'cancel',text:'CANCEL'},
      {id:'go',type:'default',text:'ПЕРЕЙТИ В БОТ'}
    ]}, button => {if(button==='go') tg.openTelegramLink('https://t.me/UpgradeNFT178_bot');});
    return;
  }
  $('purchaseTitle').textContent=title;
  $('purchaseMessage').textContent=message;
  $('purchaseOverlay').hidden=false;
  $('cancelPurchase').focus();
}

function closeDetail(){ $('purchaseOverlay').hidden=true; lastFocus?.focus(); }

const reviewExamples=[
  {product:'NFT Rent - Input Key',icon:'💎',text:'Норм, главное что дешево'},
  {product:'NFT Rent - Spring Basket',icon:'🧺',text:'+'},
  {product:'NFT Rent - Record Player',icon:'🎵',text:'<3'}
];
function renderReviews(filter='all'){
  const list=$('reviewList'); list.replaceChildren();
  if(filter==='negative'){
    const empty=document.createElement('div');empty.className='review-empty';empty.textContent='В сохранённом примере негативных отзывов нет.';list.append(empty);return;
  }
  for(const review of reviewExamples){
    const card=document.createElement('article');card.className='review-card';
    const top=document.createElement('div');top.className='review-card-top';
    const art=document.createElement('div');art.className='review-card-art';art.textContent=review.icon;
    const product=document.createElement('div');product.className='review-card-product';product.textContent=review.product;
    const status=document.createElement('span');status.className='review-card-status';status.textContent='✓ ХОРОШО';
    top.append(art,product,status);
    const text=document.createElement('p');text.textContent=review.text;
    const meta=document.createElement('div');meta.className='review-card-meta';meta.textContent='Пример из исходного интерфейса';
    card.append(top,text,meta);list.append(card);
  }
}

document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));
for(const id of ['collection','backdrop','symbol','sort']) $(id).addEventListener('change',renderCatalog);
$('copyLink').addEventListener('click',async()=>{
  const url=new URL(location.href);url.searchParams.set('view','catalog');url.searchParams.set('tab',tab);
  if(tab==='nft')url.searchParams.set('collection',$('collection').value);
  else url.searchParams.delete('collection');
  try{await navigator.clipboard.writeText(url.toString());toast('Ссылка скопирована');}
  catch{toast('Не удалось скопировать ссылку');}
});
$('cancelPurchase').addEventListener('click',closeDetail);
$('purchaseOverlay').addEventListener('click',event=>{if(event.target===$('purchaseOverlay'))closeDetail();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('purchaseOverlay').hidden)closeDetail();});
document.querySelectorAll('[data-review-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-review-filter]').forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});
  renderReviews(button.dataset.reviewFilter);
}));

const isReviews=params.get('view')==='reviews';
$('catalogPage').hidden=isReviews;
$('reviewsPage').hidden=!isReviews;
$('pageSubtitle').textContent=isReviews?'Отзывы':'Веб-каталог';
if(isReviews)renderReviews();
else{
  setTab(['nft','username','number'].includes(params.get('tab'))?params.get('tab'):'nft');
  const requested=params.get('collection');
  if(requested&&[...$('collection').options].some(option=>option.value===requested)){$('collection').value=requested;renderCatalog();}
}
