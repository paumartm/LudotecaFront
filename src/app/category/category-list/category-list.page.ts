import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../model/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryEdit } from '../category-edit/category-edit';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule,
        MatDialogModule
    ],
    templateUrl: './category-list.page.html',
    styleUrl: './category-list.page.scss'
})
export class CategoryListPage implements OnInit{

    protected readonly categoryService = inject(CategoryService);
    protected readonly dialog = inject(MatDialog);

    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['id', 'name', 'action'];
    
    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.categoryService.getCategories().subscribe(
            categories => this.dataSource.data = categories
        );
    }

    createCategory() {    
    const dialogRef = this.dialog.open(CategoryEdit, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadData();
    });    
  }  

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEdit, {
        data: { category }
    });
  

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.loadData();
    });  

}
}




