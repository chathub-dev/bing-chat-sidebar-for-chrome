pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.min.js";

async function extractPDFText(url) {
  const pdf = await pdfjsLib.getDocument(url).promise;
  console.debug("PDF pages", pdf.numPages);

  const countPromises = [];
  for (let currentPage = 1; currentPage <= pdf.numPages; currentPage++) {
    const page = pdf.getPage(currentPage);
    countPromises.push(
      page.then(async (page) => {
        const text = await page.getTextContent();
        return text.items.map((s) => s.str).join("");
      })
    );
  }

  const texts = await Promise.all(countPromises);
  return texts.join("");
}

function isPDFPage() {
  if (/\.pdf$/i.test(location.href)) {
    return true;
  }
  if (document.querySelector("pdf-viewer")) {
    return true;
  }
  const embed = document.querySelector("embed");
  if (embed && embed.type === "application/pdf") {
    return true;
  }
  return false;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getPageData") {
    const text = document.body.innerText;
    if (text) {
      sendResponse({ text });
    } else if (isPDFPage()) {
      extractPDFText(location.href).then((text) => sendResponse({ text }));
      return true;
    }
  }
});
