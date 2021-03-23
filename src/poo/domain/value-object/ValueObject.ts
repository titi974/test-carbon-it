export default interface ValueObject<value> {
    same(other: value): boolean
}
