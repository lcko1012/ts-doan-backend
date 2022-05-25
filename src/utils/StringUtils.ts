export default class StringUtils {
    public static createSlug(str: string): string { 
        return str.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace("đ", "d")
                .replace(/(?!-)\W/g, "-")
                .replace(/^-*|-*$/g, "")
                .replace(/-{2,}/g, "-");
    }

    private static randomInt(min: number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}