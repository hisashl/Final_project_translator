import React, { Component } from 'react';
import { Animated } from 'react-native';
import type { CustomStyles, ToggleData, ToolbarCustom, ToolbarTheme } from '../../types';
export interface ContextProps {
    apply: (name: string, value: any) => void;
    selectedFormats: object;
    isSelected: (name: string, value: any) => boolean;
    theme: ToolbarTheme;
    show: (name: string, options: Array<ToggleData>) => void;
    hide: Function;
    open: boolean;
    options: Array<ToggleData>;
    selectionName: string;
    getSelected: (name: string) => any;
    styles?: CustomStyles;
}
export declare const ToolbarConsumer: React.Consumer<ContextProps>;
interface ProviderProps {
    format: Function;
    selectedFormats: Record<string, any>;
    theme: ToolbarTheme;
    custom?: ToolbarCustom;
    styles?: CustomStyles;
}
interface ProviderState {
    open: boolean;
    isAnimating: boolean;
    options: Array<ToggleData>;
    name: string;
}
export declare class ToolbarProvider extends Component<ProviderProps, ProviderState> {
    animatedValue: Animated.Value;
    constructor(props: ProviderProps);
    show: (name: string, options: Array<ToggleData>) => void;
    hide: () => void;
    componentDidMount(): void;
    isSelected: (name: string, value?: any) => boolean;
    getSelected: (name: string) => any;
    apply: (name: string, value: any) => void;
    render(): JSX.Element;
}
export declare const withToolbar: (MyComponent: any) => React.ForwardRefExoticComponent<React.RefAttributes<unknown>>;
export declare const useToolbar: () => ContextProps;
export {};
