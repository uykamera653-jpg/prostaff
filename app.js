// ==== Service Worker (PWA) ====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

// ==== i18n ====
const I18N = {
  uz: {
    nav:{firms:"Firmalar",logout:"Chiqish"},
    tabs:{home:"Home",worker:"Ishchi",firms:"Firmalar"},
    home:{
      title:"Tezkor xizmat kerakmi?",
      subtitle:"Tozalash, ta’mirlash, ko‘chirish va boshqalar — yaqin atrofdagi ijrochilar orqali.",
      cards:{
        today:{title:"Ishchi chaqirish",desc:"Zudlik bilan ishchi kerakmi? Darhol buyurtma qoldiring."},
        firms:{title:"Firmalarni ko‘rish",desc:"Xizmat ko‘rsatuvchi tashkilotlar ro‘yxati va reytinglari."}
      }
    },
    ad:{msg:"★ BU YERDA SIZNING REKLAMANGIZ BO‘LISHI MUMKIN ★",mail:"Reklama joylash uchun: reklama@prostaff.uz"},
    today:{title:"Bugun — ishchi chaqirish",switchTomorrow:"Ertaga uchun buyurtma →"},
    tomorrow:{title:"Ertaga — ishchi bron qilish",switchToday:"Bugun uchun →"},
    form:{
      service:"Xizmat turi", people:"Necha kishi", city:"Shahar", date:"Sana", time:"Vaqt / Soat",
      address:"Manzil (aniq joy)", desc:"Ish haqida ma’lumot",
      photos:"Rasm(lar) (ixtiyoriy)", photosHint:"8 ta, har biri ≤5MB",
      gps:"GPS", getGps:"GPS ni olish", gpsHint:"Joylashuv uchun brauzer ruxsati talab etiladi.",
      publish:"E’lonni yuborish"
    },
    services:{clean:"Tozalash",repair:"Ta’mirlash",move:"Ko‘chirish",garden:"Bog‘"},
    firms:{title:"Xizmat ko‘rsatish firmalari",search:"Qidirish...",all:"Barchasi"}
  },
  ru: {
    nav:{firms:"Компании",logout:"Выйти"},
    tabs:{home:"Главная",worker:"Рабочие",firms:"Компании"},
    home:{
      title:"Нужна срочная услуга?",
      subtitle:"Уборка, ремонт, переезд и другое — исполнители поблизости.",
      cards:{
        today:{title:"Вызвать рабочего",desc:"Рабочие сегодня. Оставьте заявку."},
        firms:{title:"Посмотреть компании",desc:"Список и рейтинги сервисных компаний."}
      }
    },
    ad:{msg:"★ ЗДЕСЬ МОЖЕТ БЫТЬ ВАША РЕКЛАМА ★",mail:"По рекламе: reklama@prostaff.uz"},
    today:{title:"Сегодня — вызвать рабочих",switchTomorrow:"На завтра →"},
    tomorrow:{title:"Завтра — бронь рабочих",switchToday:"На сегодня →"},
    form:{
      service:"Тип услуги", people:"Сколько рабочих", city:"Город", date:"Дата", time:"Время",
      address:"Адрес (точный)", desc:"Описание работы",
      photos:"Фото (по желанию)", photosHint:"До 8, каждый ≤5MB",
      gps:"GPS", getGps:"Получить GPS", gpsHint:"Потребуется разрешение браузера.",
      publish:"Опубликовать"
    },
    services:{clean:"Уборка",repair:"Ремонт",move:"Переезд",garden:"Сад"},
    firms:{title:"Сервисные компании",search:"Поиск...",all:"Все"}
  },
  en: {
    nav:{firms:"Companies",logout:"Logout"},
    tabs:{home:"Home",worker:"Workers",firms:"Companies"},
    home:{
      title:"Need a quick service?",
      subtitle:"Cleaning, repair, moving and more — nearby providers.",
      cards:{
        today:{title:"Hire worker today",desc:"Need help now? Place an order."},
        firms:{title:"Browse companies",desc:"Directory and ratings of providers."}
      }
    },
    ad:{msg:"★ YOUR AD CAN BE HERE ★",mail:"Ads: reklama@prostaff.uz"},
    today:{title:"Today — hire workers",switchTomorrow:"For tomorrow →"},
    tomorrow:{title:"Tomorrow — book workers",switchToday:"For today →"},
    form:{
      service:"Service type", people:"People", city:"City", date:"Date", time:"Time",
      address:"Address (precise)", desc:"Job details",
      photos:"Photo(s) (optional)", photosHint:"Up to 8, each ≤5MB",
      gps:"GPS", getGps:"Get GPS", gpsHint:"Browser permission required.",
      publish:"Publish order"
    },
    services:{clean:"Cleaning",repair:"Repair",move:"Moving",garden:"Garden"},
    firms:{title:"Service providers",search:"Search...",all:"All"}
  }
};

const LANG_KEY = 'prostaff_lang';
const langBtns = document.querySelectorAll('[data-lang]');
function setLang(l){
  localStorage.setItem(LANG_KEY, l);
  const dict = I18N[l] || I18N.uz;
  // data-i18n (text)
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((a,k)=>a?a[k]:null, dict);
    if (val) el.textContent = val;
  });
  // data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    const val = key.split('.').reduce((a,k)=>a?a[k]:null, dict);
    if (val) el.placeholder = val;
  });
  // select options with data-i18n on <option>
  document.querySelectorAll('option[data-i18n]').forEach(op=>{
    const key = op.getAttribute('data-i18n');
    const val = key.split('.').reduce((a,k)=>a?a[k]:null, dict);
    if (val) op.textContent = val;
  });
}
langBtns.forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
setLang(localStorage.getItem(LANG_KEY)||'uz');

