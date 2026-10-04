# Defense & Factory AI Assistant

Готовый JavaScript-мод для Mindustry 7.x. Ассистент не строит за игрока и не обходит серверные права: он анализирует текущую карту и сообщает результат в чат.

## Возможности

- `/assist help` — справка.
- `/assist status` — номер волны, ближайший спавн, сводка обороны и ресурсы ядра.
- `/assist defense` — координаты ближайшей точки спавна, расстояние и направление от ядра.
- `/assist resources` — ресурсы ядра команды.
- `/assist schematics` — список схем, зарегистрированных в `Vars.schematics`; установку игрок выполняет стандартным курсором Mindustry.
- При загрузке мира ассистент сообщает, что готов.

Скрипт использует актуальные v7 API: `Events.on`, `EventType.PlayerChatEvent`, `EventType.WorldLoadEvent`, `Vars`, `Call.sendMessage`, `Vars.spawner.getSpawns()`, `Vars.schematics.all()` и категории блоков. Команда исполняется на стороне, где загружен мод; в мультиплеере мод должен быть установлен у сервера и клиентов согласно настройкам сервера.

## Структура

```text
DefenseFactoryAssistant/
├── mod.json
├── main.js
└── README.md
```

`mod.json` — манифест, `main.js` — единственный исходный скрипт. В коде нет заглушек: команды полностью работают на загруженной карте. Название мода можно изменить в `displayName`, а имя папки — оставить любым.

## Установка на ПК

### Вариант 1: ZIP-архив

1. Скачайте ZIP-архив мода из pull request: откройте вкладку **Code → Download ZIP** или скачайте файл `DefenseFactoryAssistant.zip` из раздела релиза/артефактов.
2. Распакуйте архив в каталог модов Mindustry.
3. Если архив распаковался с дополнительной папкой вроде `mindastory_assistent-main`, переименуйте её в `DefenseFactoryAssistant` или убедитесь, что `mod.json` находится непосредственно внутри папки мода.
4. Итоговый путь должен выглядеть так:

```text
.../Mindustry/mods/DefenseFactoryAssistant/mod.json
```

5. Запустите Mindustry, откройте **Настройки → Моды**, включите мод и перезапустите игру.

### Вариант 2: копирование папки

1. Сохраните эту папку целиком в каталог модов Mindustry:
   - Windows: `%AppData%\\Mindustry\\mods\\DefenseFactoryAssistant`
   - Linux: `~/.local/share/Mindustry/mods/DefenseFactoryAssistant`
   - macOS: `~/Library/Application Support/Mindustry/mods/DefenseFactoryAssistant`
   - Android: `Android/data/io.anuke.mindustry/files/mods/DefenseFactoryAssistant` (точный путь зависит от версии Android).
2. Проверьте, что `mod.json` лежит непосредственно в папке `DefenseFactoryAssistant`, а не в дополнительной вложенной папке.
3. Запустите игру, откройте **Настройки → Моды**, убедитесь, что мод включён, и перезапустите Mindustry.

## Тестирование

1. Запустите кампанию или песочницу с ядром и дождитесь загрузки мира.
2. Откройте чат клавишей Enter и отправьте `/assist help`.
3. Проверьте `/assist status`, затем `/assist defense` и `/assist resources`.
4. Создайте или импортируйте хотя бы одну схему через стандартное меню игры и выполните `/assist schematics`.
5. Для headless-сервера положите ту же папку в каталог `config/mods` сервера, перезапустите сервер и проверьте команды от подключённого игрока.

## Диагностика

- Если мод не появляется, проверьте JSON (кавычки, запятые и UTF-8) и наличие именно `scripts: ["main.js"]`.
- Если команда не отвечает, посмотрите `logs/latest.log`: строка `Defense & Factory AI Assistant ... loaded` означает успешную загрузку.
- В мультиплеере используйте `/assist` после загрузки мира; до появления ядра команда корректно сообщит, что ядро не найдено.
- С версии игры, несовместимой с v7 API, мод может не загрузиться; используйте актуальную стабильную Mindustry 7.x.
