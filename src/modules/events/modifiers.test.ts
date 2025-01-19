import { getModifiers } from './modifiers';

describe('getModifiers', () => {
  interface Test {
    name: string;
    event?: MouseEvent | KeyboardEvent;
    expected: [boolean, boolean];
  }

  const eventCtrlShift: Partial<KeyboardEvent> = {
    getModifierState: (keyArg: string) => {
      switch (keyArg) {
        case 'Control':
        case 'Shift':
          return true;
        default:
          return false;
      }
    },
  };

  const eventCtrl: Partial<KeyboardEvent> = {
    getModifierState: (keyArg: string) => {
      switch (keyArg) {
        case 'Control':
          return true;
        default:
          return false;
      }
    },
  };

  const eventMeta: Partial<KeyboardEvent> = {
    getModifierState: (keyArg: string) => {
      switch (keyArg) {
        case 'Meta':
          return true;
        default:
          return false;
      }
    },
  };

  const tests: Test[] = [
    {
      name: 'indicates if ctrl+shift are pressed',
      event: eventCtrlShift as KeyboardEvent,
      expected: [true, true],
    },
    {
      name: 'indicates if ctrl only is pressed',
      event: eventCtrl as KeyboardEvent,
      expected: [true, false],
    },
    {
      name: 'indicates if meta is pressed',
      event: eventMeta as KeyboardEvent,
      expected: [true, false],
    },
    {
      name: 'indicates if no event is pressed',
      expected: [false, false],
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = getModifiers(test.event);
      expect(actual).toStrictEqual(test.expected);
    }),
  );
});
