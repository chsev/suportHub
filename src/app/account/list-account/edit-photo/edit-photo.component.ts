import { Component, Inject } from "@angular/core";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/compat/storage";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AccountService } from "../../services/account.service";

@Component({
    selector: 'app-edit-photo',
    templateUrl: './edit-photo.component.html',
})
export class EditPhotoComponent {
    myFile: File | undefined;
    imageSrc: any | undefined;
    saveBtnDisabled = false;
    cancelBtnDisabled = false;
    sizeError = false;
    uploadTask: AngularFireUploadTask | undefined;
    uploadProgress: number | undefined;


    constructor(
        @Inject(MAT_DIALOG_DATA) public passedData: any,
        public dialogRef: MatDialogRef<EditPhotoComponent>,
        private storage: AngularFireStorage,
        private accountService: AccountService,
    ) { }


    onFileSelected(event: any) {
        const selectedFile: File = event.target.files[0];
        let reader = new FileReader();

        if (selectedFile) {
            reader.onload = (event) => { this.imageSrc = event.target!.result };
            this.myFile = selectedFile;
            //   this.fileName = selectedFile.name;
            reader.readAsDataURL(selectedFile);
            this.validateImage();
        }
    }

    validateImage(){
        if(this.myFile && this.myFile.size > (1024*1024*2)){
            this.saveBtnDisabled = true;
            this.sizeError = true;
        }
        if(this.myFile && this.myFile.size <= (1024*1024*2)){
            this.saveBtnDisabled = false;
            this.sizeError = false;
        }
    }


    onClose() {
        this.dialogRef.close();
    }


    onSave() {
        if (this.myFile) {
            this.saveBtnDisabled = true;
            this.cancelBtnDisabled = true;
            let fileName = this.myFile.name;
            let uid = this.passedData.profile.id;
            let filePath =  `users/${uid}/profile/${fileName}`;
            this.uploadTask = this.storage.upload(filePath, this.myFile);

            //get updates on upload percentage:
            this.uploadTask.percentageChanges()
                .subscribe({
                    next: percentageValue => this.uploadProgress = percentageValue,
                    error: () => { } //unsuccessful upload: do nothing with percentage
                });

            this.uploadTask.snapshotChanges().subscribe({
                error: (error) => {
                    console.log("Unsuccessful Upload:")
                    console.log(error);
                    this.onClose();
                },
                complete: () => { //on successful upload:
                    this.onSuccessfulUpload(fileName);
                }
            });
            return;
        }
        this.onClose();
    }


    useNone(){
        if(this.passedData.profile.profileImg){
            let uid = this.passedData.profile.id;
            let fileName = this.passedData.profile.profileImg;
            let filePath =  `users/${uid}/profile/${fileName}`;
            const fileRef = this.storage.ref(filePath);
            fileRef.delete();
            this.accountService.updateProfileImg(this.passedData.profile.id, undefined);
        }
        this.onClose();
    }


    private onSuccessfulUpload(filename: string) {
        this.accountService.updateProfileImg(this.passedData.profile.id, filename);
        this.onClose();
    }


}