chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "games");
    port.onMessage.addListener(function(msg) {
	console.log(msg.event);
    });
});
			      

