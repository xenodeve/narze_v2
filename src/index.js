const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./setting/config.json');
const { Manager } = require('erela.js');
const fs = require('node:fs');


//ทำการสร้าง Client (ตัวจัดการบอท) จาก Lib discord.js
const client = new Client({
	intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

client.manager = new Manager({
	nodes: config.nodes,
	forceSearchLinkQueries: true,
	defaultSearchPlatform: config.search_plat,
	position_update_interval: 100,
	send: (id, payload) => {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	}
});
//จำเป็นต้องมี ส่งค่า Event voice ต่าง ๆ ให้ erela จัดการ
client.on("raw", (r) => client.manager.updateVoiceState(r));


//ทำการโหลดไฟล์ Event erela เข้าบอท
const erelaFiles = fs.readdirSync('./events/erelajs').filter(file => file.endsWith('.js'));

for (const file of erelaFiles) {
	const event = require(`./events/erelajs/${file}`);
	client.manager.on(event.name, (...args) => event.execute(...args));
}
//ทำการโหลดไฟล์ Event erela เข้าบอท


//ทำการโหลดไฟล์คำสั่งเข้าบอท
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
//ทำการโหลดไฟล์คำสั่งเข้าบอท

//ทำการโหลดไฟล์ Event เข้าบอท
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
//ทำการโหลดไฟล์ Event เข้าบอท


client.login(config.token); //login บอทเข้าสู่ระบบ