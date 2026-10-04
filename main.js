// Defense & Factory AI Assistant — Mindustry v7+ JavaScript-мод.
// Скрипт рассчитан на папку mods и не требует компиляции.

const Events = Packages.arc.Events;
const EventType = Packages.mindustry.game.EventType;
const Vars = Packages.mindustry.Vars;
const Call = Packages.mindustry.gen.Call;
const Team = Packages.mindustry.game.Team;
const Mathf = Packages.arc.math.Mathf;
const Blocks = Packages.mindustry.content.Blocks;
const Schematics = Packages.mindustry.game.Schematics;

const PREFIX = "[accent][Assist[] ";
const COMMAND = "/assist";
const VERSION = "1.0.0";

function say(message){
    // Call.sendMessage корректно работает и на сервере, и в одиночной игре.
    Call.sendMessage(PREFIX + message);
}

function sayTo(player, message){
    if(player == null) return;
    player.sendMessage(PREFIX + message);
}

function number(value){
    return Math.round(value * 10) / 10;
}

function activeTeam(){
    // Команда игрока в мультиплеере, либо команда синего ядра в одиночной игре.
    if(Vars.player != null && Vars.player.team() != null) return Vars.player.team();
    if(Vars.state != null && Vars.state.rules != null) return Vars.state.rules.defaultTeam;
    return Team.sharded;
}

function coreFor(team){
    return team.core();
}

function itemReport(team){
    const core = coreFor(team);
    if(core == null) return "ядро команды не найдено";
    const result = [];
    const items = Vars.content.items();
    for(let i = 0; i < items.size; i++){
        const item = items.get(i);
        const amount = core.items.get(item);
        if(amount > 0) result.push(item.localizedName + ": " + amount);
    }
    if(result.length === 0) return "ядро пока пусто";
    result.sort(function(a, b){ return b.length - a.length; });
    return result.slice(0, 12).join(", ");
}

function nearestSpawn(core){
    if(core == null || Vars.spawner == null) return null;
    const spawns = Vars.spawner.getSpawns();
    if(spawns == null || spawns.size === 0) return null;
    let best = null;
    let bestDistance = 1e30;
    for(let i = 0; i < spawns.size; i++){
        const spawn = spawns.get(i);
        const distance = Mathf.dst(core.tileX(), core.tileY(), spawn.x, spawn.y);
        if(distance < bestDistance){
            bestDistance = distance;
            best = {point: spawn, distance: distance};
        }
    }
    return best;
}

function defenseReport(team){
    const core = coreFor(team);
    if(core == null) return "ядро не найдено: разместите ядро и повторите команду";
    const spawn = nearestSpawn(core);
    if(spawn == null) return "точки спавна не обнаружены на этой карте";
    const dx = spawn.point.x - core.tileX();
    const dy = spawn.point.y - core.tileY();
    const angle = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
    return "ближайшая точка спавна: " + spawn.point.x + "," + spawn.point.y +
        " (" + number(spawn.distance) + " тайлов от ядра); направление от ядра: " + angle + "°";
}

// Разбор карты выполняется без обхода каждого тайла: это важно для больших карт.
function scanDefense(team){
    const result = {turrets: 0, walls: 0, drills: 0, power: 0};
    if(Vars.world == null || Vars.world.tiles == null) return result;
    Vars.world.tiles.eachTile(function(tile){
        if(tile.team() !== team) return;
        const block = tile.block();
        if(block.category == Packages.mindustry.type.Category.turret) result.turrets++;
        else if(block.category == Packages.mindustry.type.Category.defense) result.walls++;
        else if(block.category == Packages.mindustry.type.Category.production) result.drills++;
        else if(block.category == Packages.mindustry.type.Category.power) result.power++;
    });
    return result;
}

function report(player){
    const team = player == null ? activeTeam() : player.team();
    const core = coreFor(team);
    const wave = Vars.state != null && Vars.state.rules.waves ? Vars.state.wave : 0;
    const blocks = scanDefense(team);
    sayTo(player, "волна " + wave + "; " + defenseReport(team));
    sayTo(player, "турели: " + blocks.turrets + ", стены: " + blocks.walls +
        ", добыча: " + blocks.drills + ", энергия: " + blocks.power);
    sayTo(player, "ресурсы ядра: " + itemReport(team));
    if(core == null) sayTo(player, "предупреждение: ядро команды не найдено");
}

function schematicReport(player){
    const all = Vars.schematics.all();
    if(all == null || all.size === 0){
        sayTo(player, "сохранённых схем нет. Создайте схему стандартным инструментом Mindustry.");
        return;
    }
    const names = [];
    for(let i = 0; i < all.size && i < 15; i++){
        const schematic = all.get(i);
        names.push(schematic.name);
    }
    sayTo(player, "доступные схемы (" + all.size + "): " + names.join(", "));
    sayTo(player, "Схему можно выбрать в меню схем и поставить обычным курсором; ассистент не обходит права сервера.");
}

function help(player){
    sayTo(player, "команды: /assist help, status, defense, resources, schematics");
    sayTo(player, "status — волна, оборона и ресурсы; defense — безопасная точка направления атаки;");
    sayTo(player, "resources — содержимое ядра; schematics — список сохранённых схем.");
}

function onChat(event){
    const text = String(event.message == null ? "" : event.message).trim();
    if(text !== COMMAND && text.indexOf(COMMAND + " ") !== 0) return;
    const argument = text.substring(COMMAND.length).trim().toLowerCase();
    const player = event.player;
    if(argument === "" || argument === "help") help(player);
    else if(argument === "status") report(player);
    else if(argument === "defense") sayTo(player, defenseReport(player.team()));
    else if(argument === "resources") sayTo(player, "ресурсы ядра: " + itemReport(player.team()));
    else if(argument === "schematics" || argument === "schemes") schematicReport(player);
    else sayTo(player, "неизвестная команда. Используйте /assist help");
}

Events.on(EventType.PlayerChatEvent, onChat);
Events.on(EventType.WorldLoadEvent, function(){
    // Сообщение только локальному игроку не требуется: команда help доступна всегда.
    if(Vars.headless) return;
    say("готов. Введите /assist help");
});

print("Defense & Factory AI Assistant " + VERSION + " loaded");
