document.addEventListener('DOMContentLoaded', () => {
  // Enkripsi dasar nomor WhatsApp agar tidak langsung dibaca oleh Bot Scraper
  const CONTACT_MAP = {
    '1': { country: '62', num: '81328520571' },
    '2': { country: '62', num: '85848626163' }
  };

  let lastClickTime = 0;
  const RATE_LIMIT_MS = 1500; // Mencegah spam klik (minimal jeda 1.5 detik)

  // Fungsi Redirect WhatsApp yang Aman
  function safeRedirectWA(adminKey) {
    const now = Date.now();
    if (now - lastClickTime < RATE_LIMIT_MS) {
      console.warn('Terlalu cepat melakukan klik!');
      return;
    }
    lastClickTime = now;

    const contact = CONTACT_MAP[adminKey];
    if (!contact) return;

    // Sanitasi nomor telepon (hanya izinkan angka)
    const cleanNumber = (contact.country + contact.num).replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanNumber}`;

    // Buka di tab baru dengan proteksi window.opener
    const newWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  }

  // Event Listener untuk semua tombol WA dengan penanganan aman
  const secureButtons = document.querySelectorAll('.wa-secure');
  secureButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const adminTarget = button.getAttribute('data-admin') || '1';
      safeRedirectWA(adminTarget);
    });
  });

  // Set tahun otomatis di footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});