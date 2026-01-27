export {}
declare global {
    type GC = import('vue').GlobalComponents
    type Icon = import('vue').DefineComponent<object>
    declare module '~vic/*' {
        const component: Icon
        export default component
    }
}
