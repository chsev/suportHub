import { Component, Inject } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from "@angular/fire/compat/storage";
import { UntypedFormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Doc } from "src/app/shared/models/doc.model";
import { DocService } from "../../services/doc.service";


@Component({
  selector: 'app-uploaddoc-system',
  templateUrl: './uploadDoc-system.component.html',
})
export class UploadDocSystemComponent {
  myFile: File | undefined;
  fileName = '';
  fileVersion = new UntypedFormControl("1.0", [
    Validators.required,
    Validators.pattern("^[a-zA-Z0-9 _().\-]*$")
  ]);
  uploadProgress: number | undefined;
  uploadTask: AngularFireUploadTask | undefined;
  uploadComplete = false;
  companyId!: string;
  systemId!: string;


  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private docService: DocService
  ) { }


  ngOnInit(): void {
    this.companyId = this.passedData.companyId;
    this.systemId = this.passedData.systemId;
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
      let newGroupId = this.db.createId();
      let ver: string = this.fileVersion.value;
      const filePath = this.toFilePath(this.companyId, this.systemId, newDocId, this.fileName);
      console.log(filePath); //for debuging
      const fileRef = this.storage.ref(filePath);
      this.uploadTask = this.storage.upload(filePath, this.myFile);

      //get updates on upload percentage:
      this.uploadTask.percentageChanges().subscribe(
        percentageValue => this.uploadProgress = percentageValue,
        (error) => { } //unsuccessful upload: do nothing with percentage
      );

      this.uploadTask.snapshotChanges().subscribe(
        () => { },
        (error) => {
          console.log("Unsuccessful Upload:")
          console.log(error);
          this.resetUpload();
        },
        () => { //on successful upload:
          this.onSuccessfulUpload(fileRef, newDocId, newGroupId, ver);
        }
      );
    }
  }


  private toFilePath(companyId: string, systemId: string, docId: string, fileName: string) {
    return ['companies', companyId, 'systems', systemId, 'docs', docId, fileName].join('/');
  }


  private onSuccessfulUpload(fileRef: AngularFireStorageReference, newDocId: string, newGroupId: string, ver: string) {
    this.uploadComplete = true;

    // Get metadata properties:
    fileRef.getMetadata().subscribe(
      (metadata) => {
        console.log(metadata); //for debuging
        let newDoc: Doc = {
          docGroupId: newGroupId,
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
      (error) => console.log(error)
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
    this.fileVersion.setValue("1.0");
  }
}