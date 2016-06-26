/**
 * Created by jade on 18/06/2016.
 */

var games = Array();
var port = chrome.runtime.connect({name: 'bgahelper'});
port.postMessage({event: 'initialize', message: 'BGA Helper content script executing...'});

console.log("window id = " + window.id);

//chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, {}, function(window) {
    port.postMessage({event: 'checkWindow', windowId: 0});
//});

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "bgahelper");
    port.onMessage.addListener(function(msg) {
	if(msg.event === 'checkWindowResponse') {
	    console.log(msg.event);
	}
    });
});

var gameTable;
var windowObjectReference = null; // global variable

function setGameTable(gt)
{
    gameTable = gt;
}

function getGameTable() { return gameTable; }


//openGameListWindow();

function gameTracker(mutations) {
    mutations.forEach(function (m) {
	console.log('interation mutation');
	if(m.removedNodes != null && m.removedNodes.length != 0)
	{
	    m.removedNodes.forEach(function(n) {
		if(n.id.startsWith('gametable_')) {
		    console.log('removed node id ' + n.id);
		    var id = n.id.substring(10);
		    port.postMessage({event: 'removeGame', gameId: id });
		}
	    });
	}
	m.addedNodes.forEach(function(n) {
	    if(n.id.startsWith('gametable_')) {
//	    if(n.classList.contains('gametable_game_10')) {
    console.log('here');
		var q = $(n);
		var gameName = q.find('.gamename').text();
		var qq = q.find('.table_top_status_detailed');
		var status = q.find('.table_status_detailled').text();
		var firstDiv = qq.find('div').eq(0);
		var restrictions = '';
		if(firstDiv[0].childNodes.length > 0)
		{
		    restrictions = firstDiv[0].childNodes[0].data || '';
		}
		
		var qqq = qq.find('.smalltext');
		var places = q.find('.players').find('.tableplace');
		//		windowObjectReference.document.write(q.html());
		var exp = qqq.text();
		var id = '_' + q[0].id.substring(10);
		var game = [id, gameName, status, exp, restrictions, places.length];
		console.log(game);
		port.postMessage({ event: 'addGame', game: game });
//		getGameTable().row.add(game).draw();
		if(places.find('.freeplace').length)
		{
//		    window.location.href = q.find('.gametablelink').attr('href');
		}
	    }
	});
    });
}


$(document).ready(function() {
var target = document.getElementById('main-content'); //gamelobby_inner
  var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function (mutation) {
	  if(mutation.type === 'childList') {
	      if(mutation.addedNodes !== null) {
		  mutation.addedNodes.forEach(function(node) {
		      if(node.id == 'gamelobby-module')
		      {
			  var target2 = document.getElementById('gametables_other');
			  var observer2 = new MutationObserver(gameTracker);
//			  console.log('observing');

			  observer2.observe(target2, { childList: true });
			  
		      }

		  });
	      }
	  }
      });
  });

  var config = { attributes: true, childList: true, characterData: true };

// pass in the target node, as well as the observer options
  observer.observe(target, config);

// later, you can stop observing
  //observer.disconnect();

/*  var games = $('.gametable_game_10');
console.log('number of games: ' + games.length);
for(var game of games)
{
  console.log(game);
}*/
});

