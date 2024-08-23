


export function getTextInputTypeFromFieldName(fieldName: string): React.HTMLInputTypeAttribute {
    if (fieldName.toLowerCase().includes("password")) {
        return "password";
    }

    if (fieldName.toLowerCase().includes("email")) {
        return "email";
    }

    if (fieldName.toLowerCase().includes("phone")) {
        return "tel";
    }

    return "text";
}
