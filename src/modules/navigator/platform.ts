// https://stackoverflow.com/a/11752084
export const getPlatformModifierKey = () => (navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Cmd' : 'Ctrl');
