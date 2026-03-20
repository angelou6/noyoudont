browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    browser.storage.local.get(["urls"]).then((res) => {
      const urls = res.urls ?? [];
      for (const url of urls) {
        if (tab.url?.includes(url) && tab.id)
          browser.tabs.update(tab.id, {
            url: browser.runtime.getURL("src/no/no.html"),
          });
      }
    });
  }
});
