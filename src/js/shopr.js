/* templates start */
class Menu {
    constructor(mon, tue, wed, thu, fri, sat, sun) {
        this.mon = mon;
        this.tue = tue;
        this.wed = wed;
        this.thu = thu;
        this.fri = fri;
        this.sat = sat;
        this.sun = sun;
    }
}

class Item {
    constructor(item, checked, uuid) {
        this.item = item;
        this.checked = checked;
        this.uuid = uuid;
    }
}

class ShoppingList {
    constructor(title, shop, menu, items, uuid, message) {
        let date = new Date();

        this.title = title;
        this.shop = shop;
        this.menu = menu;
        this.items = items;
        this.date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString();
        this.uuid = uuid;

        this.message = message ? message : "";
    }
}
/* templates end */

const shoppingListsStr = "shopping-lists";
let shoppingLists = getLists();

displayLists();

function getLists() {
    let ret = [];

    if (localStorage.getItem(shoppingListsStr) != null) {
        ret = JSON.parse(localStorage.getItem(shoppingListsStr));
    }

    ret.sort(sortListsByDate);
    return ret;
}

function sortListsByDate(a, b) {
    if (a.date < b.date){
        return 1;
    } else if (a.date > b.date){
        return -1;
    } else {
        return 0;
    }
}

function getListIndexByProp(propName, propValue) {
    for (let i = 0; i < shoppingLists.length; i++) {
        if (shoppingLists[i][propName] == propValue) {
            return i;
        }
    }

    return -1;
}

function getListByProp(propName, propValue) {
    for (let i = 0; i < shoppingLists.length; i++) {
        if (shoppingLists[i][propName] == propValue) {
            return shoppingLists[i];
        }
    }

    return {};
}

function addList(shoppingList, showMessage) {
    shoppingLists.unshift(shoppingList);

    let show = true;

    if (showMessage != undefined || showMessage != null) {
        show = showMessage;
    }

    saveLists(show);
    displayLists();
}

function updateList(shoppingList, uuid) {
    let index = getListIndexByProp('uuid', uuid);

    if (index > -1) {
        shoppingLists[index] = shoppingList;
        saveLists(true);
        displayLists();
    } else {
        showMsg('error', 'Cannot update:<br>' + uuid);
    }
}

function saveLists(showMessage) {
    localStorage.setItem(shoppingListsStr, JSON.stringify(shoppingLists));

    if (showMessage) {
        showMsg('success', 'Shopping lists saved');
    }
}

function saveList(message) {
    // no validation on menu
    let mon = document.getElementById("inp-mon");
    let tue = document.getElementById("inp-tue");
    let wed = document.getElementById("inp-wed");
    let thu = document.getElementById("inp-thu");
    let fri = document.getElementById("inp-fri");
    let sat = document.getElementById("inp-sat");
    let sun = document.getElementById("inp-sun");

    let uuid = document.getElementById("inp-list-uuid");
    const newList = (uuid.value == "");

    if (newList) {
        uuid.value = createUUID();
    }

    // no validation on title or shop
    let title = document.getElementById("inp-list-title");
    let shop = document.getElementById("inp-list-shop");

    let menu = new Menu (
        mon.value.toPascalCase(),
        tue.value.toPascalCase(),
        wed.value.toPascalCase(),
        thu.value.toPascalCase(),
        fri.value.toPascalCase(),
        sat.value.toPascalCase(),
        sun.value.toPascalCase()
    )

    let items = [];
    let table = document.getElementById("table-list-items");
    let tbody = document.getElementById("table-list-items-body");

    for (let row of table.rows) {
        for(let cell of row.cells) {
            for(let child of cell.children) {
                if (child.nodeName.toLowerCase() == "p") {
                    let checked = (child.dataset.checked && child.dataset.checked != "false") ? true : false;

                    let item = new Item (
                        child.innerHTML.toPascalCase(),
                        checked,
                        child.dataset.uuid
                    )
                    items.push(item);
                }
            }
        }
    }

    //items is the only validation
    if (items.length == 0) {
        showMsg('warning', 'A shopping list must have at least one item!');
        return false;
    }

    let shoppingList = new ShoppingList (
        title.value.toPascalCase(),
        shop.value.toPascalCase(),
        menu,
        items,
        uuid.value,
        message
    )

    //this method is for updating as well as adding
    if (newList) {
        addList(shoppingList);
    } else {
        updateList(shoppingList, uuid.value);
    }

    //clear
    uuid.value = "";
    title.value = "";
    shop.value = "";

    mon.value = "";
    tue.value = "";
    wed.value = "";
    thu.value = "";
    fri.value = "";
    sat.value = "";
    sun.value = "";

    tbody.innerHTML = "";

    return true;
}

function deleteItemNode(id) {
    let elem = document.getElementById(id);

    if (elem) {
        let fn = function () {
            elem.remove();
            showMsg('success', 'List item deleted');
        }

        if (settings.confirmOnDelete) {
            showMsg('confirm', 'Are you sure you want to delete this list item?', fn, null);
        } else {
            fn();
        }
    } else {
        showMsg('error', 'Cannot find: ' + id);
    }
}

