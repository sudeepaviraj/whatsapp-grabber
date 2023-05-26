const prompts = require('prompts');
const venom = require('venom-bot');
const cliProgress = require('cli-progress');
const fs = require("fs")
const XLSX = require('xlsx');

async function main() {
	const wb = XLSX.utils.book_new();


    async function ExportToExcel(data,index) {
        const fileName = 'output.xlsx';
		const ws = XLSX.utils.json_to_sheet(data);
		XLSX.utils.book_append_sheet(wb, ws, `Sheet ${index}`);
		XLSX.writeFile(wb, fileName);
    }

    async function list_groups(client) {
        await client.getAllChatsGroups().then(async (groups) => {
            let options = []
            groups.forEach((element) => {
                options = [...options, { title: element.name, description: 'Get All Group Chats', value: { id: element.id._serialized, name: element.name } }]
            });
            await prompts([
                {
                    type: 'multiselect',
                    name: 'group_select',
                    message: 'Group Select Menu',
                    choices: options,
                }
            ]).then((res) => {
                res.group_select.forEach(async (group,group_index) => {
                    client.getGroupMembers(group.id).then(async (number) => {
                        fs.appendFileSync(`output.txt`, `${group.name}\n`)
                        console.log(`\n${number.length - 1} Numbers Found In ${group.name}\n`);
                        let bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
                        bar1.start(number.length - 1, 0)
                        let numberlist = []
                        number.forEach(async (user, index) => {
                            if (!user.isMe) {
                                fs.appendFileSync(`output.txt`, `${user.id.user}\n`)
                                numberlist = [...numberlist,{id:index,number:user.id.user,user_id:user.id._serialized,group:group.name}]
                                bar1.increment()
                                
                            }
                        });
                        ExportToExcel(numberlist,group_index)
                        bar1.stop()
                        console.log(`\n${group.name} Numbers Saved!\n`);
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
            if (res.login_menu === "get_groups") {
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
        if (res.main_menu === "login") {
            console.log(`
            █▀█ █   █▀▀ ▄▀█ █▀ █▀▀   █ █ █ ▄▀█ █ ▀█▀     
            █▀▀ █▄▄ ██▄ █▀█ ▄█ ██▄   ▀▄▀▄▀ █▀█ █  █  ▄ ▄ ▄`);
            venom_bot()
        }
        if (res.main_menu === "clear") {
            console.log(`
            █▀█ █   █▀▀ ▄▀█ █▀ █▀▀   █ █ █ ▄▀█ █ ▀█▀     
            █▀▀ █▄▄ ██▄ █▀█ ▄█ ██▄   ▀▄▀▄▀ █▀█ █  █  ▄ ▄ ▄`);
            console.log(`
            █▀▀ ▄▀█ █▀▀ █ █ █▀▀   █▀▀ █   █▀▀ ▄▀█ █▀█ █▀▄   █
            █▄▄ █▀█ █▄▄ █▀█ ██▄   █▄▄ █▄▄ ██▄ █▀█ █▀▄ █▄▀   ▄`);
        }
        if (res.main_menu === "exit") {
            console.log(`
            █▀▀ █▀█ █▀█ █▀▄   █▄▄ █▄█ █▀▀   █
            █▄█ █▄█ █▄█ █▄▀   █▄█  █  ██▄   ▄`);
            process.exit(1)
        }
    })
}

main();

