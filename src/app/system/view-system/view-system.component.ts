import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UiService } from 'src/app/shared/services/ui.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SystemService } from '../services/system.service';
import { System } from 'src/app/shared/models/system.model';
import { Doc } from 'src/app/shared/models/doc.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
// import { updateDoc, serverTimestamp } from "firebase/firestore";
// import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UploadDocSystemComponent } from './uploadDoc-system/uploadDoc-system.component';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { groupByToMap, humanFileSize } from 'src/app/shared/utils/functions';
import { DocService } from '../services/doc.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadVersionSystemComponent } from './uploadVersion-system/uploadVersion-system.component';
import { DocGroup } from 'src/app/shared/models/docGroup.model';


@Component({
  selector: 'app-view-system',
  templateUrl: './view-system.component.html',
  styleUrls: ['./view-system.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewSystemComponent implements OnInit {
  system: System | undefined;
  documents: Doc[] = [];
  private loadingSub: Subscription | undefined;
  private systemSub: Subscription | undefined;
  isLoading = false;
  userIsAdmin = true;
  showSystemCardContent = false;

  docDataGrouped: DocGroup[] = [];
  dataSourceDocs = new MatTableDataSource<DocGroup>();
  columnsToDisplay: string[] = ['name', 'size', 'contentType', 'version', 'lastmodified', 'action'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: DocGroup | null = null;
  @ViewChild('docs_table') table: MatTable<DocGroup> | undefined;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(
    private location: Location,
    private systemService: SystemService,
    private docService: DocService,
    private uiService: UiService,
    private router: Router,
    private dialog: MatDialog,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    let state: any = this.location.getState();

    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.systemSub = this.systemService
      .fetchSystemDoc(state.companyId, state.systemId).subscribe(
        (data: System) => {
          this.system = data;
          this.getDocumentsData(this.system.docs? this.system.docs : [])
        });
  }

  private getDocumentsData(docsIds: string[]): void {
    this.docService.fetchAllDocumentsOfSystem(this.system?.companyId!, this.system?.id!)
    .subscribe((docsList)=>{
      this.documents = docsList;
      this.groupDocuments();
    })
  }


  private groupDocuments(): void {
    let groupedDocsMap = groupByToMap<Doc, string>(this.documents, d => d.docGroupId);
    
    this.docDataGrouped = [];
    groupedDocsMap.forEach((value, key, map) => {
      value.sort((a, b) => a.version!.localeCompare(b.version!)).reverse();
      this.docDataGrouped.push({
        id: key, displayedVersion: 0, docArray: value
      });
    });
    this.dataSourceDocs.data = this.docDataGrouped;
  }


  ngAfterViewInit(): void {
    this.dataSourceDocs.sort = this.sort;
  }


  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
    this.systemSub?.unsubscribe();
  }


  onNewDoc() {
    const dialogRef: MatDialogRef<UploadDocSystemComponent> = this.dialog.open(UploadDocSystemComponent, {
      data: { companyId: this.system?.companyId, systemId: this.system?.id }
    });
  }


  onNewVersion(docId: string){
    let doc = this.documents.find( d => d.id === docId );
    let curVer = this.docDataGrouped.find(g => g.id == doc?.docGroupId)?.docArray.map(d => d.version);
    console.log(curVer);
    const dialogRef: MatDialogRef<UploadVersionSystemComponent> = this.dialog.open(UploadVersionSystemComponent, {
      data: { companyId: this.system?.companyId, systemId: this.system?.id, groupId: doc?.docGroupId, currentVersions: curVer}
    });
  }


  humanFileSize(bytes: number) {
    return humanFileSize(bytes, true, 2);
  }


  onEdit() {
    if (this.system)
      this.router.navigate(['system/edit'], {
        state: { companyId: this.system.companyId, systemId: this.system.id }
      });
  }


  openDownloadURL( docId: string) {
    let doc = this.documents.find( d => d.id === docId );
    if(!doc){
      return;
    }
    const fileRef = this.storage.ref(this.toFilePath(this.system?.companyId!, this.system?.id!, doc.id!, doc.name!));
    let sub = fileRef.getDownloadURL()
      .subscribe(url => {
        if (url && window) {
          window.open(url, '_blank')!.focus();
        }
        sub?.unsubscribe();
      })
  }

  

  toFilePath(companyId: string, systemId: string, docId: string, fileName: string) {
    return ['companies', companyId, 'systems', systemId, 'docs', docId, fileName].join('/');
  }

  
}



