import type { ColorListData, TextListData, ToggleData } from '../types';
export declare const getToolbarData: (options: Array<Array<string | object> | string | object>, customIcons?: Record<string, any> | undefined, defaultFontFamily?: string | undefined) => Array<Array<ToggleData | TextListData | ColorListData>>;
