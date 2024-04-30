import React, { Component } from 'react';
import type { ToolbarTheme, TextListData, ToggleData, ColorListData, ToolbarCustom, CustomStyles } from '../types';
import type QuillEditor from '../editor/quill-editor';
interface QuillToolbarProps {
    options: Array<Array<string | object> | string | object> | 'full' | 'basic';
    styles?: CustomStyles;
    editor: React.RefObject<QuillEditor>;
    theme: ToolbarTheme | 'dark' | 'light';
    custom?: ToolbarCustom;
    container?: false | 'avoiding-view' | React.ComponentType;
}
interface ToolbarState {
    toolSets: Array<Array<ToggleData | TextListData | ColorListData>>;
    formats: object;
    theme: ToolbarTheme;
    defaultFontFamily?: string;
}
export declare class QuillToolbar extends Component<QuillToolbarProps, ToolbarState> {
    static defaultProps: {
        theme: string;
    };
    constructor(props: QuillToolbarProps);
    editor?: QuillEditor;
    componentDidMount(): void;
    componentDidUpdate(prevProps: QuillToolbarProps, prevState: ToolbarState): void;
    changeTheme(): void;
    private prepareIconset;
    private listenToEditor;
    private onFormatChange;
    private format;
    renderToolbar: () => JSX.Element;
    render(): JSX.Element;
}
export {};
