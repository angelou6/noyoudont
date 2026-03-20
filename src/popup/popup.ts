document.addEventListener("DOMContentLoaded", () => {
  const websiteHolder = document.querySelector(".websites");
  const websiteForm = document.querySelector("form");
  const addThisSiteButton = document.querySelector(".add-this");

  function removeItem(holder: HTMLDivElement) {
    websiteHolder?.removeChild(holder);
    const url = holder.dataset.url;
    browser.storage.local.get(["urls"]).then((res) => {
      const urls: string[] = res.urls ?? [];
      browser.storage.local.set({
        urls: urls.filter((el: string) => el !== url),
      });
    });
  }

  function createHolder(url: string) {
    const holder = document.createElement("div");
    const remove = document.createElement("button");

    holder.innerText = url;
    holder.classList.add("website-holder");
    holder.dataset.url = url;
    remove.innerText = "X";
    remove.addEventListener("click", () => removeItem(holder));
    holder.appendChild(remove);

    return holder;
  }

  function addWebsite(url: string) {
    websiteHolder?.appendChild(createHolder(url));
    browser.storage.local.get(["urls"]).then((res) => {
      const urls = res.urls ?? [];
      browser.storage.local.set({ urls: [...urls, url] });
    });
  }

  websiteForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!websiteForm) return;
    const data = new FormData(websiteForm);
    const url = (data.get("website") as string) || "www.google.com";
    websiteForm.reset();
    addWebsite(url);
  });

  addThisSiteButton?.addEventListener("click", async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab.url) addWebsite(tab.url);
    if (tab.id) browser.tabs.remove(tab.id);
  });

  browser.storage.local.get(["urls"]).then((res) => {
    const urls = res.urls ?? [];
    for (const url of urls) {
      websiteHolder?.appendChild(createHolder(url));
    }
  });
});
