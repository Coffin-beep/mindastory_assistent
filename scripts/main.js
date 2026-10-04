// Defense & Factory AI Assistant
// Клиентский мод Mindustry v7+. Код совместим с Rhino JS: только var и function.

var Events = Packages.arc.Events;
var Log = Packages.arc.util.Log;
var EventType = Packages.mindustry.game.EventType;
var Vars = Packages.mindustry.Vars;
var registered = false;

function assistToast(message) {
    if (Vars.ui != null && Vars.ui.hudfrag != null) {
        Vars.ui.hudfrag.showToast("[Assist] " + message);
    }
}

function assistChat(message) {
    if (Vars.ui != null && Vars.ui.hudfrag != null) {
        Vars.ui.hudfrag.showToast("[Assist] " + message);
    }
    Log.info("[Assist] " + message);
}

function argumentText(args) {
    if (args == null) return "";
    var result = "";
    for (var i = 0; i < args.length; i++) {
        if (i > 0) result += " ";
        result += String(args[i]);
    }
    return result.toLowerCase().trim();
}

function registerCommands() {
    if (registered || Vars.netClient == null) return;

    // ClientNet.addCommand перехватывает /assist на клиенте и потому работает
    // в одиночной игре и при подключении к мультиплеерному серверу.
    Vars.netClient.addCommand("assist", function(args) {
        var command = argumentText(args);
        if (command == "" || command == "help") {
            assistChat("команды: /assist help, /assist status, /assist resources");
        } else if (command == "status") {
            var wave = Vars.state == null ? 0 : Vars.state.wave;
            assistChat("ассистент работает; текущая волна: " + wave);
        } else if (command == "resources") {
            var coreAvailable = false;
            if (Vars.player != null && Vars.player.team() != null) {
                coreAvailable = Vars.player.team().core() != null;
            }
            assistChat("команда получена; ядро доступно: " + coreAvailable);
        } else {
            assistChat("неизвестная команда. Используйте /assist help");
        }
    });

    registered = true;
    Log.info("[Assist] команда /assist зарегистрирована через Vars.netClient.addCommand");
}

function onClientLoad(event) {
    Log.info("[Assist] scripts/main.js загружен");
    registerCommands();
}

function onWorldLoad(event) {
    assistToast("ассистент запущен; команда /assist help доступна");
    Log.info("[Assist] WorldLoadEvent получен");
    registerCommands();
}

Events.on(EventType.ClientLoadEvent, onClientLoad);
Events.on(EventType.WorldLoadEvent, onWorldLoad);

Log.info("[Assist] обработчики событий зарегистрированы");
