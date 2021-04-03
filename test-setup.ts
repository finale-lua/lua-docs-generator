// eslint-disable-next-line import/no-default-export -- I think this needs to be a default export
export default function setup(): Promise<true> {
    process.env.TZ = 'UTC'
    return Promise.resolve(true)
}
