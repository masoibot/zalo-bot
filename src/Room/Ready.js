const { roomChatAll } = require('../Chat/Utils');
const roomRoleChat = require('../Night/roomRoleChat');

module.exports = async (gamef, bot, joinID) => {
    const userRoom = gamef.getUserRoom(joinID);
    if (userRoom != undefined) {
        console.log("$ ROOM " + (userRoom + 1) + " > READY > " + joinID);
        // set status READY
        joinUser = gamef.searchUserInRoom(joinID, userRoom);
        if (!joinUser.ready) {
            joinUser.getReady();
            gamef.getRoom(userRoom).oneReady();
            // get UserName and sendGlobalMessage to ROOM
            user = gamef.getRoom(userRoom).getPlayer(joinID);
            await roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `${user.first_name} đã sẵn sàng! (${gamef.getRoom(userRoom).readyCount}/${gamef.getRoom(userRoom).players.length})`);
            gamef.gameIsReady(userRoom, async (gameReady) => {
                if (gameReady && !gamef.getRoom(userRoom).ingame) {
                    console.log(`$ ROOM ${userRoom + 1} > GAME_START`);
                    gamef.getRoom(userRoom).setInGame();
                    let roleListTxt = gamef.roleRandom(userRoom);
                    gamef.getRoom(userRoom).dayNightSwitch();
                    await roomChatAll(bot, gamef.getRoom(userRoom).players, 0, `Tất cả mọi người đã sẵn sàng! Game sẽ bắt đầu...\n${roleListTxt}\n🌛Đêm thứ ${gamef.getRoom(userRoom).day}🌛`);
                    gamef.getRoom(userRoom).newLog(`\n🌛Đêm thứ ${gamef.getRoom(userRoom).day}🌛\n`);
                    gamef.func(roomRoleChat, bot, userRoom);
                }
            });
        } else {
            bot.say(joinID,"Bạn đã sẵn sàng rồi!");
        }
    } else {
        bot.say(joinID,"Bạn chưa tham gia phòng nào!");
    }
};
