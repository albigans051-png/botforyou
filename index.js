const http = require('http');
const { Client } = require('discord.js-selfbot-v13');

const { TOKEN, VOICE_CHANNEL_ID, PORT = 3000, RENDER_EXTERNAL_URL } = process.env;

if (!TOKEN || !VOICE_CHANNEL_ID) {
  console.error('Environment variable TOKEN dan VOICE_CHANNEL_ID wajib diisi.');
  process.exit(1);
}

// ---- Web server kecil (Render Web Service wajib membuka port) ----
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('AFK voice aktif');
  })
  .listen(PORT, '0.0.0.0', () => console.log(`Web server jalan di port ${PORT}`));

// Self-ping supaya service free tidak cepat tidur (lebih aman tambah UptimeRobot)
if (RENDER_EXTERNAL_URL) {
  setInterval(() => {
    fetch(RENDER_EXTERNAL_URL).catch(() => {});
  }, 10 * 60 * 1000);
}

// ---- Client akun user ----
const client = new Client();

let joining = false;

async function joinVoice() {
  if (joining) return;
  joining = true;

  try {
    const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
    if (!channel) throw new Error('Voice channel tidak ditemukan / akun tidak punya akses.');

    await client.voice.joinChannel(channel, {
      selfMute: true,
      selfDeaf: true,
      selfVideo: false,
    });
    console.log(`Berhasil join voice: ${channel.name}`);
  } catch (err) {
    console.error('Gagal join voice:', err.message);
    setTimeout(joinVoice, 15_000);
  } finally {
    joining = false;
  }
}

function isInTargetChannel() {
  const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
  const state = channel?.guild?.voiceStates?.cache.get(client.user.id);
  return state?.channelId === VOICE_CHANNEL_ID;
}

client.once('ready', () => {
  console.log(`Login sebagai ${client.user.username}`);
  joinVoice();

  // Watchdog: cek tiap 1 menit, kalau tidak di voice langsung join lagi
  setInterval(() => {
    if (!isInTargetChannel()) joinVoice();
  }, 60_000);
});

// Kalau akun kepindah / ke-disconnect dari voice, join ulang
client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.id !== client.user.id) return;
  if (newState.channelId !== VOICE_CHANNEL_ID) {
    console.log('Keluar dari voice channel, join ulang...');
    setTimeout(joinVoice, 5_000);
  }
});

client.on('error', (e) => console.error('Client error:', e));
process.on('unhandledRejection', (e) => console.error('Unhandled rejection:', e));

client.login(TOKEN);
