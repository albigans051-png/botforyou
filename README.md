# botforyou
Make Your Discord Account 24/7 On Voice Channels!

Tutorial Singkat: Bot AFK Voice Discord di Render.com

⚠️ Selfbot (login pakai akun biasa) melanggar ToS Discord. Pakai akun alt.

1. Ambil Token
Login Discord di browser → Ctrl+Shift+I → tab Console.
Kalau diminta, ketik allow pasting → Enter.
Paste script pengambil token (sudah diberikan sebelumnya) → Enter → token otomatis tersalin.

3. Ambil ID Voice Channel
Settings → Advanced → aktifkan Developer Mode → klik kanan voice channel → Copy Channel ID.

4. Upload Kode ke GitHub
Buat repo baru (private) → upload index.js dan package.json → Commit.

5. Deploy di Render
render.com → New + → Web Service → pilih repo-mu.
Isi:
Build Command: npm install
Start Command: npm start
Instance Type: Free
Tambah Environment Variables:
Key	Value
TOKEN	token dari langkah 1
VOICE_CHANNEL_ID	ID dari langkah 2
Klik Create Web Service.

6. Cek Log
Tab Logs → tunggu sampai muncul:
Login sebagai NamaAkunmu
Berhasil join voice: NamaChannel
Kalau error, kirim teksnya ke sini.

Catatan
Jangan commit token ke GitHub.
Token bocor → reset password Discord langsung.
Login pertama dari server Render kadang butuh verifikasi captcha/email — kalau gagal, login manual dulu dari browser biasa pakai akun itu.
