import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client.service';
import { DialogConfirmation} from '../../core/dialog-confirmation/dialog-confirmation';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClientEdit } from '../client-edit/client-edit';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule,
        MatDialogModule
    ],
    templateUrl: './client-list.page.html',
    styleUrl: './client-list.page.scss'
})
export class ClientListPage implements OnInit{

    protected readonly clientService = inject(ClientService);
    protected readonly dialog = inject(MatDialog);

    dataSource = new MatTableDataSource<Client>();
    displayedColumns: string[] = ['id', 'name', 'action'];
    
    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.clientService.getClients().subscribe(
            clients => this.dataSource.data = clients
        );
    }

    createClient() {    
    const dialogRef = this.dialog.open(ClientEdit, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadData();
    });    
  }  

   editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEdit, {
        data: { client }
    });
  

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadData();
    });  

}

    deleteClient(client: Client) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: {
                title: 'Eliminar cliente',
                description:
                    'Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?',
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.clientService.deleteClient(client.id).subscribe((result) => {
                    this.ngOnInit();
                });
            }
        });
    }
}