function editItemNode(elem, input) {
    if (elem && typeof elem == "object") {
        elem.innerHTML = input;
        showMsg('success', 'List item updated');
    }
}

function confirmEditItemNode(id) {
    let tr = document.getElementById(id);
    let td = tr.firstChild;
    let p = td.firstChild;

    showMsg('input', 'Edit list item', editItemNode, null, p.innerHTML, p);
}

function addListItem(openAccordion, item) {
    let tbody = document.getElementById("table-list-items-body");
    let _item = document.getElementById("inp-list-item");

    if (!_item.value) {
        showMsg('warning', 'Enter an item!');
        _item.focus();
        return false;
    }

    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let p = document.createElement("p");
    let btnDelete = document.createElement("button");
    let btnEdit = document.createElement("button");
    let icoDelete = document.createElement("i");
    let icoEdit = document.createElement("i");

    const uuid = item ? item.uuid : createUUID();
    tr.id = uuid;

    p.innerHTML = _item.value.toPascalCase();
    p.dataset.uuid = uuid;
    p.dataset.checked = item ? item.checked : false;

    btnDelete.classList.add("float-right");
    btnDelete.onclick = function() {
        deleteItemNode(uuid);
    }

    btnEdit.classList.add("float-right");
    btnEdit.onclick = function() {
        confirmEditItemNode(uuid);
    }

    icoEdit.classList.add("material-icons");
    icoEdit.innerHTML = "edit";
    icoDelete.classList.add("material-icons");
    icoDelete.innerHTML = "delete";

    btnDelete.appendChild(icoDelete);
    btnEdit.appendChild(icoEdit);
    td2.appendChild(btnDelete);
    td2.appendChild(btnEdit);
    td1.appendChild(p);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tbody.insertBefore(tr, tbody.firstChild);

    //reset accordion
    let btn = document.getElementById("btn-accordion-add-list");
    let panel = btn.nextElementSibling;

    if (panel) {
        if (openAccordion) {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } else {
            panel.style.maxHeight = null;
        }
    }

    //clear and focus input
    _item.value = "";
    _item.focus();

    return true;
}

function toggleListItem(sender, uuid) {
    let ctrl = document.getElementById(uuid);

    if (ctrl) {
        let td = ctrl.parentElement;
        let tr = td.parentElement;

        if (sender.checked) {
            ctrl.style.textDecoration = "line-through";
            if (settings.hideOnTick) {
                tr.style.display = "none";
            }
        } else {
            ctrl.style.textDecoration = "none";
            if (settings.hideOnTick) {
                tr.style.display = "table-row";
            }
        }

        for (let shoppingList of shoppingLists) {
            for (let item of shoppingList.items) {
                if (item.uuid == uuid) {
                    item.checked = sender.checked;
                    break;
                }
            }
        }

        saveLists(false);
    }
}

function getTitle(list) {
    return list.title ? list.title : list.date;
}

function editList(uuid) {
    let list = getListByProp('uuid', uuid);

    if (list == {}) {
        showMsg('error', 'Cannot find:</br>' + uuid);
        return false;
    }

    let _uuid = document.getElementById("inp-list-uuid");
    let title = document.getElementById("inp-list-title");
    let shop = document.getElementById("inp-list-shop");

    let mon = document.getElementById("inp-mon");
    let tue = document.getElementById("inp-tue");
    let wed = document.getElementById("inp-wed");
    let thu = document.getElementById("inp-thu");
    let fri = document.getElementById("inp-fri");
    let sat = document.getElementById("inp-sat");
    let sun = document.getElementById("inp-sun");

    let _item = document.getElementById("inp-list-item");

    _uuid.value = list.uuid;
    title.value = list.title;
    shop.value = list.shop;

    mon.value = list.menu.mon;
    tue.value = list.menu.tue;
    wed.value = list.menu.wed;
    thu.value = list.menu.thu;
    fri.value = list.menu.fri;
    sat.value = list.menu.sat;
    sun.value = list.menu.sun;

    let tbody = document.getElementById("table-list-items-body");
    tbody.innerHTML = "";

    for (let item of list.items) {
        _item.value = item.item;
        addListItem(false, item);
    }

    showPage(event, 'Add');

    return true;
}

function confirmDeleteList(uuid) {
    let fn = function () {
        deleteList(uuid);
    }

    if (settings.confirmOnDelete) {
        showMsg('confirm', 'Are you sure you want to delete this list?', fn, null);
    } else {
        fn();
    }
}

function deleteList(uuid) {
    let index = getListIndexByProp('uuid', uuid);

    if (index > -1) {
        shoppingLists.splice(index, 1);
        saveLists(false);
        displayLists();
        showMsg('success', 'List deleted');
    } else {
        showMsg('error', 'Cannot delete: ' + index);
    }
}

