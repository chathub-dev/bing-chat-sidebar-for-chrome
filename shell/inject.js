window.addEventListener("message", (event) => {
  const message = event.data;
  if (message.action === "setClientWindowOrigin") {
    console.debug("setClientWindowOrigin", message.origin);
    window.Underside.ClientWindowOrigin = message.origin;
  }
});
