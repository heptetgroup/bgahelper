var port = chrome.runtime.connect({name:'games'});

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == 'games');
    console.log('received message');
    port.onMessage.addListener(function(msg) {
	if(msg.event === 'pong')
	{
	    $('#logbox').append($('<span>pong<br></span>'));
//	    document.write('pong<br>');
	} else {
	    console.log(msg.event);
	}
    });
});

document.getElementById('pingbutton').addEventListener('click', doPing);


function doPing()
{
    port.postMessage({event:'ping'});
}
