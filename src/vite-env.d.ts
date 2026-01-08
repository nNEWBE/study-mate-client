/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APIKEY: string;
    readonly VITE_AUTHDOMAIN: string;
    readonly VITE_PROJECTID: string;
    readonly VITE_STORAGEBUCKET: string;
    readonly VITE_MESSAGINGSENDERID: string;
    readonly VITE_APPID: string;
    readonly VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare namespace JSX {
    interface IntrinsicElements {
        "box-icon": any;
    }
}
