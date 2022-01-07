import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loadingStateChanged = new Subject<boolean>();

  constructor(private _snackbar: MatSnackBar) { }

  showSnackbar(message: string, action: string | undefined, duration: number) {
    this._snackbar.open(message, action, { duration: duration })
  }
}
