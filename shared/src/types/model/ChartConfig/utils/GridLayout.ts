export interface GridLayout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    static: boolean | null;
    minW: number | null;
    minH: number | null;
    maxW: number | null;
    maxH: number | null;
}

export const gridLayoutFactory = (chart_uuid: string): GridLayout => {
    return {
        i: chart_uuid,
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        static: false,
        minW: null,
        minH: null,
        maxW: null,
        maxH: null,
    };
}