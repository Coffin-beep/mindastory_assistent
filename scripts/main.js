// Defense & Factory AI Assistant
// Mindustry v7+ Rhino JavaScript. Используются только var и function.

var Events = Packages.arc.Events;
var Log = Packages.arc.util.Log;
var EventType = Packages.mindustry.game.EventType;
var Call = Packages.mindustry.gen.Call;
var Vars = Packages.mindustry.Vars;

function assistantMessage(text) {
    Call.sendMessage("[accent][Assist[] " + text);
}

function onClientLoad(event) {
    Log.info("[Assist] main.js успешно загружен");
}

function onWorldLoad(event) {
    Log.info("[Assist] WorldLoadEvent получен: ассистент активен");
    assistantMessage("ассистент запущен. Введите /assist help");
}

function onPlayerChat(event) {
    var message = String(event.message == null ? "" : event.message).trim();
    if (message == "/assist" || message == "/assist help") {
        assistantMessage("команды: /assist help, /assist status, /assist resources");
    } else if (message == "/assist status") {
        var wave = Vars.state == null ? 0 : Vars.state.wave;
        assistantMessage("тест успешен; текущая волна: " + wave);
    } else if (message == "/assist resources") {
        assistantMessage("команда resources получена; ядро доступно: " + (Vars.player != null && Vars.player.team().core() != null));
    }
}

Events.on(EventType.ClientLoadEvent, onClientLoad);
Events.on(EventType.WorldLoadEvent, onWorldLoad);
Events.on(EventType.PlayerChatEvent, onPlayerChat);

Log.info("[Assist] обработчики Events зарегистрированы");
