'use strict';

function suspendTab(suspendedTabUrl){

	// Check current url
	if(suspendedTabUrl.indexOf('suspended.html') > 0){ window.location.replace(suspendedTabUrl); }
	else{ window.location.href = suspendedTabUrl; }

}

// Listen for events from background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	// Switch between events
	switch(request.action){
		case 'confirmSuspendTab':
			if(request.suspendedTabUrl){
				suspendTab(request.suspendedTabUrl);
			}
			break;
		default:
			break;
	}

});