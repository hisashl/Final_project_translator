declare const fullOptions: (string[] | {
    size: (string | boolean)[];
}[] | {
    header: number;
}[] | {
    list: string;
}[] | {
    script: string;
}[] | {
    indent: string;
}[] | {
    direction: string;
}[] | {
    header: (number | boolean)[];
}[] | ({
    color: never[];
    background?: undefined;
} | {
    background: never[];
    color?: undefined;
})[] | {
    font: never[];
}[] | {
    align: never[];
}[])[];
declare const basicOptions: (string[] | {
    header: number;
}[] | {
    list: string;
}[] | {
    align: never[];
}[])[];
export { fullOptions, basicOptions };
