function showPage(evt, pageName, onShowEvent) {
    let i, tabContent, tabLinks;

    tabContent = document.getElementsByClassName("tab-content");

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tablinks");

    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active";

    if (onShowEvent != null && typeof onShowEvent === 'function') {
        onShowEvent();
    }
}
