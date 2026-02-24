const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2/promise');
const chalk = require('chalk');
const fs = require('fs');
const cron = require('node-cron');

const CONFIG = {
    TOKEN: '8220999139:AAFxqrGLW-cF1Lxbv2yFcaMqmU6eJqRq3CI',
    DB: {
        host: '101.255.110.205',
        port: 33608,
        user: 'client',
        password: '##rsal2020',
        database: 'sikrsal',
        waitForConnections: true,
        connectionLimit: 5
    }
};

const pool = mysql.createPool(CONFIG.DB);
const bot = new TelegramBot(CONFIG.TOKEN, { polling: true });

console.log(chalk.bold.cyan("🚀 Bot SIMRS Khanza Aktif..."));

// Logika bot Anda di sini...
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";
    const name = msg.from.first_name;

    if (msg.reply_to_message && msg.reply_to_message.text.includes("No.Rawat:")) {
        try {
            const noRawat = msg.reply_to_message.text.split("No.Rawat: ")[1].split("\n")[0].trim();
            const nominal = parseFloat(text.replace(/[^0-9]/g, ''));
            if (!isNaN(nominal)) {
                await pool.execute("REPLACE INTO standar_pelayanan_pasien (no_rawat, nilai_angka, tgl_input, petugas) VALUES (?, ?, NOW(), ?)", [noRawat, nominal, `TG: ${name}`]);
                bot.sendMessage(chatId, `✅ Berhasil! No.Rawat ${noRawat} diset: Rp ${nominal.toLocaleString()}`);
            }
        } catch (err) { console.log(err); }
    } else {
        bot.sendMessage(chatId, `Halo ${name}, ID Anda: ${chatId}`);
    }
});
