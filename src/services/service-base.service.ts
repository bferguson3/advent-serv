export abstract class ServiceBase {
    public static getEnumKeyByEnumValue<T>(myEnum, enumValue: any): T {
        if (enumValue === undefined || enumValue === null) {
            return null;
        }

        const keys = Object.keys(myEnum).filter(
            (x) => myEnum[x] === enumValue
        );

        return keys.length > 0
            ? keys[0] as unknown as T
            : null;
    }
}
