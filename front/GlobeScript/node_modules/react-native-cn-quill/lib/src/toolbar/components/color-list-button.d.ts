import React from 'react';
import { ImageSourcePropType } from 'react-native';
import type { ToggleData } from '../../types';
interface Props {
    name: string;
    source: ImageSourcePropType;
    items: Array<ToggleData>;
}
export declare const ColorListButton: React.FC<Props>;
export {};
