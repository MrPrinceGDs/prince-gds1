import { spawn } from 'child_process';
import HerokuClient from 'heroku-client';

// Helper function to get message strings
const messages = {
  notOwner: '',
  modifyingConfig: (varName, value) => `⚙️ *Modifying Config Var...*\n*Adding/Modifying* \`${varName}\` *with value* \`${value}\`\nWait a moment until bot restarts...`,
  failedToModify: 'Failed to modify config var. Make sure Heroku key is available in *VAR_KEY* variable and proper app name in *VAR_APP* variable.',
};

let handler = async (message, { command, usedPrefix, text }) => {
  // Handle various ways to write the input: ':', ',', '/', ' ' (space)
  const cleanedText = text.trim().replace(/[\s,\/=]+/g, ':'); // Converts all separators to ':'
  const [varName, value] = cleanedText.split(':');  // Now split by ':'

  // Ensure both varName and value are provided
  if (!varName || !value) {
    return message.reply(`*🟡${mssg.example}:* *\`${usedPrefix + command} MODE,private\`*`);
  }

  await message.reply(messages.modifyingConfig(varName, value));

  try {
    const herokuClient = new HerokuClient({ token: process.env.VAR_KEY });
    const appName = process.env.VAR_APP;

    const configVars = await herokuClient.get(`/apps/${appName}/config-vars`);
    configVars[varName] = value;

    // Update the config vars on Heroku
    await herokuClient.patch(`/apps/${appName}/config-vars`, { body: configVars });
  } catch (error) {
    console.error('Error modifying config var:', error.message);
    throw messages.failedToModify;
  }
};

// Command and metadata setup
handler.command = ['var', 'setvar'];
handler.help = ['var Name/Value', 'setvar Name,Value'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;
