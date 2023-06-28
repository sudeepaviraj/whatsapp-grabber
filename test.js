// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create({
    session: 'session-name' //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

async function start(client) {
    const chats = await client.getAllChatsGroups();
    // console.log(chats[0].id._serialized);
    const members = await client.getGroupMembersIds(chats[0].id._serialized);
    console.log(members)
}