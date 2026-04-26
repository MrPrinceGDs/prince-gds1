import axios from 'axios'

let chats = {}
let handler = async (m, { conn, text, usedPrefix, command }) => {
  
  // reset command
  if (command === 'resetai') {
    delete chats[m.sender]
    return m.reply('🧠 Memory reset')
  }

  if (!text) return m.reply(`✳️ Command usage\n\n*${usedPrefix + command}* text`)

  try {
    m.react("💬")
    let res = await gpt(m.sender, text)

    m.reply(res, null, fwc)
    
  } catch (e) {
    m.reply('❎ Error: try again later')
  }

}
handler.help = ['ai <text>', "resetai <clear gpt memory>"]
handler.tags = ['tools']
handler.command = ["ia","ai", "resetai", "gpt", "openai", "prince"]

export default handler


async function gpt(userId, text) {

   let syst = `You are Prince Bot, an intelligent, fast, and helpful assistant.
You were created as a WhatsApp bot by Dastageer, and you are based on a language model developed by OpenAI.

You respond in a clear, brief, and direct way, with a bit of personality.
Use Markdown formatting when needed to improve readability.

Rules:
- Do not give unnecessarily long answers
- Be precise and helpful
- If something is unclear, ask for clarification
- You can use light humor when appropriate
- Always prioritize helping the user`

  if (!chats[userId]) {
    chats[userId] = [
      {
        role: "system",
        content: syst
      }
    ]
  }

  chats[userId].push({
    role: "user",
    content: text
  })

  // --- memory limit
  let MAX_MESSAGES = 12

  if (chats[userId].length > MAX_MESSAGES) {
    chats[userId] = [
      chats[userId][0], 
      ...chats[userId].slice(-10)
    ]
  }

  try {
    const { data } = await axios.post('https://aichat-api.vercel.app/chatgpt', {
      messages: chats[userId]
    }, {
      timeout: 20000 
    })

    let res = data?.content?.trim() || 'No response'

    chats[userId].push({
      role: "assistant",
      content: res
    })

    return res

  } catch (err) {
    return '⚠️ AI is not responding, try again'
  }
}
