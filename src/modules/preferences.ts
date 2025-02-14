/**
 * The functions in this file generally are meant to be used only with the preferences page. The preferences page
 * doesn't exclusively use the `config.ts` functions because it directly modifies and parses configuration options and
 * loads/saves them. Avoid using these elsewhere.
 */
import { showConfirm } from './modals/modals';
import { ContainerCreate, ContainerDefaultURL, ContainerWithUrl } from '../types';
import { getSetting } from './config';
import { setSettings } from './config/setSettings';
import { ConfKey } from './constants';
import { createContainer, queryContainers } from './browser/containers';

/**
 * Use this on the preferences page only.
 */
export const bulkImport = async (str: string) => {
  try {
    const contexts = JSON.parse(str) as ContainerWithUrl[];

    // start by validating input
    if (!Array.isArray(contexts)) throw 'Input must be valid JSON, and it must be an array of objects.';
    if (!contexts?.length) return [];
    for (const context of contexts) {
      if (!context.name) throw `A value lacks a container name: ${JSON.stringify(context)}`;
    }

    const s = contexts.length === 1 ? '' : 's';
    const q = `Please confirm that you'd like to add ${contexts.length} container${s}.`;
    const proceed = await showConfirm(q, 'Add Containers?');
    if (!proceed) return [];

    // begin import
    const imported: ContainerWithUrl[] = [];
    const urls = (await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls)) || {};
    for (const context of contexts) {
      const c: ContainerCreate = {
        name: context.name,
        icon: context.icon || 'circle',
        color: context.color || 'toolbar',
      };

      const cc = await createContainer(c);
      const i: ContainerWithUrl = { ...cc };

      if (context?.defaultUrl) {
        urls[cc.cookieStoreId] = context.defaultUrl;
        i.defaultUrl = context.defaultUrl;
      }

      imported.push(i);
    }

    // push default URLs to storage
    await setSettings({ containerDefaultUrls: urls });
    return imported;
  } catch (err) {
    throw `bulk import failure: ${err}`;
  }
};

/**
 * Use this on the preferences page only.
 */
export const bulkExport = async () => {
  try {
    const urls = (await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls)) || {};
    const contexts = await queryContainers({});
    const results: ContainerWithUrl[] = [];

    for (const context of contexts) {
      const r: ContainerWithUrl = { ...context };

      if (urls[context.cookieStoreId]) {
        r.defaultUrl = urls[context.cookieStoreId];
      }

      results.push(r);
    }

    return results;
  } catch (err) {
    throw `bulk export failure: ${err}`;
  }
};
