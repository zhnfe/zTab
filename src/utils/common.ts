/**
 * 扁平化数组对象
 * @param array - 原数组
 * @param childrenKey - 子数组的键名
 * @returns 扁平化后的数组
 */
export function flatArrayObject<T extends Record<string, unknown>>(array: T[], childrenKey = 'children' as keyof T): Omit<T, typeof childrenKey>[] {
    const result: T[] = []

    const flat = (items: T[]): void => {
        for (const item of items) {
            const { [childrenKey]: children, ...rest } = item
            result.push(rest as T)
            if (Array.isArray(children)) {
                flat(children)
            }
        }
    }

    flat(array)
    return result
}

interface KeyOption {
    label: string
    value: unknown
    key: string
}
type KeyValueOptionMap<T extends KeyOption[]> = {
    [Item in T[number] as Item['key']]: Item['value']
}

class MakeOptions<const T extends KeyOption[]> {
    options!: T
    constructor(options: T) {
        Object.defineProperty(this, 'options', {
            value: options,
            enumerable: false
        })
        for (const { key, value } of options) {
            (this as any)[key] = value
        }
    }

    getLabel(value: T[number]['value'] | T[number]['key'] | (unknown & {})): T[number]['label'] | undefined {
        return this.options.find(i => i.value === value || i.key === value)?.label
    }

    getLabelByKey<K extends T[number]['key']>(key: K): Extract<T[number], { key: K }>['label'] {
        return this.options.find(i => i.key === key)?.label as any
    }

    getLabelByValue<V extends T[number]['value']>(value: V): Extract<T[number], { value: V }>['label'] {
        return this.options.find(i => i.value === value)?.label as any
    }
}

/**
 * 有枚举效果的 options
 * @example
 * const someOptions = makeOptions([
 *     { label: '男', value: 1, key: 'male' },
 *     { label: '女', value: 0, key: 'female' }
 * ]);
 * someOptions.male; // 1
 * someOptions.getLabel('male'); // '男'
 * someOptions.getLabelByKey('female'); // '女'
 * someOptions.getLabelByValue(someOptions.male); // '男'
 * someOptions.options; // 原始数组
 */
export function makeOptions<const T extends KeyOption[]>(options: T) {
    return new MakeOptions(options) as MakeOptions<T> & KeyValueOptionMap<T>
}
