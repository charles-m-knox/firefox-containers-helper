import { showPrompt, showConfirm } from '../modals/modals';
import { updateContainer } from '../browser/containers';
import { help } from '../help';
import { getFakeContainer } from '../testutil';
import { replaceInName } from './replaceInName';

jest.mock('../browser/containers', () => ({
  updateContainer: jest
    .fn()
    .mockImplementation(async (cookieStoreId: string, fields: browser.contextualIdentities._UpdateDetails) =>
      getFakeContainer({ cookieStoreId, ...fields }),
    ),
}));

jest.mock('../help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

jest.mock('../modals/modals', () => ({
  showAlert: jest.fn().mockImplementation(async () => true),
  showConfirm: jest.fn().mockImplementation(async () => true),
  showPrompt: jest.fn().mockImplementation(async () => ''),
}));

describe('replaceInName', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('replaces names in containers', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo' });
    const fakeContainer2 = getFakeContainer({ name: 'bar' });
    const containers = [fakeContainer1, fakeContainer2];

    (showPrompt as jest.Mock).mockImplementationOnce(async () => 'foo');
    (showPrompt as jest.Mock).mockImplementationOnce(async () => 'bar');
    (showConfirm as jest.Mock).mockImplementationOnce(async () => true);

    await replaceInName(containers);

    expect(showPrompt).toHaveBeenCalledTimes(2);
    expect(showConfirm).toHaveBeenCalledTimes(1);
    expect(showPrompt).toHaveBeenNthCalledWith(
      1,
      `(1/3) What case-sensitive string in 2 container names would you like to search for?`,
      'Search String',
      '',
    );
    expect(showPrompt).toHaveBeenNthCalledWith(
      2,
      '(2/3) What string would you like to replace it with?',
      'Replace String',
      '',
    );
    expect(showConfirm).toHaveBeenNthCalledWith(
      1,
      `(3/3) Replace the case-sensitive string "foo" with "bar" in the name of 2 containers?`,
      'Confirm',
    );
    expect(updateContainer).toHaveBeenCalledTimes(1);
    expect(updateContainer).toHaveBeenNthCalledWith(1, containers[0].cookieStoreId, {
      name: 'bar',
    });
    expect(help).toHaveBeenCalledTimes(2);
    expect(help).toHaveBeenNthCalledWith(1, 'Updated 0 containers');
    expect(help).toHaveBeenNthCalledWith(2, 'Updated 1 containers');
  });

  it('replaces names in a container', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo' });
    const containers = [fakeContainer1];

    (showPrompt as jest.Mock).mockImplementationOnce(async () => 'foo');
    (showPrompt as jest.Mock).mockImplementationOnce(async () => 'bar');
    (showConfirm as jest.Mock).mockImplementationOnce(async () => true);

    await replaceInName(containers);

    expect(showPrompt).toHaveBeenCalledTimes(2);
    expect(showConfirm).toHaveBeenCalledTimes(1);
    expect(showPrompt).toHaveBeenNthCalledWith(
      1,
      `(1/3) What case-sensitive string in 1 container name would you like to search for?`,
      'Search String',
      fakeContainer1.name,
    );
    expect(showPrompt).toHaveBeenNthCalledWith(
      2,
      '(2/3) What string would you like to replace it with?',
      'Replace String',
      fakeContainer1.name,
    );
    expect(showConfirm).toHaveBeenNthCalledWith(
      1,
      `(3/3) Replace the case-sensitive string "foo" with "bar" in the name of 1 container?`,
      'Confirm',
    );
    expect(updateContainer).toHaveBeenCalledTimes(1);
    expect(updateContainer).toHaveBeenNthCalledWith(1, containers[0].cookieStoreId, {
      name: 'bar',
    });
    expect(help).toHaveBeenCalledTimes(2);
    expect(help).toHaveBeenNthCalledWith(1, 'Updated 0 containers');
    expect(help).toHaveBeenNthCalledWith(2, 'Updated 1 containers');
  });

  it('does not replace names in containers if the third prompt is declined', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo' });
    const fakeContainer2 = getFakeContainer({ name: 'bar' });
    const containers = [fakeContainer1, fakeContainer2];

    (showPrompt as jest.Mock).mockImplementationOnce(async () => 'foo');
    (showPrompt as jest.Mock).mockImplementationOnce(async () => 'bar');
    (showConfirm as jest.Mock).mockImplementationOnce(async () => false);

    await replaceInName(containers);

    expect(showPrompt).toHaveBeenCalledTimes(2);
    expect(showConfirm).toHaveBeenCalledTimes(1);
    expect(showPrompt).toHaveBeenNthCalledWith(
      1,
      `(1/3) What case-sensitive string in 2 container names would you like to search for?`,
      'Search String',
      '',
    );
    expect(showPrompt).toHaveBeenNthCalledWith(
      2,
      '(2/3) What string would you like to replace it with?',
      'Replace String',
      '',
    );
    expect(showConfirm).toHaveBeenNthCalledWith(
      1,
      `(3/3) Replace the case-sensitive string "foo" with "bar" in the name of 2 containers?`,
      'Confirm',
    );
    expect(updateContainer).toHaveBeenCalledTimes(0);
    expect(help).toHaveBeenCalledTimes(0);
  });

  it('does not replace names in containers if the second prompt is canceled', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo' });
    const fakeContainer2 = getFakeContainer({ name: 'bar' });
    const containers = [fakeContainer1, fakeContainer2];

    (showPrompt as jest.Mock).mockImplementationOnce(async () => 'foo');
    (showPrompt as jest.Mock).mockImplementationOnce(async () => null);
    (showConfirm as jest.Mock).mockImplementationOnce(async () => true);

    await replaceInName(containers);

    expect(showPrompt).toHaveBeenCalledTimes(2);
    expect(showConfirm).toHaveBeenCalledTimes(0);
    expect(showPrompt).toHaveBeenNthCalledWith(
      1,
      `(1/3) What case-sensitive string in 2 container names would you like to search for?`,
      'Search String',
      '',
    );
    expect(showPrompt).toHaveBeenNthCalledWith(
      2,
      '(2/3) What string would you like to replace it with?',
      'Replace String',
      '',
    );
    expect(updateContainer).toHaveBeenCalledTimes(0);
    expect(updateContainer).toHaveBeenCalledTimes(0);
    expect(help).toHaveBeenCalledTimes(0);
  });

  it('does not replace names in containers if the first prompt is empty', async () => {
    document.body.innerHTML = '';

    const fakeContainer1 = getFakeContainer({ name: 'foo' });
    const fakeContainer2 = getFakeContainer({ name: 'bar' });
    const containers = [fakeContainer1, fakeContainer2];

    (showPrompt as jest.Mock).mockImplementationOnce(async () => '');
    (showPrompt as jest.Mock).mockImplementationOnce(async () => null);
    (showConfirm as jest.Mock).mockImplementationOnce(async () => true);

    await replaceInName(containers);

    expect(showPrompt).toHaveBeenCalledTimes(1);
    expect(showConfirm).toHaveBeenCalledTimes(0);
    expect(showPrompt).toHaveBeenNthCalledWith(
      1,
      `(1/3) What case-sensitive string in 2 container names would you like to search for?`,
      'Search String',
      '',
    );
    expect(updateContainer).toHaveBeenCalledTimes(0);
    expect(updateContainer).toHaveBeenCalledTimes(0);
    expect(help).toHaveBeenCalledTimes(0);
  });
});
