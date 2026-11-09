import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan-service';
import { Loan } from '../model/Loan';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { validateFields } from '../../core/helpers/validation.helper';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/Client';
import { GameService } from '../../game/game-service';
import { Game } from '../../game/model/game';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-loan-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule ],
    templateUrl: './loan-edit.html',
    styleUrl: './loan-edit.scss',
})
export class LoanEdit implements OnInit {
    protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
    protected readonly data = inject(MAT_DIALOG_DATA);
    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);
    protected readonly loanService = inject(LoanService);

    protected readonly id = signal<number | null>(null);
    protected readonly clientId = signal<number | null>(null);
    protected readonly gameId = signal<number | null>(null);
    protected readonly loanDate = signal<Date | null>(null);
    protected readonly returnDate = signal<Date | null>(null);

    protected readonly clients = signal<Client[]>([]);
    protected readonly games = signal<Game[]>([]);

    loadFormData(initialData: Loan | null) {
        this.id.set(initialData?.id ?? null);
        this.clientId.set(initialData?.client?.id ?? null);
        this.gameId.set(initialData?.game?.id ?? null);
        this.loanDate.set(initialData?.loanDate ?? null);
        this.returnDate.set(initialData?.returnDate ?? null);

        this.clientService.getClients().subscribe((clients) => {
            this.clients.set(clients);
        });

        this.gameService.getGames().subscribe((games) => {
            this.games.set(games);
        });
    }

    ngOnInit(): void {
        this.loadFormData(this.data.loan ?? null);
    }

    onSave() {
        const id = this.id();
        const clientId = this.clientId();
        const gameId = this.gameId();
        const loanDate = this.loanDate();
        const returnDate = this.returnDate();

        const requiredFields = ["gameId", "clientId", "loanDate", "returnDate"] as const
        const data = { gameId, clientId, loanDate, returnDate }

        if (!validateFields(data, requiredFields)) {
            return;
        }

        const loan = {
            id,
            game: this.games().find(g => g.id === gameId) ?? null,
            client: this.clients().find(c => c.id === clientId) ?? null,
            loanDate,
            returnDate
        } as Loan;
        this.loanService.saveLoan(loan).subscribe(() => {
            this.dialogRef.close(true);
        });
    }
    

    onClose() {
        this.dialogRef.close(false);
    }
}
