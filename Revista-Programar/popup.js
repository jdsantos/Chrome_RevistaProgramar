// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

requestMagazineList();
/*$.ajax({
  type: "GET",
  url: "http://www.revista-programar.info/?action=editions",
  success: showMagazineTiles
});*/

function requestMagazineList(){
	$.ajax({
	  type: "GET",
	  url: "http://www.revista-programar.info/?action=editions",
	  success: showMagazineTiles
	});
}

var minutesTillRefresh = 5;
var checkNewMaganizeTimer = setTimeout(checkForNewMaganize,1000*60*minutesTillRefresh);
function checkForNewMaganize(){
	requestMagazineList();
	//unstopable timer
	checkNewMaganizeTimer = setTimeout(checkForNewMaganize,1000*60*minutesTillRefresh);
}

function createNotificationInstance(title,msg) {
  var notification = webkitNotifications.createNotification(
	  'icon.png',  // icon url - can be relative
	  title,  // notification title
	  msg  // notification body text
	);
	notification.show();
}
var months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function showMagazineTiles(data, textStatus, req) {
	
  //var magazineTiles = req.responseXML.getElementsByTagName("photo");
  try{
	  if ( document.body.hasChildNodes() )
	  {
		  while ( document.body.childNodes.length >= 1 )
		  {
		  	document.body.removeChild( document.body.firstChild );       
		  } 
	  }
	  var plainResponseText = req.responseText;
	  //Bad bad bad harcoded stuff
	  
	  var magazineContainingDiv = "<div id=\"content\">";
	  var siteURL = "http://www.revista-programar.info/";
	  
	  var startingSubstrIndex = plainResponseText.indexOf(magazineContainingDiv);
	  var endingSubstrIndex = plainResponseText.indexOf("</div>",startingSubstrIndex);
	  var narrowedSearchString = plainResponseText.substring(startingSubstrIndex+magazineContainingDiv.length,endingSubstrIndex);
	  
	  var dummyDiv = document.createElement("div");
	  dummyDiv.innerHTML = narrowedSearchString;
	  
	  
	  var magazineAnchorList = dummyDiv.getElementsByTagName("a");
	  
	  if(magazineAnchorList.length>localStorage["magazineCount"]){
		var notification = webkitNotifications.createNotification(
		  'icon48.png',  // icon url - can be relative
		  'Nova revista!',  // notification title
		  'Já está disponível uma nova edição da Revista PROGRAMAR'  // notification body text
		);
		notification.show();
	  }
	  
	  localStorage["magazineCount"]=magazineAnchorList.length; /**Store magazine count*/
	  for (var i = 0, magazine; magazine = magazineAnchorList[i]; i++) {
	    var magazineAnchor = document.createElement("a");
		var magazineImage = document.createElement("image");
		magazineAnchor.setAttribute("href",siteURL+magazine.getAttribute("href"));
		console.log("href: "+siteURL+magazine.getAttribute("href"));
		var magazineImageObj = magazine.childNodes[0];
		
		magazineImage.setAttribute("src",magazineImageObj.getAttribute("src"));
		console.log("src: "+magazineImageObj.getAttribute("src"));
	    magazineAnchor.appendChild(magazineImage);
	    document.body.appendChild(magazineAnchor);
	  }	  
  }catch(err){
	console.error("An Error ocurred: "+err+"\n");
	throw err;
  }
}

// See: http://www.flickr.com/services/api/misc.urls.html
function constructImageURL(photo) {
  /*return "http://farm" + photo.getAttribute("farm") +
      ".static.flickr.com/" + photo.getAttribute("server") +
      "/" + photo.getAttribute("id") +
      "_" + photo.getAttribute("secret") +
      "_s.jpg";*/
}