import { getPlatformModifierKey } from './platform';

describe('getPlatformModifierKey', () => {
  it('gets the platform modifier key', () => {
    // TODO: expand these tests with proper mocks
    // const navigatorOriginal = window.navigator.platform;
    expect(getPlatformModifierKey()).toBe('Ctrl');
    // //@ts-expect-error global mock
    // window.navigator.platform = 'Mac';
    // expect(getPlatformModifierKey()).toBe('Cmd');
    // //@ts-expect-error global mock
    // window.navigator.platform = navigatorOriginal;
    // expect(getPlatformModifierKey()).toBe('Ctrl');
  });
});
