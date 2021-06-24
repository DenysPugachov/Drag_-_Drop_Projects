export function validateUserInput(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLengthString != null &&
        typeof validatableInput.value === "string") {
        isValid = isValid &&
            validatableInput.value.length >= validatableInput.minLengthString;
    }
    if (validatableInput.maxLengthString != null &&
        typeof validatableInput.value === "string") {
        isValid = isValid &&
            validatableInput.value.length <= validatableInput.maxLengthString;
    }
    if (validatableInput.minNumber != null &&
        typeof validatableInput.minNumber === "number") {
        isValid = isValid &&
            validatableInput.value >= validatableInput.minNumber;
    }
    if (validatableInput.maxNumber != null &&
        typeof validatableInput.maxNumber === "number") {
        isValid = isValid &&
            validatableInput.value <= validatableInput.maxNumber;
    }
    return isValid;
}
//# sourceMappingURL=validation.js.map