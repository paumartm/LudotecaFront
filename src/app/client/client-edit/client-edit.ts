import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { Client } from '../model/Client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { validateFields } from '../../core/helpers/validation.helper';

@Component({
    selector: 'app-client-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './client-edit.html',
    styleUrl: './client-edit.scss',
})
export class ClientEdit implements OnInit {
    protected readonly clientService = inject(ClientService);
    protected readonly dialogRef = inject(MatDialogRef<ClientEdit>);
    protected readonly data = inject(MAT_DIALOG_DATA);

    protected readonly id = signal<number | null>(null);
    protected readonly name = signal<string | null>(null);

    loadFormData(initialData: Client | null) {
        this.id.set(initialData.id ?? null);
        this.name.set(initialData.name ?? null);
    }

    ngOnInit(): void {
        this.loadFormData(this.data.client ?? null);
    }

    onSave() {
        const id = this.id();
        const name = this.name();

        const requiredFields = ["name"] as const
        const data = { name }

        if (!validateFields(data, requiredFields)) {
            return;
        }

        const client = {
            id,
            name,
        } as Client;
        this.clientService.saveClient(client).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onClose() {
        this.dialogRef.close(false);
    }
}
