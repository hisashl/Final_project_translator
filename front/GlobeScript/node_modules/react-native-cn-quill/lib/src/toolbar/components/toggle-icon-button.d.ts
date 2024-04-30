import React from 'react';
import { ImageSourcePropType } from 'react-native';
interface Props {
    name: string;
    valueOn: string | number | boolean;
    valueOff: string | number | boolean;
    source: ImageSourcePropType;
}
export declare const ToggleIconButton: React.FC<Props>;
export {};
