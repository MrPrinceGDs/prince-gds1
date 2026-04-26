let handler = async (m, { conn, args, isGroup }) => {
    try {
        let user;

        if (isGroup) {
            // Group chat: Fetch quoted user's bio
            if (m.quoted) {
                user = m.quoted.sender; // Get the quoted user's ID
            } else if (args[0]) {
                // If a specific user is mentioned
                user = args[0].replace(/[@]/g, '') + '@s.whatsapp.net';
            } else {
                return m.reply("⚠️ Please reply to a message or mention a user to fetch their bio.");
            }
        } else {
            // Private chat: Fetch quoted user's bio
            if (m.quoted) {
                user = m.quoted.sender;
            } else if (args[0]) {
                user = args[0].replace(/[@]/g, '') + '@s.whatsapp.net';
            } else {
                return m.reply("⚠️ Please reply to a message or mention a user to fetch their bio.");
            }
        }

        // Fetch the bio/status of the user
        let status = await conn.fetchStatus(user);
        let bio = status?.status || "No bio found.";

        // Reply with the fetched bio
        m.reply(`✨ *Bio for ${user}:* ✨\n\n${bio}`);
    } catch (e) {
        console.error(e);
        m.reply("⚠️ An error occurred while fetching the bio. Please try again.");
    }
};

handler.help = ['bio'];
handler.tags = ['info'];
handler.command = /^(bio|getbio)$/i;
handler.rowner = false; // Set to true if only the owner can use this command

export default handler;
