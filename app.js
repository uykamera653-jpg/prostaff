// PWA SW ro'yxatga olish
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  });
}

// Hech qanday chip/kategoriya yo‘q. Qo‘shimcha JS kerak bo‘lsa shu yerga qo‘shamiz.
