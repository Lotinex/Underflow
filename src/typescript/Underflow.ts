
export default class _ {
    static loop<R>(number: number, action: (i: number) => R): R | undefined {
        let R;
        for(let i=0; i<number; i++){
            R = action(i);
            if(!R) break;
        }
        return R;
    }
    static go(...funcs: Function[]): <T>(init: T) => any {
        return (init) => {
            return funcs.reduce((res, func) => {
                return func(res);
            }, init)
        };
    }
    static arrayLoop<T, R>(array: T[], action: (element: T, i: number) => R): R | undefined {
        return _.loop(array.length, i => action(array[i], i));
    }
    static checkObjectValues(obj: {[key: string]: any}, value: any): boolean {
        let R = true;
        for(const key in obj){
            if(obj[key] !== value){
                R = false;
                break;
            }
        }
        return R;
    }
    static removeString(targetStr: string, value: string): string {
        return targetStr.replace(value, '');
    }
    static setValueInCases<T>(target: T, caseMap: Map<any, any>): any { 
        let R = null;
        for(const [k, v] of caseMap){
            if(k === target){
                if(v instanceof Function){
                    R = v(k);
                } else R = v;
                break;
            }
        }
        if(R === null && caseMap.has('<default>')){
            R = caseMap.get('<default>');
        }
        return R;
    }
    static transformString(string: string, transformActions: Array<(str: string) => string>): string[] {
        let R = [];
        for(const action of transformActions){
            R.push(action(string))
        }
        return R;
    }
    static switch<T>(value: T, cases: any[]): (funcs: Array<() => void>) => void {
        return (funcs) => {
            _.arrayLoop(cases, (caseValue, i) => {
                if(caseValue === value) return void funcs[i]();
            })
        }
    }
    static setDefaultValueInCases<T, V>(target: T, cases: any[], defaultValue: V): V {
        let R: V | undefined;
        _.arrayLoop(cases, (v, i) => {
            if(v === target){
                R = defaultValue;
                return false;
            }
        })
        return <V>R;
    }
    static validateUniqueValue(obj: {[key: string]: any}, expression: {[key: string]: any}): boolean {
        const counts = _.initValueWithProps(expression, 0);
        for(const key in expression){
            if(obj[key]){
                if(Object.is(obj[key], expression[key])){
                    counts[key]++;
                }
            } else {
                return false;
            }
        }
        let R = true;
        for(const key in counts){
            if(counts[key] > 1){
                R = false;
                break;
            }
        }
        return R;
    }
    static validate(obj: {[key: string]: any}, expression: {[key: string]: any}): boolean {
        const success = _.initValueWithProps(expression, false);
        for(const key in expression){
            if(obj[key]){
                if(Object.is(obj[key], expression[key])){
                    success[key] = true;
                }
            } else {
                return false;
            }
        }
        let R = true;
        for(const key in success){
            if(!success[key]){
                R = false;
                break;
            }
        }
        return R;
    }
    static initValueWithProps<T>(source: {[key: string]: any}, value: T): {[key: string]: T} {
        const R: {[key: string]: T} = {};
        for(const key in source) R[key] = value;
        return R;
    }
    static getPxNumber(pxText: string): number {
        return Number(pxText.replace('px', ''));
    }
    static inverseKeyDefine(obj: {[key: string]: any}, keys: string[]): {[key: string]: any} {
        let R = obj;
        if(keys === undefined){
            for(const key in R){
                R[R[key]] = key;
            }
        } else {
            for(const key of keys){
                if(R.hasOwnProperty(key)){
                    R[R[key]] = key;
                }
            }
        }
        return R;
    }
    static createFrameLoop(action: () => void): () => void {
        const func = () => {
            action()
            requestAnimationFrame(func)
        }
        requestAnimationFrame(func)
        return func;
    }
}

