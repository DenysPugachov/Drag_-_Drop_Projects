namespace App {
  //Validation
  interface Validatable {
    value: string | number
    required?: boolean
    minLengthString?: number
    maxLengthString?: number
    minNumber?: number
    maxNumber?: number
  }

  export function validateUserInput(validatableInput: Validatable) {
    let isValid = true

    if (validatableInput.required) {
      isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }
    // "value != null" => null && undefined
    if (validatableInput.minLengthString != null &&
      typeof validatableInput.value === "string") {
      isValid = isValid &&
        validatableInput.value.length >= validatableInput.minLengthString
    }

    if (validatableInput.maxLengthString != null &&
      typeof validatableInput.value === "string") {
      isValid = isValid &&
        validatableInput.value.length <= validatableInput.maxLengthString
    }

    if (validatableInput.minNumber != null &&
      typeof validatableInput.minNumber === "number") {
      isValid = isValid &&
        validatableInput.value >= validatableInput.minNumber
    }

    if (validatableInput.maxNumber != null &&
      typeof validatableInput.maxNumber === "number") {
      isValid = isValid &&
        validatableInput.value <= validatableInput.maxNumber
    }

    return isValid
  }

}