browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading") return;
  if (!tab.url || tab.url.startsWith(browser.runtime.getURL(""))) return;

  browser.storage.local.get(["urls"]).then((res) => {
    const urls = res.urls ?? [];
    for (const url of urls) {
      if (tab.url?.includes(url)) {
        browser.tabs.update(tabId, {
          url: browser.runtime.getURL("src/no/no.html"),
        });
        break;
      }
    }
  });
});
