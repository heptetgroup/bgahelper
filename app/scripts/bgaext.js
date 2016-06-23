/**
 * Created by jade on 18/06/2016.
 */

var games = Array();

var gameTable;
var windowObjectReference = null; // global variable

function setGameTable(gt)
{
    gameTable = gt;
}

function getGameTable() { return gameTable; }

function openGameListWindow() {
  if(windowObjectReference == null || windowObjectReference.closed)
  /* if the pointer to the window object in memory does not exist
     or if such pointer exists but the window was closed */

    {
//	var url = 'chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/html/games.html';
//	chrome.windows.create({ url: url, width: 500, height: 200, focused: false, CreateType: 'detached_panel' }, function(w) {
//	});
      windowObjectReference = window.open('', 'BgaHelperGameList',
					  'resizable,scrollbars,status');
	//      windowObjectReference.addEventListener('ready', function() {

	var jqBody = $(windowObjectReference.document.body);
	var gt = jqBody.find('#gametable');
	var table;
	if(gt.length === 0)
	{
	    windowObjectReference.document.write('<html><head><link rel="stylesheet" href="http://localhost:9020/kay/bower_components/datatables.net-dt/css/jquery.dataTables.css"></head><body><h1>Games</h1></body></html>');
	    jqBody = $(windowObjectReference.document.body);
	    table = $('<table id="gametable"></table>');//<thead><tr><th>Game</th><th>Parameters</th></tr></thead><tbody></tbody></table>');
	    jqBody.append(table);
	} else {
	    table = gt.eq(0);
	}
	
	setGameTable(table.DataTable({ columns: [ { title: 'ID' }, { title: 'Game' }, { title: 'Status' }, { title: 'Parameters' } , { title: 'Restrictions' }, { title: 'No. of Players' }  ] }));
      
	  console.log('I made it!');
//      });
      
    /* then create it. The new window will be created and
       will be brought on top of any other window. */
  }
  else
  {
    windowObjectReference.focus();
    /* else the window reference must exist and the window
       is not closed; therefore, we can bring it back on top of any other
       window with the focus() method. There would be no need to re-create
       the window or to reload the referenced resource. */
  };
}

openGameListWindow();

function gameTracker(mutations) {
    mutations.forEach(function (m) {
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
		var id = q[0].id.substring(10);
		var game = [id, gameName, status, exp, restrictions, places.length];
		console.log(game);
		getGameTable().row.add(game).draw();
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
			  console.log('observing');

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

