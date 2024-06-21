export class CookieJar {
  private _cookies: Map<string, string>;

  constructor(cookieString: string | null) {
    this._cookies = new Map<string, string>();
    this.parse(cookieString || '');
  }

  private parse(cookieString: string) {
    const pairs = cookieString.split(';');
    for (const pair of pairs) {
      const [key, value] = pair.split('=').map(decodeURIComponent);
      this._cookies.set(key, value);
    }
  }

  get(key: string) {
    const value = this._cookies.get(key);
    if (!value) throw new Error('Cookie not found.');
    return value;
  }
}
