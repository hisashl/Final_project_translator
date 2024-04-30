import * as React from 'react';
import { WebViewProps } from 'react-native-webview';
import { StyleProp, ViewStyle } from 'react-native';
import type { CustomFont, GetLeafResponse, QuillConfig } from '../types';
import type { EditorEventHandler, EditorEventType, SelectionChangeData, EditorChangeData, TextChangeData, HtmlChangeData, DimensionsChangeData, Range } from '../constants/editor-event';
export interface EditorState {
    webviewContent: string | null;
    height?: number;
}
export interface EditorProps {
    autoSize?: boolean;
    style?: StyleProp<ViewStyle>;
    quill?: QuillConfig;
    customFonts?: Array<CustomFont>;
    defaultFontFamily?: string;
    initialHtml?: string;
    customStyles?: string[];
    import3rdParties?: 'local' | 'cdn';
    containerId?: string;
    theme?: {
        background: string;
        color: string;
        placeholder: string;
    };
    loading?: string | React.ReactNode;
    container?: boolean | React.ComponentType;
    onSelectionChange?: (data: SelectionChangeData) => void;
    onTextChange?: (data: TextChangeData) => void;
    onHtmlChange?: (data: HtmlChangeData) => void;
    onEditorChange?: (data: EditorChangeData) => void;
    onDimensionsChange?: (data: DimensionsChangeData) => void;
    webview?: WebViewProps;
    onBlur?: () => void;
    onFocus?: () => void;
    customJS?: string;
}
export default class QuillEditor extends React.Component<EditorProps, EditorState> {
    private _webview;
    private _handlers;
    private _promises;
    constructor(props: EditorProps);
    private getInitalHtml;
    private getKey;
    private postAwait;
    private post;
    private toMessage;
    private onMessage;
    blur: () => void;
    focus: () => void;
    hasFocus: () => Promise<boolean>;
    enable: (enable?: boolean) => void;
    disable: () => void;
    update: () => void;
    format: (name: string, value: any) => void;
    deleteText: (index: number, length: number) => void;
    removeFormat: (index: number, length: number) => Promise<unknown>;
    getDimensions: () => Promise<any>;
    getContents: (index?: number | undefined, length?: number | undefined) => Promise<any>;
    getHtml: () => Promise<string>;
    getLength: () => Promise<number>;
    getText: (index?: number | undefined, length?: number | undefined) => Promise<string>;
    getBounds: (index: number, length?: number | undefined) => Promise<{
        left: number;
        top: number;
        height: number;
        width: number;
    }>;
    getSelection: (focus?: boolean) => Promise<Range>;
    setSelection: (index: number, length?: number | undefined, source?: String | undefined) => void;
    insertEmbed: (index: number, type: string, value: any) => void;
    insertText: (index: number, text: string, formats?: Record<string, any> | undefined) => void;
    setContents: (delta: any) => Promise<any>;
    setText: (text: string) => void;
    setPlaceholder: (text: string) => void;
    updateContents: (delta: any) => void;
    getFormat: (index: number | {
        index: number;
        length: number;
    }, length?: number | undefined) => Promise<Record<string, unknown>>;
    getLeaf: (index: number) => Promise<GetLeafResponse | null>;
    formatText: (index: number, length: number, formats: Record<string, unknown>, source?: string) => Promise<any>;
    on: (event: EditorEventType, handler: EditorEventHandler) => void;
    off: (event: EditorEventType, handler: Function) => void;
    dangerouslyPasteHTML: (index: number, html: string) => void;
    renderWebview: (content: string, style: StyleProp<ViewStyle>, props?: WebViewProps) => JSX.Element;
    render(): JSX.Element;
}
