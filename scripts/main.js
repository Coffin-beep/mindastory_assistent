// Defense & Factory AI Assistant
// Клиентский скрипт Mindustry v7+ / Rhino JavaScript.
// Команды обрабатываются через события, без Vars.netClient.addCommand.

var Events = Packages.arc.Events;
var Time = Packages.arc.util.Time;
var Log = Packages.arc.util.Log;
var EventType = Packages.mindustry.game.EventType;
var Vars = Packages.mindustry.Vars;

function showAssistantToast(message) {
    if (Vars.ui != null && Vars.ui.hudfrag != null) {
        Vars.ui.hudfrag.showToast(message);
    }
}

function showAssistantMessage(message) {
    showAssistantToast("[cyan][Assist[] " + message);
    Log.info("[Assist] " + message);
}

function getCommand(message) {
    if (message == null) return "";

    var text = String(message).trim();
    if (text == "/assist") return "help";
    if (text.indexOf("/assist ") == 0) {
        return text.substring(8).trim().toLowerCase();
    }

    return "";
}

function handleChat(event) {
    // PlayerChatEvent используется как безопасный событийный хук.
    // Никакие серверные или несуществующие методы NetClient не вызываются.
    if (event == null || event.message == null) return;

    var command = getCommand(event.message);
    if (command == "") return;

    if (command == "help") {
        showAssistantMessage(
            "команды: /assist help, /assist status, /assist resources"
        );
    } else if (command == "status") {
        var wave = 0;
        if (Vars.state != null) wave = Vars.state.wave;

        showAssistantMessage(
            "ассистент работает; текущая волна: " + wave
        );
    } else if (command == "resources") {
        var coreAvailable = false;
        if (Vars.player != null && Vars.player.team() != null) {
            coreAvailable = Vars.player.team().core() != null;
        }

        showAssistantMessage(
            "команда получена; ядро доступно: " + coreAvailable
        );
    } else {
        showAssistantMessage(
            "неизвестная команда. Используйте /assist help"
        );
    }
}

Events.on(EventType.ClientLoadEvent, function(event) {
    Log.info("=== AI Assistant Mod Loaded ===");
});

Events.on(EventType.WorldLoadEvent, function(event) {
    Time.run(60, function() {
        showAssistantToast("[cyan]Ассистент активен! Мод работает.");
        Log.info("[Assist] WorldLoadEvent обработан");
    });
});

Events.on(EventType.PlayerChatEvent, handleChat);
Log.info("[Assist] событийные обработчики зарегистрированы");