function displayLists() {
    let tbody = document.getElementById("table-lists-open");
    tbody.innerHTML = "";

    let count = 0;

    for (let list of shoppingLists) {
        let trTitle = document.createElement("tr");
        let trBtns = document.createElement("tr");
        let tdTitle = document.createElement("td");
        let p = document.createElement("p");
        let tdLeft = document.createElement("td");
        let tdRight = document.createElement("td");
        let btnOpen = document.createElement("button");
        let btnSend = document.createElement("button");
        let btnEdit = document.createElement("button");
        let btnDelete = document.createElement("button");

        if (count % 2) {
            trTitle.style.backgroundColor = "#EAF3F5";
            trBtns.style.backgroundColor = "#EAF3F5";
        }

        p.innerHTML = getTitle(list);
        tdTitle.appendChild(p);
        tdTitle.rowSpan = 2;
        trTitle.appendChild(tdTitle);
        tbody.appendChild(trTitle);

        tdLeft.style.width = "35px";
        // tdLeft.style.paddingBottom = "10px";
        btnOpen.innerHTML = "<i class='material-icons'>open_in_new</i>";
        btnOpen.onclick = function() {
            displayInfo(list);
            displayMenu(list.menu);
            displayList(list);
            showPage(event, 'View');
        }

        btnSend.innerHTML = "<i class='material-icons'>send</i>";
        btnSend.onclick = function() {
            let b = document.getElementById("btn-modal-send");
            b.dataset.id = list.uuid;
            showModal('send-modal');
        }

        tdLeft.appendChild(btnOpen);
        tdLeft.appendChild(btnSend);
        trBtns.appendChild(tdLeft);

        tdRight.style.width = "35px";
        // tdRight.style.paddingBottom = "10px";
        btnEdit.innerHTML = "<i class='material-icons'>edit</i>";
        btnEdit.onclick = function() {
            editList(list.uuid);
        }

        btnDelete.innerHTML = "<i class='material-icons'>delete</i>";
        btnDelete.onclick = function() {
            confirmDeleteList(list.uuid);
        }

        tdRight.appendChild(btnEdit);
        tdRight.appendChild(btnDelete);
        trBtns.appendChild(tdRight);

        tbody.appendChild(trBtns);

        count++;
    }

    if (count == 0) {
        tbody.innerHTML = "<tr><td>No shopping lists to display....</td></tr>";
    }
}

function displayInfo(list) {
    let tbody = document.getElementById("table-list-info-view");
    tbody.innerHTML = "";

    let title = getTitle(list);
    let shop = list.shop ? list.shop : "---";

    tbody.innerHTML = tbody.innerHTML + "<tr><td><p>Title</p></td><td><p>" + title + "</p></td></tr>";
    tbody.innerHTML = tbody.innerHTML + "<tr><td><p>Shop</p></td><td><p>" + shop + "</p></td></tr>";
}

function displayMenu(menu) {
    function getRow(day) {
        let tr = document.createElement("tr");
        let s = menu[day.toLowerCase()] ? menu[day.toLowerCase()] : "---";
        tr.innerHTML = "<td><p>" + day + "</p></td><td><p>" + s + "</p></td>";
        return tr;
    }

    let tbody = document.getElementById("table-list-menu-view");
    tbody.innerHTML = "";

    tbody.appendChild(getRow("Mon"));
    tbody.appendChild(getRow("Tue"));
    tbody.appendChild(getRow("Wed"));
    tbody.appendChild(getRow("Thu"));
    tbody.appendChild(getRow("Fri"));
    tbody.appendChild(getRow("Sat"));
    tbody.appendChild(getRow("Sun"));
}

function displayList(list) {
    let tbody = document.getElementById("table-list-items-view");
    tbody.innerHTML = "";

    let count = 0;

    for (let item of list.items) {
        const uuid = item.uuid;

        let tr = document.createElement("tr");
        let chk = document.createElement('input');
        let tdLeft = document.createElement("td");
        let tdRight = document.createElement("td");

        chk.type = "checkbox";
        chk.classList.add("float-right");
        chk.checked = item.checked;

        chk.onclick = function() {
            toggleListItem(this, uuid);
        }

        tdLeft.innerHTML = "<p id='" + uuid + "'>" + item.item + "</p>";
        tdRight.appendChild(chk);

        tr.appendChild(tdLeft);
        tr.appendChild(tdRight);
        tbody.appendChild(tr);

        //sets style
        toggleListItem(chk, uuid);

        count++;
    }
}

function addAndDisplayList(list) {
    let msg;

    if (list.message) {
        msg = 'A list has been received with the following message:<br>' + list.message;
    } else {
        msg = 'A list has been received';
    }

    msg = msg + '<br>Do you want to view the list now?';

    let fnLoad = function() {
        addList(list, false);
    };
    let fnLoadAndDisplay = function() {
        addList(list, false);
        displayInfo(list);
        displayMenu(list.menu);
        displayList(list);
        showPage(event, 'View');
        hideModal('settings-modal');
        document.getElementById('main-header').style.display = 'block';
        closeNav();
    };

    showMsg('confirm', msg, fnLoadAndDisplay, fnLoad);
}
