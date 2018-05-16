'use strict';

chrome.browserAction.onClicked.addListener((tab) =>{
    chrome.tabs.sendMessage(tab.id, {
        event: 'toggleEnabled'
    })
});

chrome.runtime.onMessage.addListener((message, sender) =>{
    if(message.event === 'changeIcon'){
        let type = message.data.enable ? '' : '-disabled';

        chrome.browserAction.setIcon({
            path: {
                "16" : `img/icon16${type}.png`,
                "32" : `img/icon32${type}.png`,
                "48" : `img/icon48${type}.png`,
                "64" : `img/icon64${type}.png`,
                "128": `img/icon128${type}.png`
            }
        });
    }
});

