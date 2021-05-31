export interface Coords {
    x: number;
    y: number;
}

export interface Sizes {
    width: number;
    height: number;
}

export interface GameStartProc {
    (prompt: string, sizes: Sizes): void
}

export interface ColorList {
    [index: number]: string;
    length: number
}