// === umumiy ===
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function toast(msg) {
  const t = $('#toast') || Object.assign(document.createElement('div'), { id: 'toast', className: 'toast' , innerText: ''});
  if (!t.isConnected) document.body.appendChild(t);
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// stepper
$$('.step').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const val = Number(input.value || 0);
    const min = Number(input.min || 0);
    const max = Number(input.max || 999);
    input.value = btn.classList.contains('plus') ? Math.min(max, val + 1) : Math.max(min, val - 1);
  });
});

// rasm preview
function initPreview(inputId, wrapId){
  const input = document.getElementById(inputId);
  const wrap  = document.getElementById(wrapId);
  if (!input || !wrap) return;
  input.addEventListener('change', () => {
    wrap.innerHTML = '';
    [...input.files].slice(0,8).forEach(file => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(img.src);
      wrap.appendChild(img);
    });
  });
}
initPreview('files-bugun','preview-bugun');
initPreview('files-ertaga','preview-ertaga');

// GPS olish
const gpsBtn = $('#btn-gps');
if (gpsBtn) {
  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return toast('GPS qurilmangizda mavjud emas');
    gpsBtn.disabled = true;
    gpsBtn.textContent = '📍 Olinmoqda...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const label = $('#gps-label');
        if (label) label.textContent = `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        const manzil = $('#manzil');
        if (manzil && !manzil.value) manzil.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        gpsBtn.textContent = '📍 GPS';
        gpsBtn.disabled = false;
      },
      () => {
        toast('GPSni olish muvaffaqiyatsiz.');
        gpsBtn.textContent = '📍 GPS';
        gpsBtn.disabled = false;
      },
      { enableHighAccuracy:true, timeout:8000 }
    );
  });
}

// Forma yuborish (demo — localStorage)
function handleForm(formId, type){
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.turi = type; // 'bugun' yoki 'ertaga'
    data.vaqtStamp = Date.now();
    const arr = JSON.parse(localStorage.getItem('prostaff_orders') || '[]');
    arr.unshift(data);
    localStorage.setItem('prostaff_orders', JSON.stringify(arr));
    toast('E’lon qabul qilindi ✅');
    setTimeout(()=> window.location.href = 'index.html', 700);
  });
}
handleForm('form-bugun','bugun');
handleForm('form-ertaga','ertaga');

// Firmalar ro‘yxati (demo)
(function initFirmalar(){
  const box = $('#firm-list');
  if (!box) return;
  const data = [
    { nom:'CleanPro', tur:'Tozalash', reyting:4.8 },
    { nom:'UstaPlus', tur:'Usta', reyting:4.7 },
    { nom:'Ko‘chirish.uz', tur:'Ko‘chirish', reyting:4.6 },
    { nom:'GreenGarden', tur:'Bog‘ ishlari', reyting:4.5 }
  ];
  function render(list){
    box.innerHTML = '';
    list.forEach(f => {
      const el = document.createElement('div');
      el.className = 'item';
      el.innerHTML = `
        <div class="av"></div>
        <div>
          <h4>${f.nom}</h4>
          <small>${f.tur} • ⭐ ${f.reyting}</small>
        </div>
        <span style="margin-left:auto"></span>
        <a class="btn" href="bugun.html">Buyurtma</a>`;
      box.appendChild(el);
    });
  }
  render(data);
  const search = $('#search');
  if (search){
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase();
      render(data.filter(f => (f.nom+f.tur).toLowerCase().includes(q)));
    });
  }
})();
