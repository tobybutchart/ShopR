const supported = ('share' in navigator);
const btnShare = document.getElementById('btn-share-peer-id');

if (supported) {
    btnShare.addEventListener('click', (e) => {
        let p = document.getElementById("lbl-peer-id");

        if (p.innerHTML == "---") {
            showMsg('warning', 'No connection ID has been generated');
            return;
        }

        console.log(e);
        e.preventDefault();
        const shareOpts = {
            title: 'ShopR List Share Request',
            text: 'A ShopR share request has been sent: ' + p.innerHTML,
            url: document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href,
        };
        navigator.share(shareOpts)
        .then((e) => {
            const msg = 'navigator.share succeeded.';
            console.log(msg, e);
        })
        .catch((err) => {
            const msg = 'navigator.share failed';
            console.error(msg, err);
        });
    });
} else {
    btnShare.addEventListener('click', (e) => {
        let p = document.getElementById("lbl-peer-id");

        if (p.innerHTML == "---") {
            showMsg('warning', 'No connection ID has been generated');
            return;
        }

        console.log(e);
        e.preventDefault();
        window.prompt('Your browser does not support Web Share API.\nHighlight the below and ctrl + c, or long click if on mobile and select share', p.innerHTML);
    });
}

var peer = null;
var lastPeerId = null;
var peerId = null;
var connected = false;
var conn = null;
var userClosedConn = false;

function toggleReceiver() {
    if (connected) {
        userClosedConn = true;
        peer.disconnect();
    } else {
        userClosedConn = false;
        initReceiver();
    }
}

function initReceiver() {
    let p = document.getElementById("lbl-peer-id");
    let btn = document.getElementById("btn-generate-peer-id");

    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    peer.on('open', function (id) {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }

        console.log('ID: ' + peer.id);
        p.innerHTML = peer.id;
        btn.style.color = MSG_SUCCESS_COLOUR;
        connected = true;
        console.log("Awaiting connection...");
    });

    peer.on('connection', function (c) {
        // Allow only a single connection
        if (conn && conn.open) {
            c.on('open', function() {
                c.send("Already connected to another client");
                setTimeout(function() { c.close(); }, 500);
            });
            return;
        }

        conn = c;
        console.log("Connected to: " + conn.peer);

        conn.on('data', function (data) {
            console.log("Data recieved", data);

            if (data.substring(0, 1) != '{' || data.slice(-1) != '}') {
                showMsg('error', 'An unknown list has been received');
                console.log(data);
                return
            }

            let list = JSON.parse(data);
            addAndDisplayList(list);
        });

        conn.on('close', function () {
            console.log("Connection closed");
            conn = null;
        });
    });

    peer.on('disconnected', function () {
        console.log('Connection disconnected. Please reconnect');

        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;

        if (!userClosedConn) {
            peer.reconnect();
        }

        let p = document.getElementById("lbl-peer-id");
        let btn = document.getElementById("btn-generate-peer-id");

        p.innerHTML = "---";
        btn.style.color = MSG_ERROR_COLOUR;
        connected = false;
    });

    peer.on('close', function() {
        conn = null;
        console.log('Connection closed');
    });

    peer.on('error', function (err) {
        console.log(err);
        showMsg('error', 'An error has occurred:<br>' + err)
    });
}

function initSender() {
    // Create own peer object with connection to shared PeerJS server
    peer = new Peer(null, {
        debug: 2
    });

    peer.on('open', function (id) {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }

        console.log('ID: ' + peer.id);
        document.getElementById('btn-modal-connect').style.display = "none";
        document.getElementById('btn-modal-send').style.display = "inline-block";
    });

    peer.on('connection', function (c) {
        // Disallow incoming connections
        c.on('open', function() {
            c.send("Sender does not accept incoming connections");
            setTimeout(function() { c.close(); }, 500);
        });
    });

    peer.on('disconnected', function () {
        console.log('Connection disconnected');

        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;

        if (!userClosedConn) {
            peer.reconnect();
        }
    });

    peer.on('close', function() {
        conn = null;
        console.log('Connection closed');
    });

    peer.on('error', function (err) {
        console.log(err);
        showMsg('error', 'An error has occurred:<br>' + err)
    });
};

function joinPeer(id) {
    // Close old connection
    if (conn) {
        conn.close();
    }

    // Create connection to destination peer specified in the input field
    conn = peer.connect(id, {
        reliable: true
    });

    conn.on('open', function () {
        console.log("Connected to: " + conn.peer);

        let lbl = document.getElementById("lbl-send-id");
        let txt = document.getElementById("lbl-send-message");
        let btn = document.getElementById("btn-modal-send");
        let uuid = btn.dataset.id;

        let list = getListByProp('uuid', uuid);
        list.message = txt.value;

        conn.send(JSON.stringify(list));
        console.log("Sent: " + JSON.stringify(list));

        lbl.value = "";
        txt.value = "";

        userClosedConn = true;
        //peer.disconnect();

        hideModal('send-modal');
        showMsg('info', 'List sent');
    });

    // Handle incoming data (messages only since this is the signal sender)
    conn.on('data', function (data) {
        console.log("Data received: ", data);
    });

    conn.on('close', function () {
        console.log("Connection closed");
    });
}

function sendList() {
    //validate
    let lbl = document.getElementById("lbl-send-id");
    let txt = document.getElementById("lbl-send-message");
    let btn = document.getElementById("btn-modal-send");
    let uuid = btn.dataset.id;

    if (lbl.value == "") {
        showMsg('error', 'A valid connection ID must be given');
        document.getElementById('btn-modal-connect').style.display = "inline-block";
        document.getElementById('btn-modal-send').style.display = "none";
    } else {
        joinPeer(lbl.value);

        if (conn && conn.open) {

        }
    }
}
