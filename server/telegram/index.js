// // require('dotenv').config()
// // const express = require('express');
// // const morgan = require('morgan'); 
// // const Dao = require('./dao.js');
// // const axios = require('axios')
// // const { Telegraf,Markup  } = require('telegraf');
// // const { TOKEN, SERVER_URL } = process.env
// // const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
// // const URI = `/webhook/${TOKEN}`
// // const WEBHOOK_URL = SERVER_URL + URI
// // const bot = new Telegraf(TOKEN);
// // bot.use(TelegrafQuestion<bot>({
// //   cancelTimeout: 300000 // 5 min
// // }));


// bot.command('quit', (ctx) => {
//   ctx.telegram.leaveChat(ctx.message.chat.id)
//   ctx.leaveChat()
// })


// bot.command('start', async (ctx) => {
//   await Dao.InsertChatId(ctx.message.chat.id,ctx.message.from.username);
//   console.log(ctx.message.chat.id);
//   ctx.reply(`Dear ${ctx.message.from.username} Welcome to Solidary Shopings`)
//   ctx.reply(`📲 Please send your phone number`)

// })


// bot.command('wallet', (ctx) => {
//   ctx.reply(`Youre Account is not sync with your chat Id Please Insert your username and password for access to this opotions`);
//     ctx.reply(`Please send youre 📲 Send phone number`)
//     ctx.reply(`the template Of login is:`)
// })

// bot.command('notifications', (ctx) => {
//   console.log("you can see your wallet");
//   ctx.reply(`you can see your wallet`)
// })

// bot.command('yes', async (ctx, next) => {
//   const start = new Date()
//   ctx.reply('Hello')
//   await next()
//   ctx.reply('no')
//   const ms = new Date() - start
//   console.log('Response time: %sms', ms)
// });

// bot.command('animals1', ctx => {
//   let animalMessage = `great, here are pictures of animals you would love`;
//   ctx.deleteMessage();
//   bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
//     reply_markup: {
//       inline_keyboard: [
//         [{
//           text: "age",
//           callback_data: 'change_age'
//         },
//         {
//           text: "cat",
//           callback_data: 'change_age'
//         },
//         {
//           text: "📲 Send phone number",
//             request_contact: true,
//             callback_data: 'dog'
//         }
//         ],

//       ]
//     }
//   })
// });


// bot.launch()
// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))
// bot.on('text',async (ctx) => {
//   console.log(ctx.message.text)
//   if (ctx.message.text.length==10)
//   {
//     var x= await Dao.updateMobile(ctx.message.text,ctx.message.chat.id)
//     ctx.reply(`Your Number is Saved, For Change it you can send phone number again in the chat`);
//     ctx.replyWithHTML(`Now You can change or send your password,attention: send your password with this template For Example:`);
//     ctx.reply(`my password: mnbvcxz`);
//     return
//   }

//   if (ctx.message.text.split(":")[0]==="my password")
//   {
//     return
//   }
//   ctx.reply(`The Command is worng Please Use From Command To Help You`)
// })


