import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoanEdit } from '../loan-edit/loan-edit';
import { LoanService } from '../loan-service';
import { Loan } from '../model/Loan';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmation} from '../../core/dialog-confirmation/dialog-confirmation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Game } from '../../game/model/game';
import { GameService } from '../../game/game-service';
import { Client } from '../../client/model/Client';
import { ClientService } from '../../client/client.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';



@Component({
    selector: 'app-loan-list',
    standalone: true,
    imports: [
        MatButtonModule, 
        MatIconModule, 
        MatTableModule, 
        CommonModule, 
        MatPaginatorModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
     ],
    templateUrl: './loan-list.page.html',
    styleUrl: './loan-list.page.scss',
})
export class LoanListPage implements OnInit {

    protected readonly games = signal<Game[]>([]);
    protected readonly clients = signal<Client[]>([]);

    protected readonly filterGame = signal<Game | null>(null);
    protected readonly filterClient = signal<Client | null>(null);
    protected readonly filterDate = signal<Date | null>(null);

    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);

    protected readonly dialog = inject(MatDialog);
    protected readonly loanService = inject(LoanService);
    
    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'game', 'client','loanDate', 'returnDate', 'action'];


    ngOnInit(): void {
        this.gameService.getGames().subscribe((games) => this.games.set(games));

        this.clientService.getClients().subscribe((clients) => this.clients.set(clients));

            this.loadPage();
    }

    loadPage(event?: PageEvent) {
        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        };

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }

        const gameId = this.filterGame() != null ? this.filterGame()!.id : null;
        const clientId = this.filterClient() != null ? this.filterClient()!.id : null;
        const date = this.filterDate();

        this.loanService.getLoans(pageable, gameId, clientId, date).subscribe((data) => {
            this.dataSource.data = data.content;
            this.pageNumber = data.pageable.pageNumber;
            this.pageSize = data.pageable.pageSize;
            this.totalElements = data.totalElements;
        });
    }

    createLoan() {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    editLoan(loan: Loan) {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: { loan: loan },
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.ngOnInit();
        });
    }

    deleteLoan(loan: Loan) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: {
                title: 'Eliminar préstamo',
                description:
                    'Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loanService.deleteLoan(loan.id).subscribe((result) => {
                    this.ngOnInit();
                });
            }
        });
    }

    onCleanFilter(): void {
        this.filterGame.set(null);
        this.filterClient.set(null);
        this.filterDate.set(null);
        this.onSearch();
    }

    onSearch(): void {
        this.loadPage();
    }

}
