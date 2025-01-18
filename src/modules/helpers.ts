import { Container, ContainerDefaultURL, ExtensionConfig, SelectedContextIndex } from '../types';
import { UrlMatchTypes } from './constants';
import { showAlert } from './modals';
import { getContainer } from './browser/containers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const alertOnError = (fn: any) => async (msg: string, title: string) => {
  try {
    await fn();
  } catch (err) {
    await showAlert(`${msg}: ${err}`, title);
  }
};

/**
 * Determines whether or not to override the container's default URL with the current tab's URL, based on
 * `config.openCurrentTabUrlOnMatch`
 *
 * @param {string} url The URL to open
 * @param {string} current The current tab's URL
 * @param {UrlMatchTypes} match The method to use for identifying url matches
 *
 * @returns An empty string if there is no URL to override. Otherwise, it returns the new URL to navigate to.
 */
export const getCurrentTabOverrideUrl = (url: string, current: string, match: UrlMatchTypes): string => {
  if (!url || !current) return '';

  try {
    const currentURL = new URL(current); // either of these can throw exceptions via user input
    const urlURL = new URL(url); // either of these can throw exceptions via user input

    // just determine the top level domain and the next level domain
    // using "tld" as a quick shorthand even though it's not technically correct
    const urlTLD = urlURL.hostname.split('.').slice(-2).join('.').toLowerCase();
    const currentTLD = currentURL.hostname.split('.').slice(-2).join('.').toLowerCase();

    switch (match) {
      case UrlMatchTypes.origin:
        if (currentURL.origin.toLowerCase() === urlURL.origin.toLowerCase()) {
          return current;
        }
        break;
      case UrlMatchTypes.host:
        if (currentURL.host.toLowerCase() === urlURL.host.toLowerCase()) {
          return current;
        }
        break;
      case UrlMatchTypes.domain:
        if (urlTLD === currentTLD) {
          return current;
        }
        break;
      case UrlMatchTypes.domainPort:
        if (urlTLD === currentTLD && currentURL.port === urlURL.port) {
          return current;
        }
        break;
      case UrlMatchTypes.hostname:
        if (currentURL.hostname.toLowerCase() === urlURL.hostname.toLowerCase()) {
          return current;
        }
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(`couldn't determine URL override for url=${url}, current=${current}, matchType=${match}: ${err}`);
  }

  return '';
};

/**
 * Quickly checks to see if *any* context is selected, via the selection mode
 * @returns Whether or not *any* current context is selected
 */
export const isAnyContextSelected = (selected: SelectedContextIndex) => {
  const keys = Object.keys(selected);
  for (let i = 0; i < keys.length; i++) {
    const key = parseInt(keys[i], 10);
    if (selected[key] === 1) {
      return true;
    }
  }
  return false;
};

/**
 * Returns the number of dirty entries in the config - e.g. container URLs
 * that no longer have containers (orphaned).
 *
 * @param conf
 * @return The number of dirty entries in the config.
 */
export const checkDirty = async (conf: ExtensionConfig) => {
  if (!conf?.containerDefaultUrls) return 0;
  const removed: string[] = [];
  for (const id in conf.containerDefaultUrls) {
    try {
      const context = await getContainer(id);

      if (!context) removed.push(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      removed.push(id);
    }
  }

  return removed.length;
};

/**
 * Cleans up the config for this extension by removing all cookie store ID's
 * that do not currently correspond to an actual container's cookie store ID.
 *
 * @return The resulting `ExtensionConfig` and the container cookie store ID's (strings) that were removed.
 */
export const getCleanSettings = async (conf: ExtensionConfig) => {
  const ids = Object.keys(conf.containerDefaultUrls);

  const removed: string[] = [];

  for (const id of ids) {
    /**
     * Reusable function that deletes a cookie store ID from the
     * conf.containerDefaultUrls object. Does not delete the actual
     * container, because presumably, it doesn't exist if this function
     * is being called in the first place.
     *
     * @param id The cookie store ID whose default URL should be remove.
     */
    const remove = (id: string) => {
      removed.push(id);
      delete conf.containerDefaultUrls[id];
    };

    try {
      const context = await getContainer(id);
      if (!context) remove(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      remove(id);
    }
  }

  conf.selectedContextIndices = {};

  return [conf, removed] as const;
};

/**
 * Checks if a given container's `contextualIdentity` (`context`) has a default URL value set in
 * `config.containerDefaultUrls`.
 *
 * @param context The container
 * @param userQuery The text that the user has searched for
 * @returns Whether or not the container `context` has a default URL set
 */
export const queryUrls = (context: Container, query: string, urls: ContainerDefaultURL) => {
  const lookup = urls[context.cookieStoreId];
  if (!lookup) return false;
  return lookup.toString().toLowerCase().indexOf(query) !== -1;
};

// This is a shameless copy of deep equality comparison from StackOverflow.
// https://stackoverflow.com/a/16788517
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectEquals = (x: any, y: any): boolean => {
  if (x === null || x === undefined || y === null || y === undefined) {
    return x === y;
  }
  // after this just checking type of one would be enough
  if (x.constructor !== y.constructor) {
    return false;
  }
  // if they are functions, they should exactly refer to same one (because of closures)
  if (x instanceof Function) {
    return x === y;
  }
  // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
  if (x instanceof RegExp) {
    return x === y;
  }
  if (x === y || x.valueOf() === y.valueOf()) {
    return true;
  }
  if (Array.isArray(x) && Array.isArray(y) && x.length !== y.length) {
    return false;
  }

  // if they are dates, they must had equal valueOf
  if (x instanceof Date) {
    return false;
  }

  // if they are strictly equal, they both need to be object at least
  if (!(x instanceof Object)) {
    return false;
  }
  if (!(y instanceof Object)) {
    return false;
  }

  // recursive object equality check
  const p = Object.keys(x);
  return (
    Object.keys(y).every(function (i) {
      return p.indexOf(i) !== -1;
    }) &&
    p.every(function (i) {
      return objectEquals(x[i], y[i]);
    })
  );
};
