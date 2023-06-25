const origin = `chrome-extension://${chrome.runtime.id}`;
window.postMessage({ action: "setClientWindowOrigin", origin }, "*");
console.debug("postMessage setClientWindowOrigin", origin);
