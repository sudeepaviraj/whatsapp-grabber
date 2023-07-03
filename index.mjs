import {WhatsappClient} from "./functions/WhatsappGrabber.mjs";

const client = new WhatsappClient

const groups = await client.GetGroups()

console.log(groups)




