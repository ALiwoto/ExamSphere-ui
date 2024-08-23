

export function getFieldOf(obj: any, fieldName: string): any {
    return obj[fieldName] ?? undefined;
}
