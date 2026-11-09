import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/game";

export interface Loan {
    id: number;
    game: Game;
    client: Client;
    loanDate: Date;
    returnDate: Date;
}
