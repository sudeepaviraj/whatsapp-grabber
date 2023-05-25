const prompts = require('prompts');
const venom = require('venom-bot');
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

async function main() {

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
                        number.forEach(user => {
                            console.log(user._id._serialized);
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
                message: 'Account Menu',
                choices: [
                    { title: 'Get Group Members', description: 'Get All Numbers From Group Chats', value: 'get_groups' },
                    { title: 'Send Messages To Groups', description: 'Get All Group Chats', value: 'send_message' },
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
            message: 'Main Menu',
            choices: [
                { title: 'Login', description: 'Login To Your Whatsapp Account ', value: 'login' },
                { title: 'Login', description: 'Login To Your Whatsapp Account ', value: 'login' },
            ],
        }
    ]).then((res) => {
        if (res.main_menu==="login") {
            venom_bot()
        }
    })
}

main();

