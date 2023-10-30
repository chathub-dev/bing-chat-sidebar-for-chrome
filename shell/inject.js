(function () {
  const extensionId =
    new URL(location.href).searchParams.get("extension") || "ncjedehfkpnliaafimjhdjjeggmfmlgf";
  const origin = `chrome-extension://${extensionId}`;

  let udsShellConfig = {};
  Object.defineProperty(window, "_udsShellConfig", {
    enumerable: true,
    get() {
      return udsShellConfig;
    },
    set(value) {
      console.debug("set _udsShellConfig", value);
      udsShellConfig = value;
      udsShellConfig.ClientWindowOrigin = origin;
    },
  });
})();
