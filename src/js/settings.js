/* templates start */
class Settings {
    constructor(allowModalBGClick, hideOnTick, checkNavAway, confirmOnDelete) {
        this.allowModalBGClick = allowModalBGClick;
        this.hideOnTick = hideOnTick;
        this.checkNavAway = checkNavAway;
        this.confirmOnDelete = confirmOnDelete;
    }
}
/* templates end */

const settingsStr = "settings";
let settings = getSettings();

function getSettings() {
    let ret = new Settings(false, false, true, true);

    if (localStorage.getItem(settingsStr) != null) {
        ret = JSON.parse(localStorage.getItem(settingsStr));
    }

    return ret;
}

function changeSettings(elem) {
    if (elem.tagName.toLowerCase() == "input" && elem.type.toLowerCase() == "checkbox") {
        settings[elem.dataset.setting] = elem.checked;
    } else {
        settings[elem.dataset.setting] = elem.value;
    }
}

function saveSettings(showMessage) {
    localStorage.setItem(settingsStr, JSON.stringify(settings));
    settingsToScreen();

    if (showMessage) {
        showMsg('success', 'Settings saved!');
    }
}

function screenToSettings() {
    document.querySelectorAll('*').forEach(function(node) {
        if (node.dataset.settings) {
            if (node.tagName.toLowerCase() == "input" && node.type.toLowerCase() == "checkbox") {
                 settings[node.dataset.setting] = node.checked;
            } else {
                 settings[node.dataset.setting] = node.value;
            }
        }
    });

    saveSettings(true);
}

function settingsToScreen() {
    document.querySelectorAll('*').forEach(function(node) {
        if (node.dataset.settings) {
            if (node.tagName.toLowerCase() == "input" && node.type.toLowerCase() == "checkbox") {
                node.checked = settings[node.dataset.setting];
            } else {
                node.value = settings[node.dataset.setting];
            }
        }
    });
}

function clearSettings() {
    localStorage.removeItem(settingsStr);
    settings = getSettings();
    saveSettings(false);
}

settingsToScreen();
