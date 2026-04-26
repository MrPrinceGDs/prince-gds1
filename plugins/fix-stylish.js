import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // quoted msg handle
  if (!text && m.quoted && m.quoted.text) {
    text = m.quoted.text;
  }
  if (!text) return m.reply(`⚠️ براہ کرم کوئی text دیں!\nمثال:\n${usedPrefix}fix آپکا جملہ`);

  try {
    // 🔄 پہلے wait react کرو
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    // Gemini API کو request بھیجنا
    let res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCqLkZNQrZBqKSQ4exfwq08pWkqgtkkCGA", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Beautify this text WhatsApp style with emojis, bold, and some \`\`code formatting:\n\n${text}`
          }]
        }]
      })
    });

    let data = await res.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error("Gemini سے جواب نہیں ملا");
    }

    let replyText = data.candidates[0].content.parts[0].text;

    await m.reply(replyText);

    // ✅ Done react کرو
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    m.reply("❌ Error: Gemini API سے جواب نہیں ملا");
  }
};

handler.help = ["fix"];
handler.tags = ["tools"];
handler.command = /^fix$/i;

export default handler;
