// Defense & Factory AI Assistant
// Клиентский JavaScript-мод Mindustry v7+ / Rhino JS.
// Автостроительство выполняется через очередь планов юнита игрока.

var Events = Packages.arc.Events;
var Time = Packages.arc.util.Time;
var Log = Packages.arc.util.Log;
var EventType = Packages.mindustry.game.EventType;
var Vars = Packages.mindustry.Vars;
var BuildPlan = Packages.mindustry.entities.units.BuildPlan;
var Build = Packages.mindustry.world.Build;
var Blocks = Packages.mindustry.content.Blocks;

function assistantToast(text) {
    if (Vars.ui != null && Vars.ui.hudfrag != null) {
        Vars.ui.hudfrag.showToast("[cyan]Ассистент: " + text);
    }
}

function tileCoordinate(value) {
    return Math.floor(value / Vars.tilesize);
}

function playerBuildTeam() {
    if (Vars.player == null || Vars.player.team() == null) return null;
    return Vars.player.team();
}

function buildPlan(block, x, y, rotation, team) {
    // Build.validPlace учитывает границы карты, занятость клетки,
    // требования блока и доступность размещения для указанной команды.
    if (!Build.validPlace(block, team, x, y, rotation)) return false;

    var unit = Vars.player.unit();
    if (unit == null) return false;

    unit.addBuild(new BuildPlan(x, y, rotation, block));
    return true;
}

function buildDefense() {
    var team = playerBuildTeam();
    var unit;
    var centerX;
    var centerY;
    var placed = 0;
    var x;
    var y;
    var i;

    if (team == null || Vars.player.unit() == null) {
        assistantToast("невозможно строить: игрок или его юнит недоступен");
        return;
    }

    unit = Vars.player.unit();
    centerX = tileCoordinate(unit.x);
    centerY = tileCoordinate(unit.y);

    // Передняя дуга обороны: стены, две турели и подача боеприпасов.
    for (i = -2; i <= 2; i++) {
        if (buildPlan(Blocks.copperWall, centerX + i, centerY + 4, 0, team)) placed++;
    }

    if (buildPlan(Blocks.duo, centerX - 3, centerY + 3, 0, team)) placed++;
    if (buildPlan(Blocks.duo, centerX + 3, centerY + 3, 0, team)) placed++;

    for (i = -3; i <= 3; i++) {
        if (buildPlan(Blocks.conveyor, centerX + i, centerY + 2, 0, team)) placed++;
    }

    assistantToast("план обороны добавлен: " + placed + " объектов");
    Log.info("[Assist] defense build plans: " + placed);
}

function buildFactory() {
    var team = playerBuildTeam();
    var unit;
    var centerX;
    var centerY;
    var placed = 0;
    var i;

    if (team == null || Vars.player.unit() == null) {
        assistantToast("невозможно строить: игрок или его юнит недоступен");
        return;
    }

    unit = Vars.player.unit();
    centerX = tileCoordinate(unit.x);
    centerY = tileCoordinate(unit.y);

    // Малый план производства кремния: два источника сырья,
    // конвейеры, спаренные кремниевые плавильни и вывод продукции.
    if (buildPlan(Blocks.mechanicalDrill, centerX - 4, centerY, 0, team)) placed++;
    if (buildPlan(Blocks.mechanicalDrill, centerX - 4, centerY + 3, 0, team)) placed++;

    for (i = -3; i <= 0; i++) {
        if (buildPlan(Blocks.conveyor, centerX + i, centerY, 0, team)) placed++;
        if (buildPlan(Blocks.conveyor, centerX + i, centerY + 3, 0, team)) placed++;
    }

    if (buildPlan(Blocks.siliconSmelter, centerX + 1, centerY, 0, team)) placed++;
    if (buildPlan(Blocks.siliconSmelter, centerX + 1, centerY + 3, 0, team)) placed++;

    if (buildPlan(Blocks.conveyor, centerX + 2, centerY + 1, 0, team)) placed++;
    if (buildPlan(Blocks.conveyor, centerX + 2, centerY + 2, 0, team)) placed++;
    if (buildPlan(Blocks.router, centerX + 3, centerY + 1, 0, team)) placed++;

    assistantToast("план завода добавлен: " + placed + " объектов");
    Log.info("[Assist] factory build plans: " + placed);
}

function commandFromMessage(message) {
    var text;
    if (message == null) return "";

    text = String(message).trim().toLowerCase();
    if (text == "/assist" || text == "/assist help") return "help";
    if (text == "/assist status") return "status";
    if (text == "/assist resources") return "resources";
    if (text == "/assist build defense") return "build-defense";
    if (text == "/assist build factory") return "build-factory";
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
        assistantToast("/assist status, /assist resources, /assist build defense, /assist build factory");
    } else if (command == "status") {
        wave = Vars.state == null ? 0 : Vars.state.wave;
        assistantToast("мод работает. Текущая волна: " + wave);
    } else if (command == "resources") {
        coreExists = false;
        if (Vars.player != null && Vars.player.team() != null) {
            coreExists = Vars.player.team().core() != null;
        }
        assistantToast("ядро команды доступно: " + coreExists);
    } else if (command == "build-defense") {
        buildDefense();
    } else if (command == "build-factory") {
        buildFactory();
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

Events.on(EventType.PlayerChatEvent, handlePlayerChat);
Log.info("[Assist] обработчики событий зарегистрированы");
