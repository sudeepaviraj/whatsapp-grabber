const prompts = require('prompts');
const venom = require('venom-bot');
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const fs = require("fs")

async function main() {

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function list_groups(client) {
        client.getAllChatsGroups().then(async (groups)=>{
            let options = []
            groups.forEach(element => {
                options = [...options,{ title: element.name, description: 'Get All Group Chats', value: element.id._serialized }]
            });
            await prompts([
                {
                    type: 'multiselect',
                    name: 'group_select',
                    message: 'Group Select Menu',
                    choices: options,
                }
            ]).then((res)=>{
                res.group_select.forEach(async group => {
                    client.getGroupMembers(group).then(async(number)=>{
                        console.log(`${number.length-1} Numbers Found!`);
                        bar1.start(number.length-1,0)
                        number.forEach(async user => {
                            if(!user.isMe){
                                console.log(group);
                                fs.appendFileSync("output.txt",`${user.id.user}\n`)
                            }
                        });
                    });
                });
            })
        })
    }

    async function start(client) {
        await prompts([
            {
                type: 'select',
                name: 'login_menu',
                message: `
                █   █▀█ █▀▀ █ █▄ █   █▀ █ █ █▀▀ █▀▀ █▀▀ █▀ █▀   █
                █▄▄ █▄█ █▄█ █ █ ▀█   ▄█ █▄█ █▄▄ █▄▄ ██▄ ▄█ ▄█   ▄
                
                Select Item To Continue...


                `,
                choices: [
                    { title: 'Get Group Members 🔢', description: 'Get All Numbers From Group Chats', value: 'get_groups' },
                    { title: 'Send Messages To Groups 📤', description: 'Get All Group Chats', value: 'send_message' },
                ],
            }
        ]).then((res) => {
            if (res.login_menu==="get_groups") {
                list_groups(client)
            }
        })
    }

    async function venom_bot() {
        venom
            .create({
                session: 'grab',
            })
            .then((client) =>
                start(client))
            .catch((erro) => {
                console.log(erro);
            });
    }


    await prompts([
        {
            type: 'select',
            name: 'main_menu',
            message: `
            █ █ █ █▀▀ █   █▀▀ █▀█ █▀▄▀█ █▀▀
            ▀▄▀▄▀ ██▄ █▄▄ █▄▄ █▄█ █ ▀ █ ██▄\n\n
            `,
            choices: [
                { title: 'Login To Whatsapp 🔐', description: 'Login To Your Whatsapp Account', value: 'login' },
                { title: 'Clear Login Cache 🧹', description: 'Clear Saved Cache', value: 'clear' },
                { title: 'Exit ❌', description: 'Clear Saved Cache', value: 'exit' },
            ],
        }
    ]).then((res) => {
        if (res.main_menu==="login") {
            console.log(`
            █▀█ █   █▀▀ ▄▀█ █▀ █▀▀   █ █ █ ▄▀█ █ ▀█▀     
            █▀▀ █▄▄ ██▄ █▀█ ▄█ ██▄   ▀▄▀▄▀ █▀█ █  █  ▄ ▄ ▄`);
            venom_bot()
        }
        if (res.main_menu==="clear") {
            console.log(`
            █▀█ █   █▀▀ ▄▀█ █▀ █▀▀   █ █ █ ▄▀█ █ ▀█▀     
            █▀▀ █▄▄ ██▄ █▀█ ▄█ ██▄   ▀▄▀▄▀ █▀█ █  █  ▄ ▄ ▄`);
            console.log(`
            █▀▀ ▄▀█ █▀▀ █ █ █▀▀   █▀▀ █   █▀▀ ▄▀█ █▀█ █▀▄   █
            █▄▄ █▀█ █▄▄ █▀█ ██▄   █▄▄ █▄▄ ██▄ █▀█ █▀▄ █▄▀   ▄`);
        }
        if (res.main_menu==="exit") {
            console.log(`
            █▀▀ █▀█ █▀█ █▀▄   █▄▄ █▄█ █▀▀   █
            █▄█ █▄█ █▄█ █▄▀   █▄█  █  ██▄   ▄`);
            process.exit(1)
        }
    })
}

main();

