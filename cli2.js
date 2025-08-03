const inquirer = require('inquirer')
const chalk = require('chalk')

module.exports = function(socket) {
  console.log(chalk.green('💬 FaruqCLI siap digunakan!\n'))

  const mainMenu = async () => {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Pilih aksi:',
        choices: ['Kirim Pesan', 'Keluar']
      }
    ])

    if (action === 'Kirim Pesan') {
      const { number, message } = await inquirer.prompt([
        { name: 'number', message: 'Nomor Tujuan (62xxxx):' },
        { name: 'message', message: 'Pesan:' }
      ])

      await socket.sendMessage(`${number}@s.whatsapp.net`, { text: message })
      console.log(chalk.green('✅ Pesan terkirim!'))
      mainMenu()
    }

    if (action === 'Keluar') {
      console.log(chalk.yellow('👋 Keluar dari FaruqCLI.'))
      process.exit()
    }
  }

  mainMenu()
}
