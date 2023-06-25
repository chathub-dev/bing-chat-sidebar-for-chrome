const iframe = document.getElementById("underside-iframe-container");

function sendEventToIframe(name, args) {
  console.debug("sendEventToIframe", name, JSON.stringify(args));
  iframe.contentWindow.postMessage({ eventName: name, eventArgs: args }, "*");
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function buildActiveTabInfo(tab) {
  return {
    serpQuery: "",
    isActive: true,
    tabId: "",
    windowId: "",
    groupId: "",
    windowType: "",
    isLoading: false,
    title: tab.title,
    url: tab.url,
    pageLanguage: "",
  };
}

let chatPageInitialized = false;

async function postMessageListner(event) {
  console.debug("onMessage", event.origin, JSON.stringify(event.data));
  const eventName = event.data.eventName;
  if (eventName === "Discover.Chat.Interact.Req") {
    sendEventToIframe("Discover.Chat.Interact.Rep", { status: true });
  } else if (eventName === "Discover.Chat.Consent.Req") {
    sendEventToIframe("Discover.Chat.Consent.Rep", { text: "Accepted" });
  } else if (eventName === "Discover.Chat.Page.GetData") {
    const tab = await getActiveTab();
    const response = await chrome.tabs.sendMessage(tab.id, { action: "getPageData" });
    sendEventToIframe("Discover.Chat.Page", { text: response.text });
  } else if (eventName === "Discover.Ready" && !chatPageInitialized) {
    sendEventToIframe("Discover.VisibilityState", { isShow: true, timeStamp: Date.now() });
    sendEventToIframe("Discover.Tab.Click", { tabName: "chat", clientLevel: "window" });
    chatPageInitialized = true;
    const tab = await getActiveTab();
    if (tab) {
      sendEventToIframe("Discover.Client.TabStripModelChange", {
        eventType: "Activate",
        tabInfo: buildActiveTabInfo(tab),
      });
    }
  }
}

window.addEventListener("message", postMessageListner, false);

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  sendEventToIframe("Discover.Client.TabStripModelChange", {
    eventType: "Activate",
    tabInfo: buildActiveTabInfo(tab),
  });
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    sendEventToIframe("Discover.Client.TabStripModelChange", {
      eventType: "Activate",
      tabInfo: buildActiveTabInfo(tab),
    });
  }
});
