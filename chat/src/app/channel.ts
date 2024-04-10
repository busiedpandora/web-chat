export class Channel {
    private _id : number;
    private _name : string;
    private _selected : boolean;

    get id(): number {
        return this._id;
    }

    // Setter for id
    set id(value: number) {
        this._id = value;
    }

    // Getter for name
    get name(): string {
        return this._name;
    }

    // Setter for name
    set name(value: string) {
        this._name = value;
    }

    // Getter for selected
    get selected(): boolean {
        return this._selected;
    }

    // Setter for selected
    set selected(value: boolean) {
        this._selected = value;
    }
}
