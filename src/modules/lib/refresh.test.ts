import { showAlert, showConfirm } from '../modals/modals';
import { del } from './delete';
import { help } from '../help';
import { duplicate } from './duplicate';
import { refresh } from './refresh';
import { getFakeContainer } from '../testutil';
import { Container } from '../../types';

jest.mock('./duplicate', () => ({
  duplicate: jest.fn().mockImplementation(async (containers: Container[]) => containers.length),
}));

jest.mock('./delete', () => ({
  del: jest.fn().mockImplementation(async (containers: Container[]) => containers.length),
}));

jest.mock('../help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

jest.mock('../modals/modals', () => ({
  showAlert: jest.fn().mockImplementation(async () => true),
  showConfirm: jest.fn().mockImplementation(async () => true),
}));

describe('refresh', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('refreshes containers', async () => {
    document.body.innerHTML = '<input id="searchContainerInput" value="foo"/>';

    const fakeContainer1 = getFakeContainer();
    const fakeContainer2 = getFakeContainer();
    const containers = [fakeContainer1, fakeContainer2];

    const actual = await refresh(containers);

    const done = `Deleted 2 and re-created 2 containers.`;

    expect(showConfirm).toHaveBeenCalledTimes(2);
    expect(showConfirm).toHaveBeenNthCalledWith(
      1,
      `Delete and re-create 2 containers? Basic properties, such as color, URL, name, and icon are kept, but not cookies or other site information. The ordering of the containers may not be preserved. This will operate in two steps: duplicate, then delete.`,
      'Delete and Re-create?',
    );
    expect(showConfirm).toHaveBeenNthCalledWith(
      2,
      `This is a destructive action and will delete actual cookie and other related site data for 2 containers! Are you absolutely sure?`,
      'Really Delete and Re-create?',
    );
    expect(duplicate).toHaveBeenCalledTimes(1);
    expect(duplicate).toHaveBeenCalledWith(containers, false);
    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith(containers, false);
    expect(help).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenCalledWith(done);
    expect(showAlert).toHaveBeenCalledTimes(1);
    expect(showAlert).toHaveBeenCalledWith(done, 'Deleted and Recreated');

    expect(actual).toStrictEqual([2, 2] as const);
  });

  it('refreshes a container', async () => {
    document.body.innerHTML = '<input id="searchContainerInput" value="foo"/>';

    const fakeContainer1 = getFakeContainer();
    const containers = [fakeContainer1];

    const actual = await refresh(containers);

    const done = `Deleted 1 and re-created 1 container.`;

    expect(showConfirm).toHaveBeenCalledTimes(2);
    expect(showConfirm).toHaveBeenNthCalledWith(
      1,
      `Delete and re-create 1 container? Basic properties, such as color, URL, name, and icon are kept, but not cookies or other site information. The ordering of the container may not be preserved. This will operate in two steps: duplicate, then delete.`,
      'Delete and Re-create?',
    );
    expect(showConfirm).toHaveBeenNthCalledWith(
      2,
      `This is a destructive action and will delete actual cookie and other related site data for 1 container! Are you absolutely sure?`,
      'Really Delete and Re-create?',
    );
    expect(duplicate).toHaveBeenCalledTimes(1);
    expect(duplicate).toHaveBeenCalledWith(containers, false);
    expect(del).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith(containers, false);
    expect(help).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenCalledWith(done);
    expect(showAlert).toHaveBeenCalledTimes(1);
    expect(showAlert).toHaveBeenCalledWith(done, 'Deleted and Recreated');

    expect(actual).toStrictEqual([1, 1] as const);
  });

  it('does not refresh containers if the user declines the first prompt', async () => {
    document.body.innerHTML = '<input id="searchContainerInput" value="foo"/>';

    const fakeContainer1 = getFakeContainer();
    const fakeContainer2 = getFakeContainer();
    const containers = [fakeContainer1, fakeContainer2];

    (showConfirm as jest.Mock).mockImplementationOnce(async () => false);
    // (showConfirm as jest.Mock).mockImplementationOnce(async () => false);

    const actual = await refresh(containers);

    expect(showConfirm).toHaveBeenCalledTimes(1);
    expect(showConfirm).toHaveBeenNthCalledWith(
      1,
      `Delete and re-create 2 containers? Basic properties, such as color, URL, name, and icon are kept, but not cookies or other site information. The ordering of the containers may not be preserved. This will operate in two steps: duplicate, then delete.`,
      'Delete and Re-create?',
    );
    expect(duplicate).toHaveBeenCalledTimes(0);
    expect(del).toHaveBeenCalledTimes(0);
    expect(help).toHaveBeenCalledTimes(0);
    expect(showAlert).toHaveBeenCalledTimes(0);

    expect(actual).toStrictEqual([0, 0] as const);
  });

  it('does not refresh containers if the user declines the second prompt', async () => {
    document.body.innerHTML = '<input id="searchContainerInput" value="foo"/>';

    const fakeContainer1 = getFakeContainer();
    const containers = [fakeContainer1];

    (showConfirm as jest.Mock).mockImplementationOnce(async () => true);
    (showConfirm as jest.Mock).mockImplementationOnce(async () => false);

    const actual = await refresh(containers);

    expect(showConfirm).toHaveBeenCalledTimes(2);
    expect(showConfirm).toHaveBeenNthCalledWith(
      1,
      `Delete and re-create 1 container? Basic properties, such as color, URL, name, and icon are kept, but not cookies or other site information. The ordering of the container may not be preserved. This will operate in two steps: duplicate, then delete.`,
      'Delete and Re-create?',
    );
    expect(showConfirm).toHaveBeenNthCalledWith(
      2,
      `This is a destructive action and will delete actual cookie and other related site data for 1 container! Are you absolutely sure?`,
      'Really Delete and Re-create?',
    );
    expect(duplicate).toHaveBeenCalledTimes(0);
    expect(del).toHaveBeenCalledTimes(0);
    expect(help).toHaveBeenCalledTimes(0);
    expect(showAlert).toHaveBeenCalledTimes(0);

    expect(actual).toStrictEqual([0, 0] as const);
  });
});
