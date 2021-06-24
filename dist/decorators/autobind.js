export function BindThis(_target, _method, descriptor) {
    const adjDescriptor = {
        configurable: true,
        get() {
            return descriptor.value.bind(this);
        }
    };
    return adjDescriptor;
}
//# sourceMappingURL=autobind.js.map