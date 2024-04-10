export class Message {
    private _id: number;
    private _parentMessageId: number | null;
    private _body: string;
    private _author: string;
    private _date: Date;
    private _lastEditTime: Date;
    private _channelId: number;
    private _attachment: File | null;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get parentMessageId(): number | null {
        return this._parentMessageId;
    }

    set parentMessageId(value: number | null) {
        this._parentMessageId = value;
    }

    get body(): string {
        return this._body;
    }

    set body(value: string) {
        this._body = value;
    }

    get author(): string {
        return this._author;
    }

    set author(value: string) {
        this._author = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get lastEditTime(): Date {
        return this._lastEditTime;
    }

    set lastEditTime(value: Date) {
        this._lastEditTime = value;
    }

    get channelId(): number {
        return this._channelId;
    }

    set channelId(value: number) {
        this._channelId = value;
    }

    get attachment(): File | null {
        return this._attachment;
    }

    set attachment(value: File | null) {
        this._attachment = value;
    }
}
