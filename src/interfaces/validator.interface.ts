export interface ValidatorField<T> {
    key: keyof T;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validator?: (value: any) => string | null;
    required?: boolean;
}