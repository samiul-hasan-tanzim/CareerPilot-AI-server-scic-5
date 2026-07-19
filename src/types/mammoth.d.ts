declare module "mammoth" {
  interface ExtractRawTextResult {
    value: string;
    messages: unknown[];
  }

  interface Options {
    buffer?: Buffer;
    path?: string;
  }

  export function extractRawText(options: Options): Promise<ExtractRawTextResult>;
}
