/* Rental browsing uses public listings from the bot service; checkout is disabled. */
const products = {
  nft: [
    {id:'2674',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',backdrop:'Azure Blue',symbol:'Cone',model:'Synthwave',min:1,max:180,ton:'0.24',rub:'29.18',animation:'2674'},
    {id:'2338',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'violet',backdrop:'Grape',symbol:'Toilet Paper',model:'Googly Eyes',min:1,max:134,ton:'0.15',rub:'18.09',animation:'2338'},
    {id:'1877',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'amber',backdrop:'Satin Gold',symbol:'Paw',model:'Finish Line',min:1,max:34,ton:'0.22',rub:'26.26',animation:'1877'},
    {id:'945',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',backdrop:'Neon Blue',symbol:'Dessert',model:'Leopard Glam',min:1,max:34,ton:'0.12',rub:'14.44',animation:'945'},
    {id:'3614',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'amber',backdrop:'Chestnut',symbol:'Moon Face',model:'Stardust',min:1,max:34,ton:'0.12',rub:'14.59',animation:'3614'},
    {id:'3289',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'amber',backdrop:'Mustard',symbol:'Bike Helmet',model:'Aliens',min:1,max:180,ton:'0.12',rub:'14.59',animation:'3289'},
    {id:'2627',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'pine',backdrop:'Onyx Black',symbol:'Wepwawet',model:'Project Mayhem',min:1,max:180,ton:'1.21',rub:'147.35',animation:'2627'},
    {id:'946',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',backdrop:'Gunship Green',symbol:'Nemes',model:'Synthwave',min:1,max:34,ton:'0.12',rub:'14.44',animation:'946'},
    {id:'779',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'violet',backdrop:'Tomato',symbol:'Fire',model:'Leopard Glam',min:1,max:180,ton:'0.3',rub:'36.91',animation:'779'},
    {id:'3269',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'blue',backdrop:'Dark Lilac',symbol:'Doberman',model:'Project Mayhem',min:1,max:180,ton:'0.4',rub:'48.58',animation:'3269'},
    {id:'3442',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🥽',bg:'amber',backdrop:'Onyx Black',symbol:'Dagger',model:'TON Vision',min:1,max:30,ton:'0.59',rub:'71.49',animation:'3442'},
    {id:'655',name:'Durov’s Glasses',collection:'Durov’s Glasses',glyph:'🕶️',bg:'violet',backdrop:'Platinum',symbol:'Spades',model:'Crystal Sight',min:1,max:180,ton:'0.3',rub:'36.91',animation:'655'},
    {id:'614',name:'Rare Bird',collection:'Rare Bird',glyph:'🦜',bg:'violet',backdrop:'Moonstone',symbol:'Turtle',model:'Noble Puffin',min:1,max:180,rub:'5.66'},
    {id:'615',name:'Rare Bird',collection:'Rare Bird',glyph:'🦚',bg:'blue',backdrop:'Tactical Pine',symbol:'Sombrero',model:'Silver Spike',min:1,max:30,rub:'4.36'},
    {id:'616',name:'Rare Bird',collection:'Rare Bird',glyph:'🪶',bg:'amber',backdrop:'Shamrock Green',symbol:'Ghost',model:'Dragon',min:2,max:179,rub:'2.89'}
  ],
  username: [
    ['goldyfix','3.65',1,90],['cuavas','3.65',1,90],['sendlives','3.65',1,90],['ywopa','3.65',1,90],['wacude','3.65',1,90],['sorbish','3.65',1,90],['portbold','3.65',1,90],['mihyp','3.67',1,90],['br_0s','1.91',1,90],['tobycollyer','3.67',1,180]
  ].map(([name,rub,min,max],i)=>({id:String(i+1),name:'@'+name,glyph:'@',bg:['violet','blue','pine','amber'][i%4],min,max,rub,ton:(Number(rub)/121.3).toFixed(2),image:`./assets/username/${name}.webp`})),
  number: [
    ['+888 0953 7412','165.04',100,180],['+888 0370 2141','172.53',34,180],['+888 0226 4750','171.18',34,180],['+888 0504 2473','163.09',34,180],['+888 0843 7159','163.09',34,90],['+888 0157 4932','163.09',34,90],['+888 0769 3604','164.44',34,180],['+888 0125 1254','256.09',34,90],['+888 0727 0919','256.09',34,90],['+888 0926 4924','165.79',34,90]
  ].map(([name,rub,min,max],i)=>({id:String(i+1),name,glyph:'☎',bg:['slate','mint','violet','blue'][i%4],min,max,rub,ton:(Number(rub)/121.3).toFixed(2),image:`./assets/number/${name.replace(/\D/g,'')}.webp`}))
};

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
let tab = 'nft';
const liveState = Object.fromEntries(['nft','username','number'].map(key=>[key,{loaded:false,loading:false,cursor:null,failed:false}]));
const categories = {nft:'gifts',username:'usernames',number:'numbers'};
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
  const previous = select.value;
  select.replaceChildren();
  const names = [...new Set(products.nft.map(item=>item.collection).filter(Boolean))];
  for (const name of names) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.append(option);
  }
  if (names.includes(previous)) select.value = previous;
}

function setTab(next) {
  tab = next;
  for (const button of document.querySelectorAll('.tab')) {
    const active = button.dataset.tab === tab;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
  }
  $('nftFilters').hidden = tab !== 'nft';
  $('usernameFilters').hidden = tab !== 'username';
  $('numberFilters').hidden = tab !== 'number';
  $('backdrop').value = 'Все';
  $('symbol').value = 'Все';
  $('model').value = 'Все';
  $('sort').value = 'default';
  fillCollections();
  renderCatalog();
  if (!liveState[tab].loaded && !liveState[tab].loading) loadOffers(tab);
}

async function loadOffers(kind, more=false) {
  const state = liveState[kind];
  if (state.loading || more && !state.cursor) return;
  state.loading = true;
  if (kind === tab) { $('loadMore').disabled = true; $('resultNote').textContent = 'Загрузка предложений MarketApp…'; }
  const query = new URLSearchParams({category:categories[kind]});
  if (more) query.set('cursor',state.cursor);
  try {
    const response = await fetch(`https://botteststarappbot.onrender.com/api/rent?${query}`);
    if (!response.ok) throw new Error('catalog unavailable');
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error('invalid catalog');
    const mapped = data.items.map((offer,index)=>{
      const name = String(offer.name), parts = name.match(/^(.*?)\s*#(\d+)$/);
      const traits = Object.fromEntries(Object.entries(offer.attributes || {}).map(([k,v])=>[k.toLowerCase(),v]));
      const imageKey = kind==='nft' && parts ? `${parts[1].replace(/[^a-z0-9]/gi,'').toLowerCase()}-${parts[2]}` :
        kind==='username' ? name.replace(/^@/,'').toLowerCase() : name.replace(/\D/g,'');
      const image = /^[a-z0-9_-]+$/.test(imageKey) ? `https://nft.fragment.com/${kind==='nft'?'gift':kind}/${imageKey}.webp` : undefined;
      return {id:parts?.[2] || String(index + 1),name:kind==='username' && !name.startsWith('@')?'@'+name:name,
        collection:parts?.[1] || name, glyph:kind==='nft'?'🎁':kind==='username'?'@':'☎', bg:'blue',
        model:traits.model, backdrop:traits.backdrop, symbol:traits.symbol,
        min:offer.min_days,max:offer.max_days,rub:String(offer.price_gram),live:true,address:offer.address,image};
    });
    products[kind] = more ? products[kind].concat(mapped.filter(item=>!products[kind].some(old=>old.address===item.address))) : mapped;
    state.cursor = typeof data.cursor === 'string' && data.cursor !== state.cursor ? data.cursor : null;
    state.loaded = true; state.failed = false;
  } catch {
    state.failed = true;
    if (more && kind === tab) toast('Не удалось загрузить следующую страницу');
  } finally {
    state.loading = false;
    if (kind === tab) { if (kind==='nft') fillCollections(); renderCatalog(); }
  }
}

function filteredProducts() {
  let items = products[tab].filter(item => {
    if (tab === 'nft') return item.collection === $('collection').value &&
      ($('backdrop').value === 'Все' || item.backdrop === $('backdrop').value) &&
      ($('symbol').value === 'Все' || item.symbol === $('symbol').value) &&
      ($('model').value === 'Все' || item.model === $('model').value);
    if (tab === 'username') {
      const name = item.name.slice(1);
      const length = $('usernameLength').value;
      return name.toLowerCase().includes($('usernameSearch').value.trim().toLowerCase().replace(/^@/,'')) &&
        (length === 'all' || length === 'short' && name.length <= 5 || length === 'medium' && name.length >= 6 && name.length <= 8 || length === 'long' && name.length >= 9) &&
        ($('usernameDigits').value === 'any' || (/[0-9]/.test(name) ? 'yes' : 'no') === $('usernameDigits').value) &&
        ($('usernameUnderscore').value === 'any' || (name.includes('_') ? 'yes' : 'no') === $('usernameUnderscore').value);
    }
    const digits = item.name.replace(/\D/g,'').slice(3);
    const search = $('numberSearch').value.replace(/\D/g,'');
    const left = digits.slice(0,4), right = digits.slice(-4);
    return (!search || item.name.replace(/\D/g,'').includes(search)) &&
      ($('numberLength').value === 'all' || ($('numberLength').value === 'short' ? digits.replace(/^0+/,'').length <= 4 : digits.replace(/^0+/,'').length > 4)) &&
      ($('numberEqual').value === 'any' || (left === right ? 'yes' : 'no') === $('numberEqual').value) &&
      ($('numberMirror').value === 'any' || (left === right.split('').reverse().join('') ? 'yes' : 'no') === $('numberMirror').value) &&
      ($('numberUnique').value === 'all' || new Set(digits).size <= Number($('numberUnique').value)) &&
      ($('numberRepeat').value === 'all' || (/([0-9])\1/.test(digits) ? 'yes' : 'no') === $('numberRepeat').value) &&
      ($('numberHasDigit').value === 'all' || digits.includes($('numberHasDigit').value));
  });
  const daily = item => Number(item.rub.replaceAll(' ', ''));
  const number = item => Number(tab === 'number' ? item.name.replace(/\D/g, '') : item.id);
  const comparators = {
    daily: (a, b) => daily(a) - daily(b),
    minimum: (a, b) => daily(a) * a.min - daily(b) * b.min,
    'duration-asc': (a, b) => a.max - b.max,
    'duration-desc': (a, b) => b.max - a.max,
    'number-asc': (a, b) => number(a) - number(b),
    'number-desc': (a, b) => number(b) - number(a)
  };
  const compare = comparators[$('sort').value];
  if (compare) items.sort(compare);
  return items;
}

function card(item) {
  const button = document.createElement('button');
  button.className = 'card';
  button.type = 'button';
  button.setAttribute('aria-label',`${item.name}, ${item.rub} ${item.live?'GRAM':'рублей'} в день`);
  const art = document.createElement('div');
  art.className = `art ${item.bg}`;
  const id = document.createElement('span');
  id.className = 'id'; id.textContent = `#${item.id}`;
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
  if (item.image) {
    const photo = document.createElement('img');
    photo.className='nft-photo'; photo.src=item.image; photo.alt=''; photo.loading='lazy';
    photo.addEventListener('error',()=>{photo.remove();art.append(glyph);});
    art.append(photo);
  }
  if (tab === 'nft') art.append(id);
  if (!item.image) art.append(glyph);
  art.append(duration);
  const name = document.createElement('strong');
  name.className = 'card-title'; name.textContent = item.name;
  const price = document.createElement('div');
  price.className = 'price';
  const main = document.createElement('strong');
  if (item.live) main.textContent=`${item.rub} GRAM/день`;
  else if (item.ton) {
    const icon = document.createElement('img'); icon.className='ton'; icon.src='./assets/ton.svg'; icon.alt='TON';
    main.append(icon,`${item.ton} /день`);
  } else main.textContent=`${item.rub} ₽/день`;
  const rub = document.createElement('small'); rub.textContent=item.live?'MarketApp':item.ton?`~${item.rub} руб.`:'Демо-цена';
  price.append(main,rub);
  button.append(art,name,price);
  button.addEventListener('click',()=>openDetail(item,button));
  return button;
}

function renderCatalog() {
  const collectionItems = products.nft.filter(item => item.collection === $('collection').value);
  for (const key of ['backdrop', 'symbol', 'model']) {
    const select = $(key), previous = select.value;
    const values = [...new Set(collectionItems.map(item => item[key]).filter(Boolean))].sort((a,b) => a.localeCompare(b));
    select.replaceChildren(...['Все', ...values].map(value => new Option(value, value)));
    select.value = values.includes(previous) ? previous : 'Все';
  }
  for (const {select, value} of filterControls) {
    if (value) value.textContent = select.id === 'collection' ? '1 выбрана' : select.selectedOptions[0]?.textContent;
  }
  animationObserver?.disconnect();
  for (const animation of animationHandles.values()) animation.destroy();
  animationHandles.clear();
  const items = filteredProducts();
  $('collectionTitle').textContent = tab==='nft' ? ($('collection').value || 'NFT') : tab==='username' ? 'Username' : 'Number';
  const count = items.length;
  const word = count % 10 === 1 && count % 100 !== 11 ? 'позиция' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'позиции' : 'позиций';
  const state = liveState[tab];
  $('resultNote').textContent = `${count} ${word} · ${state.loaded?'MarketApp, загруженные предложения':state.failed?'сохранённый снимок: MarketApp недоступен':'сохранённый снимок каталога'}`;
  $('loadMore').hidden = !state.loaded || !state.cursor;
  $('loadMore').disabled = state.loading;
  $('grid').replaceChildren(...items.map(card));
  document.querySelectorAll('.nft-animation').forEach(container => {
    if (animationObserver) animationObserver.observe(container);
  });
  $('emptyState').hidden = items.length > 0;
}

function openDetail(item,origin) {
  lastFocus = origin;
  const title=tab==='nft'?'NFT':tab==='username'?'Username':'Number';
  const message='Перейдите в бот для аренды. Оформление в демо недоступно.';
  if (tg?.initData && typeof tg.showPopup === 'function') {
    tg.showPopup({title,message,buttons:[
      {id:'cancel',type:'cancel',text:'CANCEL'},
      {id:'go',type:'default',text:'ПЕРЕЙТИ В БОТ'}
    ]}, button => {if(button==='go') tg.openTelegramLink($('goToBot').href);});
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

const filterSheet = $('filterSheet');
const sheetOptions = $('filterSheetOptions');
const sheetSearch = $('filterSheetSearch');
const searchableFilters = {
  collection: ['Выбор коллекций', 'Поиск коллекций…'],
  backdrop: ['Выбор фона', 'Поиск фонов…'],
  symbol: ['Выбор символа', 'Поиск символов…'],
  model: ['Выбор модели', 'Поиск моделей…']
};
let openFilter;
let draftValue;

function showFilterOptions() {
  const query = sheetSearch.value.trim().toLowerCase();
  const options = [...openFilter.options].filter(option => option.textContent.toLowerCase().includes(query));
  sheetOptions.replaceChildren();
  for (const option of options) {
    const row = document.createElement('label');
    row.className = 'filter-sheet-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'filter-choice';
    input.value = option.value;
    input.checked = option.value === draftValue;
    input.addEventListener('change', () => { draftValue = input.value; });
    row.append(input, option.textContent);
    sheetOptions.append(row);
  }
  if (!options.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Ничего не найдено';
    sheetOptions.append(empty);
  }
}

const filterControls = [...document.querySelectorAll('#catalogPage .filter select, #sort')].map(select => {
  const label = select.parentElement;
  const isSort = select.id === 'sort';
  const name = isSort ? 'Сортировка' : label.querySelector('span').textContent;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = label.className + ' filter-trigger';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'filterSheet');
  const value = isSort ? null : document.createElement('strong');
  for (const child of label.children) {
    if (child !== select && !child.classList.contains('filter-count')) trigger.append(child.cloneNode(true));
  }
  if (value) trigger.insertBefore(value, trigger.querySelector('i'));
  else trigger.append(name);
  label.hidden = true;
  label.after(trigger);
  trigger.addEventListener('click', () => {
    openFilter = select;
    draftValue = select.value;
    const [title, placeholder] = searchableFilters[select.id] || [name];
    $('filterSheetTitle').textContent = title;
    sheetSearch.hidden = !placeholder;
    sheetSearch.value = '';
    sheetSearch.placeholder = placeholder || '';
    sheetSearch.setAttribute('aria-label', placeholder || 'Поиск');
    showFilterOptions();
    sheetOptions.scrollTop = 0;
    filterSheet.showModal();
  });
  return {select, value};
});

sheetSearch.addEventListener('input', showFilterOptions);
$('closeFilterSheet').addEventListener('click', () => filterSheet.close());
filterSheet.addEventListener('click', event => {
  if (event.target !== filterSheet) return;
  const bounds = filterSheet.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) filterSheet.close();
});
$('applyFilterSheet').addEventListener('click', () => {
  openFilter.value = draftValue;
  filterSheet.close();
  renderCatalog();
});
document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));
for(const id of ['usernameSearch','numberSearch']) $(id).addEventListener('input',renderCatalog);
$('loadMore').addEventListener('click',()=>loadOffers(tab,true));
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
