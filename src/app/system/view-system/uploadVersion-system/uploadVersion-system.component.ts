import { Component, Inject } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from "@angular/fire/compat/storage";
import { AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Doc } from "src/app/shared/models/doc.model";
import { UiService } from "src/app/shared/services/ui.service";
import { DocService } from "../../services/doc.service";


@Component({
  selector: 'app-uploadversion-system',
  templateUrl: './uploadVersion-system.component.html',
})
export class UploadVersionSystemComponent {
  myFile: File | undefined;
  fileName = '';
  fileVersion = new UntypedFormControl("1.1");
  uploadProgress: number | undefined;
  uploadTask: AngularFireUploadTask | undefined;
  uploadComplete = false;
  companyId!: string;
  systemId!: string;
  groupId!: string;


  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private docService: DocService,
    private uiService: UiService
  ) { }


  ngOnInit(): void {
    this.companyId = this.passedData.companyId;
    this.systemId = this.passedData.systemId;
    this.groupId = this.passedData.groupId;
    let currentVersions = this.passedData.currentVersions;

    this.fileVersion = new UntypedFormControl("", [
      Validators.required,
      Validators.pattern("^[a-zA-Z0-9 _().\-]*$"),
      createUniqueVersionValidator(currentVersions)
    ]);
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.myFile = file;
      this.fileName = file.name;
    }
  }


  uploadFile() {
    if (this.myFile) {
      this.uploadProgress = 0; //immediately disables button
      let newDocId = this.db.createId();
      let ver: string = this.fileVersion.value;
      const filePath = this.toFilePath(this.companyId, this.systemId, newDocId, this.fileName);
      const fileRef = this.storage.ref(filePath);
      this.uploadTask = this.storage.upload(filePath, this.myFile);

      //get updates on upload percentage:
      this.uploadTask.percentageChanges().subscribe({
        next: percentageValue => this.uploadProgress = percentageValue,
        error: () => { } //unsuccessful upload: do nothing with percentage
      }
      );

      this.uploadTask.snapshotChanges().subscribe({
        error: (error) => {
          this.uiService.showSnackbar(error, undefined, 3000);
          this.resetUpload();
        },
        complete: () => { //on successful upload:
          this.onSuccessfulUpload(fileRef, newDocId, ver);
        }
      });
    }
  }


  private toFilePath(companyId: string, systemId: string, docId: string, fileName: string) {
    return ['companies', companyId, 'systems', systemId, 'docs', docId, fileName].join('/');
  }


  private onSuccessfulUpload(fileRef: AngularFireStorageReference, newDocId: string, ver: string) {
    this.uploadComplete = true;

    // Get metadata properties:
    fileRef.getMetadata().subscribe({
      next: (metadata) => {
        let newDoc: Doc = {
          docGroupId: this.groupId,
          version: ver,
          name: metadata.name,
          contentType: metadata.contentType,
          size: metadata.size,
          timeCreated: metadata.timeCreated,
          updated: metadata.updated
        };
        //update firestore:
        this.docService.insert(this.companyId, this.systemId, newDocId, newDoc);
      },
      error: (error) => this.uiService.showSnackbar(error, undefined, 3000)
    }
    );
  }


  cancelUpload() {
    this.uploadTask?.cancel();
    this.uploadProgress = undefined;
  }


  resetUpload() {
    this.uploadProgress = undefined;
    this.uploadComplete = false;
    this.uploadTask = undefined;
    this.myFile = undefined;
    this.fileName = '';
    this.fileVersion.setValue("1.1");
  }

}



export function createUniqueVersionValidator(currentVersion: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return currentVersion.includes(value) ? { uniqueVersion: true } : null;
  }
}