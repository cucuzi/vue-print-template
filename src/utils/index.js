/**
 * 返回文件的base64
 * @param file
 * @returns {Promise<String>}
 */
export function readFileBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsDataURL(file)
    })
}

/**
 * 将base64转blob
 * @param base64
 * @returns {Blob}
 */
export function base64toBlob(base64) {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type: mime})
}

/**
 * 拷贝对象
 * @param source 源对象
 * @param filterNull 是否过滤null值
 * @returns {*[]}
 */
export function deepClone(source, filterNull = false) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        const value = source[keys]
        if (value && typeof value === 'object') {
            targetObj[keys] = deepClone(value)
        } else {
            if (filterNull && value == null) {
                return
            }
            targetObj[keys] = value
        }
    })
    return targetObj
}
