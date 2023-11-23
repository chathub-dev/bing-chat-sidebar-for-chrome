(function clearCSP() {
  const csp = document.querySelectorAll(".underside-shell-frame");
  csp.forEach((el) => {
    console.log(el);
    el.removeAttribute("csp");
  });
})();
