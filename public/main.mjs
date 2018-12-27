import ws from "/lib/Ws.mjs";
import Messages from "./shared/messages/model/dataModel.mjs";
import Users from "./shared/users/model/dataModel.mjs";

window.WS = new ws({
    token: new URLSearchParams(document.location.search).get("token"),
    user: new URLSearchParams(document.location.search).get("user")
});

new Messages({
    el: '#messages'
})

new Users({
    el: '#users'
})