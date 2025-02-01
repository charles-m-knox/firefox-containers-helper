import { showPrompt } from '../modals/modals';
import { help } from '../help';
import { rename } from './rename';
import { getFakeContainer } from '../testutil';
import { Container, ContainerUpdates } from '../../types';
import { updateContainer } from '../browser/containers';

// must be hoisted so that it can be used in the mock, and so it must not be an arrow function
async function mockedUpdateContainer(containerId: string, fields: ContainerUpdates): Promise<Container> {
  return getFakeContainer({
    ...fields,
  });
}

jest.mock('../browser/containers', () => ({
  updateContainer: jest.fn().mockImplementation(mockedUpdateContainer),
}));

jest.mock('../help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

jest.mock('../modals/modals', () => ({
  showPrompt: jest.fn().mockImplementation(async () => 'bar'),
}));

describe('rename', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('renames containers', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo1' });
    const fakeContainer2 = getFakeContainer({ name: 'foo2' });
    const containers = [fakeContainer1, fakeContainer2];

    await rename(containers);

    expect(showPrompt).toHaveBeenCalledTimes(1);
    expect(showPrompt).toHaveBeenNthCalledWith(1, 'Rename 2 containers to:', 'Rename', '');
    expect(help).toHaveBeenCalledTimes(2);
    expect(help).toHaveBeenNthCalledWith(1, 'Renamed 1 containers');
    expect(help).toHaveBeenNthCalledWith(2, 'Renamed 2 containers');
    expect(updateContainer).toHaveBeenCalledTimes(2);
    expect(updateContainer).toHaveBeenNthCalledWith(1, fakeContainer1.cookieStoreId, { name: 'bar' });
    expect(updateContainer).toHaveBeenNthCalledWith(2, fakeContainer2.cookieStoreId, { name: 'bar' });
  });

  it('throws an error if an update fails', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo1' });
    const fakeContainer2 = getFakeContainer({ name: 'foo2' });
    const containers = [fakeContainer1, fakeContainer2];

    const thrownError = new Error('Something broke');

    (updateContainer as jest.Mock).mockImplementationOnce(mockedUpdateContainer);
    (updateContainer as jest.Mock).mockImplementationOnce(async () => {
      throw thrownError;
    });

    const expected = `Failed to rename container ${fakeContainer2.name} (id ${fakeContainer2.cookieStoreId}): ${thrownError}`;

    try {
      await rename(containers);
      // fail intentionally, it's supposed to throw
      expect(true).toEqual(false);
    } catch (err) {
      expect(err).toEqual(expected);
    }

    expect(showPrompt).toHaveBeenCalledTimes(1);
    expect(showPrompt).toHaveBeenNthCalledWith(1, 'Rename 2 containers to:', 'Rename', '');
    expect(help).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenNthCalledWith(1, 'Renamed 1 containers');
    expect(updateContainer).toHaveBeenCalledTimes(2);
    expect(updateContainer).toHaveBeenNthCalledWith(1, fakeContainer1.cookieStoreId, { name: 'bar' });
    expect(updateContainer).toHaveBeenNthCalledWith(2, fakeContainer2.cookieStoreId, { name: 'bar' });
  });

  it('does not rename anything if no input is provided', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo1' });
    const containers = [fakeContainer1];

    (showPrompt as jest.Mock).mockImplementationOnce(async () => '');

    await rename(containers);

    expect(showPrompt).toHaveBeenCalledTimes(1);
    expect(showPrompt).toHaveBeenNthCalledWith(1, 'Rename 1 container to:', 'Rename', fakeContainer1.name);
    expect(help).toHaveBeenCalledTimes(0);
    expect(updateContainer).toHaveBeenCalledTimes(0);
  });
});
