// Defense & Factory AI Assistant
// Клиентский JavaScript-мод Mindustry v7+.
// В этом файле нет серверной регистрации команд и нет обращений к NetClient.

var Events = Packages.arc.Events;
var Time = Packages.arc.util.Time;
var Log = Packages.arc.util.Log;
var EventType = Packages.mindustry.game.EventType;
var Vars = Packages.mindustry.Vars;

function assistantToast(text) {
    if (Vars.ui != null && Vars.ui.hudfrag != null) {
        Vars.ui.hudfrag.showToast("[cyan]Ассистент: " + text);
    }
}

function commandFromMessage(message) {
    var text;
    if (message == null) return "";

    text = String(message).trim().toLowerCase();
    if (text == "/assist" || text == "/assist help") return "help";
    if (text == "/assist status") return "status";
    if (text == "/assist resources") return "resources";
    return "";
}

function handlePlayerChat(event) {
    var command;
    var wave;
    var coreExists;

    if (event == null) return;

    command = commandFromMessage(event.message);
    if (command == "") return;

    if (command == "help") {
        assistantToast("команды: /assist help, /assist status, /assist resources");
    } else if (command == "status") {
        wave = 0;
        if (Vars.state != null) wave = Vars.state.wave;
        assistantToast("мод работает. Текущая волна: " + wave);
    } else if (command == "resources") {
        coreExists = false;
        if (Vars.player != null && Vars.player.team() != null) {
            coreExists = Vars.player.team().core() != null;
        }
        assistantToast("ядро команды доступно: " + coreExists);
    }
}

Events.on(EventType.ClientLoadEvent, function(event) {
    Log.info("=== AI Assistant Mod Loaded ===");
});

Events.on(EventType.WorldLoadEvent, function(event) {
    Time.run(60, function() {
        assistantToast("[cyan]Ассистент активен! Мод работает.");
        Log.info("[Assist] мир загружен");
    });
});

// Событийный хук чата не требует регистрации серверной команды.
Events.on(EventType.PlayerChatEvent, handlePlayerChat);
Log.info("[Assist] обработчики клиентских событий зарегистрированы");
