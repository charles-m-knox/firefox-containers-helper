export const browserTabsCreate = browser.tabs.create;
export const browserTabsQuery = browser.tabs.query;

/**
 * Retrieves the currently active tab.
 *
 * @return The current active tab. Throws an exception if the current tab
 * could not be found.
 */
export const getActiveTab = async () => {
  const tabs = await browserTabsQuery({ currentWindow: true, active: true });
  for (const tab of tabs) {
    if (!tab.active) continue;
    return tab;
  }
  throw 'Failed to determine the current tab.';
};
