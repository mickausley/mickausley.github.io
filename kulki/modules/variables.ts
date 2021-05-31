import { Sizes, ColorList } from './interfaces'

export class Variables {
    static sizes: Sizes = { width: 9, height: 9 };
    static colors: ColorList = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "black",
    ];
    static arr: number[][] = [];
    static startField: HTMLElement;
    static metaField: HTMLDivElement;
    static propagationValue: number = 1;
    static toCheck: HTMLDivElement[] = [];
    static path: HTMLDivElement[] = [];
    static ballToMove: HTMLDivElement
    static nextBalls: HTMLDivElement[] = [];
    static points: number = 0
}


export class Flags {
    static flagStart: boolean = true;
    static foundMeta: boolean = false;
    static gameEnded: boolean = false
}