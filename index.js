const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore } = require('@whiskeysockets/baileys')
const { default: chalk } = require('chalk')
const figlet = require('figlet')
const ora = require('ora')
const fs = require('fs')
const cli = require('./cli2')

async function startFaruqCLI() {
  console.clear()
  console.log(chalk.cyan(figlet.textSync('FaruqCLI')))
  const spinner = ora('⏳ Loading session...').start()

  const { state, saveCreds } = await useMultiFileAuthState('./faruq-store')
  const { version } = await fetchLatestBaileysVersion()
  const socket = makeWASocket({
    version,
    auth: state,
    browser: ['FaruqCLI', 'Chrome', '1.0.0'],
    printQRInTerminal: false
  })

  socket.ev.on('creds.update', saveCreds)

  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, isNewLogin } = update
    if (connection === 'open') {
      spinner.succeed(chalk.green('✅ Terhubung ke WhatsApp!'))
      cli(socket)
    } else if (connection === 'close') {
      spinner.fail(chalk.red('❌ Koneksi terputus.'))
      if (lastDisconnect?.error?.output?.statusCode !== 401) {
        startFaruqCLI()
      } else {
        console.log(chalk.red('⚠️ Gagal login, hapus session dan coba lagi.'))
      }
    }
  })

  if (!fs.existsSync('./faruq-store/creds.json')) {
    const pairingCode = await socket.requestPairingCode("62xxxxxxxxxx@s.whatsapp.net")
    console.log(chalk.blue(`\n🔗 Pair via WA link:\n${pairingCode}\n`))
  }
}

startFaruqCLI()
