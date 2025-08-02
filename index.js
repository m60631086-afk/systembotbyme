const { Client, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const port = process.env.PORT || 4000

const client = new Client({ intents: 53608447 });

const allowedRoleIds = ["1383717160383152190"]; // The ID of roles that can use the command
const lineLink = "https://i.imgur.com/2ajGf5e.png";

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("$come")) {
    const args = message.content.slice("$come".length).trim().split(/ +/);
    const target = args.shift();
    if (!target) return await message.reply("Please mention a member or provide a member ID.");
    const reason = args.join(" ") || "No reason provided.";

    if (!message.member.roles.cache.some((role) => allowedRoleIds.includes(role.id))) return await message.reply("You don't have permission to use this command.");

    const member = message.mentions.members.first() || message.guild.members.cache.get(target);
    if (!member) return await message.reply("Member not found.");

    try {
      await member.send(
        `**📢 You have been requested to come in <#${message.channel.id}>**.\n👤 **By:** ${message.author.tag}\n-# 📎 **Reason:** ${reason}`,
      );
      await message.react("✅");
    } catch {
      await message.reply("I can't request this member to come to this channel.");
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "$line") {
    const randomColor = Math.floor(Math.random() * 0xffffff);

    const lineEmbed = new EmbedBuilder()
      .setColor(0xeeeeee) // Near-white (visible on most themes)
      .setImage(lineLink); // Embed with only the image

    await message.channel.send({ embeds: [lineEmbed] });
  }
});

const { ActivityType } = require('discord.js');

client.once('ready', () => {
  const statusText = "RX On Top"; // Put your status text here
  const statusType  = "LISTENING" ; // PLAYING / WATCHING / LISTENING / COMPETING
  const presenceStatus = "idle"; // online / idle / dnd / invisible

  client.user.setPresence({
    status: presenceStatus,
    activities: [{
      name: statusText,
      type: ActivityType[statusType]
    }]
  });

  console.log("Bot status set successfully");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // === Manual Configuration ===
  const FEEDBACK_CHANNEL_ID = "1383715934778167357"; // replace with your feedback channel ID
  const FEEDBACK_MODE = "embed"; // "embed" or "reactions"
  const FEEDBACK_EMOJI = "❤";
  const FEEDBACK_LINE_FILE = "/home/container/image.png"; // or null if you don't want a file
  const THANK_YOU_MSG = `**<@${message.author.id}> Thank you for your feedback :tulip:**`;
  const REACT_EMOJIS = ["❤", "❤️‍🔥"];
  const EMBED_COLOR = 'Random';

  if (message.channel.id !== FEEDBACK_CHANNEL_ID) return;

  const avatarURL = message.author.displayAvatarURL({ dynamic: true });
  const embed = new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTimestamp()
    .setTitle(`** > ${message.content} **`)
    .setThumbnail(avatarURL)
    .setAuthor({ name: message.author.username, iconURL: avatarURL })
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

  if (FEEDBACK_MODE === 'embed') {
    await message.delete();
    const themsg = await message.channel.send({ content: THANK_YOU_MSG, embeds: [embed] });
    for (const emoji of REACT_EMOJIS) {
      await themsg.react(emoji);
    }
    if (FEEDBACK_LINE_FILE) {
      await message.channel.send({ files: [FEEDBACK_LINE_FILE] });
    }
  } else if (FEEDBACK_MODE === 'reactions') {
    await message.react(FEEDBACK_EMOJI);
    if (FEEDBACK_LINE_FILE) {
      await message.channel.send({ files: [FEEDBACK_LINE_FILE] });
    }
  }
});

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN); // Your bot token here
