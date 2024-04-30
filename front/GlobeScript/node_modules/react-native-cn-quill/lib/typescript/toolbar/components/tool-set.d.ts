import React from 'react';
import type { ColorListData, TextListData, ToggleData } from '../../types';
interface Props {
    tools: Array<ToggleData | TextListData | ColorListData>;
}
export declare const ToolSet: React.FC<Props>;
export {};