// ==== Counter buttons ====
document.querySelectorAll('.counter').forEach(c=>{
  const inp = c.querySelector('input[type="number"]');
  c.querySelector('.ctr--inc')?.addEventListener('click',()=>{inp.value = (+inp.value||1)+1;});
  c.querySelector('.ctr--dec')?.addEventListener('click',()=>{inp.value = Math.max(1,(+inp.value||1)-1);});
});

// ==== Photos preview ====
const photosInput = document.getElementById('photos');
if (photosInput){
  photosInput.addEventListener('change', ()=>{
    const box = document.getElementById('preview');
    box.innerHTML = '';
    [...photosInput.files].slice(0,8).forEach(f=>{
      if (!f.type.startsWith('image/') || f.size>5*1024*1024) return;
      const img = document.createElement('img');
      img.alt = f.name;
      img.src = URL.createObjectURL(f);
      box.appendChild(img);
    });
  });
}

// ==== GPS ====
const gpsBtn = document.getElementById('gpsBtn');
if (gpsBtn){
  gpsBtn.addEventListener('click', ()=>{
    const gpsText = document.getElementById('gpsText');
    const latInp = document.querySelector('input[name="lat"]');
    const lngInp = document.querySelector('input[name="lng"]');
    gpsText.textContent = 'GPS: ...';
    if (!navigator.geolocation){
      gpsText.textContent = 'GPS: not supported';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const {latitude, longitude} = pos.coords;
        latInp.value = latitude.toFixed(6);
        lngInp.value = longitude.toFixed(6);
        gpsText.textContent = `GPS: ${latInp.value}, ${lngInp.value}`;
      },
      err=>{
        gpsText.textContent = 'GPS: permission denied';
      },
      {enableHighAccuracy:true, timeout:10000}
    );
  });
}

// ==== Form submit (localStorage mock) ====
const form = document.getElementById('orderForm');
if (form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    data.count = +data.count || 1;
    data.date = data.date || new Date().toISOString().slice(0,10);
    // files: we only keep names for demo
    data.photos = [...(fd.getAll('photos')||[])].map(f=>f?.name).filter(Boolean).slice(0,8);
    const list = JSON.parse(localStorage.getItem('orders')||'[]');
    list.unshift({...data, ts:Date.now()});
    localStorage.setItem('orders', JSON.stringify(list));
    // toast
    toast('✅ Buyurtmangiz qabul qilindi!');
    form.reset();
    document.getElementById('preview')?.replaceChildren();
    document.getElementById('gpsText')?.textContent = 'GPS: —';
  });
}

// Simple toast
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),300);}, 2200);
}
const style = document.createElement('style');
style.textContent = `.toast{position:fixed;left:50%;bottom:84px;transform:translateX(-50%) scale(.96);background:#071120;color:#d1e7ff;border:1px solid #22d3ee55;border-radius:12px;padding:10px 14px;opacity:0;transition:.25s;z-index:99}
.toast.show{opacity:1;transform:translateX(-50%) scale(1)}`;
document.head.appendChild(style);

// ==== Firms list (mock) ====
const FIRMS = [
  {id:1, name:'CleanPro', cat:'clean', rating:4.8, city:'Toshkent', phone:'+998 90 123-45-67', tags:['eco','24/7']},
  {id:2, name:'MoveMax', cat:'move', rating:4.6, city:'Toshkent', phone:'+998 93 700-00-11', tags:['lift','truck']},
  {id:3, name:'MasterFix', cat:'repair', rating:4.7, city:'Samarqand', phone:'+998 99 222-33-44', tags:['warranty']},
  {id:4, name:'GreenLeaf', cat:'garden', rating:4.5, city:'Namangan', phone:'+998 97 555-66-77', tags:['design','drip']},
  {id:5, name:'Sparkle', cat:'clean', rating:4.3, city:'Toshkent', phone:'+998 90 765-43-21', tags:['office']},
];
const firmsWrap = document.getElementById('firms');
if (firmsWrap){
  const q = document.getElementById('q');
  const cat = document.getElementById('cat');

  function render(){
    const term = (q.value||'').toLowerCase();
    const c = cat.value;
    firmsWrap.innerHTML = '';
    FIRMS.filter(f=>
      (!c || f.cat===c) &&
      (f.name.toLowerCase().includes(term) || f.city.toLowerCase().includes(term))
    ).forEach(f=>{
      const el = document.createElement('div');
      el.className = 'card card-firm';
      el.innerHTML = `
        <div class="card-firm__logo">${f.name[0]}</div>
        <div class="card-firm__body">
          <h4>${f.name} <span class="stars">★ ${f.rating.toFixed(1)}</span></h4>
          <div class="card-firm__tags">
            <span class="tag">#${f.cat}</span>
            <span class="tag">${f.city}</span>
            ${f.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
          </div>
          <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
            <a class="btn btn--line" href="tel:${f.phone.replace(/\s/g,'')}">📞 ${f.phone}</a>
            <a class="btn" href="bugun.html">👷 Ish buyurtma</a>
          </div>
        </div>`;
      firmsWrap.appendChild(el);
    });
    if (!firmsWrap.children.length){
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.style.padding='14px';
      empty.textContent = 'Hech narsa topilmadi.';
      firmsWrap.appendChild(empty);
    }
  }

  q.addEventListener('input', render);
  cat.addEventListener('change', render);
  render();
      }
