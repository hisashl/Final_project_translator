export declare type EditorEventType = 'format-change' | 'selection-change' | 'text-change' | 'editor-change' | 'html-change' | 'dimensions-change' | 'blur' | 'focus';
export interface SelectionChangeData {
    range: {
        index: number;
        length: number;
    } | null;
    oldRange: {
        index: number;
        length: number;
    } | null;
    source: string;
}
export interface TextChangeData {
    delta: any;
    oldDelta: any;
    source: string;
    html: string;
}
export interface HtmlChangeData {
    html: string;
}
export interface EditorChangeData {
    eventName: string;
    args: Array<any>;
}
export interface FormatChangeData {
    formats: any;
}
export interface DimensionsChangeData {
    width: number;
    height: number;
}
export declare type EditorChangeHandler = (data: EditorChangeData) => void;
export declare type TextChangeHandler = (data: TextChangeData) => void;
export declare type SelectionChangeHandler = (data: SelectionChangeData) => void;
export declare type FormatChangeHandler = (data: FormatChangeData) => void;
export declare type HtmlChangeHandler = (data: HtmlChangeData) => void;
export declare type DimensionsChangeHandler = (data: DimensionsChangeData) => void;
export declare type EditorEventHandler = EditorChangeHandler | TextChangeHandler | SelectionChangeHandler | FormatChangeHandler | HtmlChangeHandler | DimensionsChangeHandler;
export declare type Range = {
    index: number;
    length: number;
};
