import ws from "/lib/Ws.mjs";
import Comp from "./shared/messages/model/dataModel.mjs";

window.WS = new ws({
    token: new URLSearchParams(document.location.search).get("token"),
    user: new URLSearchParams(document.location.search).get("name")
});

var app = new Comp({
    el: '#app'
})