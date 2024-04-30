import type { CustomFont } from 'src/types';
export declare const getFontName: (font: string) => string;
interface CreateHtmlArgs {
    initialHtml?: string;
    placeholder: string;
    toolbar: string;
    clipboard?: string;
    keyboard?: string;
    libraries: 'local' | 'cdn';
    theme: 'snow' | 'bubble';
    editorId: string;
    autoSize?: boolean;
    containerId: string;
    color: string;
    backgroundColor: string;
    placeholderColor: string;
    customStyles: string[];
    fonts: Array<CustomFont>;
    defaultFontFamily?: string;
    customJS?: string;
}
export declare const createHtml: (args?: CreateHtmlArgs) => string;
export {};
