export default interface FontGenerator<T> {
  init(): Promise<void>
  generate(): Promise<T>
}
