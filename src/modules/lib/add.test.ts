import { createContainer } from '../browser/containers';
import { showAlert } from '../modals/modals';
import { deselect } from './deselect';
import { filter } from './filter';
import { help } from '../help';
import { add } from './add';
import { Container, ContainerCreate } from '../../types';

jest.mock('./filter', () => ({
  filter: jest.fn().mockImplementation(async () => {}),
}));

jest.mock('./deselect', () => ({
  deselect: jest.fn().mockImplementation(async () => {}),
}));

jest.mock('../help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

jest.mock('../modals/modals', () => ({
  showAlert: jest.fn().mockImplementation(async () => {}),
}));

// must be hoisted so that it can be used in the mock, and so it must not be an arrow function
async function mockedCreateContainer(fields: ContainerCreate): Promise<Container> {
  return {
    iconUrl: 'foo',
    cookieStoreId: 'foo',
    colorCode: 'foo',
    ...fields,
  };
}

jest.mock('../browser/containers', () => ({
  createContainer: jest.fn().mockImplementation(mockedCreateContainer),
}));

describe('add', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('adds a container', async () => {
    document.body.innerHTML = '<input id="searchContainerInput" value="foo"/>';

    await add();

    expect(createContainer).toHaveBeenCalledTimes(1);
    expect(createContainer).toHaveBeenCalledWith({
      color: 'toolbar',
      icon: 'circle',
      name: 'foo',
    });
    expect(filter).toHaveBeenCalledTimes(1);
    expect(filter).toHaveBeenCalledWith();
    expect(help).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenCalledWith(`Added a container named foo`);
    expect(deselect).toHaveBeenCalledTimes(1);
    expect(deselect).toHaveBeenCalledWith();
  });

  it('fails to add a container because the element value is empty', async () => {
    document.body.innerHTML = '<input id="incorrectInputId" value=""/>';

    await add();

    expect(showAlert).toHaveBeenCalledTimes(1);
    expect(showAlert).toHaveBeenCalledWith(
      'You must specify a valid container name in the input field.',
      'Invalid Name Provided',
    );
    expect(createContainer).toHaveBeenCalledTimes(0);
    expect(filter).toHaveBeenCalledTimes(0);
    expect(help).toHaveBeenCalledTimes(0);
    expect(deselect).toHaveBeenCalledTimes(0);
  });
});
