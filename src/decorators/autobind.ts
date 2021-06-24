
//autobind decorator
export function BindThis(_target: any, _method: string, descriptor: PropertyDescriptor) {
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return descriptor.value.bind(this)
    }
  }
  return adjDescriptor
}
