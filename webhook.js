const { Webhook, MessageBuilder } = require("discord-webhook-node");
const fetch = require("isomorphic-fetch");

const botToken = process.env.bot_token;
const channelID = "1325158174189420585";  // Canal ID

async function sendWebhook(channelID, embed) {
  // Utilisation de channelID dans l'URL
  const createUrl = `https://discord.com/api/v10/channels/${channelID}/webhooks`;
  
  try {
    // Création du webhook
    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bot ${botToken}` },
      body: JSON.stringify({ name: "Logger Webhook" }),
    });

    // Vérifier la réponse
    const createData = await createResponse.json();
    console.log(createData); // Ajouter pour déboguer et vérifier la réponse de Discord

    // Utilisation de l'ID et du token du webhook
    const webhookUrl = `https://discord.com/api/v10/webhooks/${createData.id}/${createData.token}`;
    await new Webhook(webhookUrl).send(embed);

    // Suppression du webhook après utilisation
    await fetch(`https://discord.com/api/v10/webhooks/${createData.id}/${createData.token}`, {
      method: "DELETE",
      headers: { Authorization: `Bot ${botToken}` },
    });
  } catch (error) {
    console.error(`Error sending webhook: ${error}`);
    throw error;
  }
}

module.exports = { sendWebhook };
