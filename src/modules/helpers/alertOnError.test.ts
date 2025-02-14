import { alertOnError } from '../helpers';
import { showAlert } from '../modals/modals';

jest.mock('../modals/modals', () => ({
  showAlert: jest.fn().mockImplementation(async () => {}),
}));

describe('alertOnError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls the function successfully', async () => {
    let called = false;
    const actual = () => {
      called = true;
    };

    await alertOnError(actual)("this shouldn't be shown", 'test title');

    expect(called).toBe(true);
    expect(showAlert).toHaveBeenCalledTimes(0);
  });

  it('calls the function unsuccessfully', async () => {
    const thrownMessage = 'this should be shown';
    const actual = () => {
      throw thrownMessage;
    };

    const thrownTitle = 'throw title';

    await alertOnError(actual)('Something went wrong', thrownTitle);

    expect(showAlert).toHaveBeenNthCalledWith(1, `Something went wrong: ${thrownMessage}`, thrownTitle);
  });
});
