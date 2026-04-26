conn.ev.on("call", async (json) => { const anticallActive = process.env.REJECTSCALLS; const antiCallMsg = process.env.CALLMSG || "ANTICALL IS ACTIVATED\nDON'T DISTURB ME BY CALLING AGAIN AND AGAIN";

if (anticallActive === "truemsg") {
    for (let id of json) {
        if (id.status === "offer") {
           await conn.rejectCall(id.id, id.from);
            await conn.sendMessage(id.from, { text: antiCallMsg });
            
        }
    }
} else if (anticallActive === "true") {
    for (let id of json) {
        if (id.status === "offer") {
            await conn.rejectCall(id.id, id.from);
        }
    }
}

});
