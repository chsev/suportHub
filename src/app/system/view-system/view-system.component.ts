import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UiService } from 'src/app/shared/services/ui.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SystemService } from '../services/system.service';
import { System } from 'src/app/shared/models/system.model';
import { Doc } from 'src/app/shared/models/doc.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UploadDocSystemComponent } from './uploadDoc-system/uploadDoc-system.component';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { groupByToMap, humanFileSize } from 'src/app/shared/utils/functions';
import { DocService } from '../services/doc.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadVersionSystemComponent } from './uploadVersion-system/uploadVersion-system.component';
import { DocGroup } from 'src/app/shared/models/docGroup.model';
import { User } from 'src/app/shared/models/user.model';
import { Team } from 'src/app/shared/models/team.model';
import { TeamService } from 'src/app/team/services/team.service';
import { ConfirmExclusionSystemComponent } from './confirm-exclusion-system/confirm-exclusion-system.component';


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
  user: User | undefined;
  system: System | undefined;
  team: Team | undefined;
  documents: Doc[] = [];
  private loadingSub: Subscription | undefined;
  private systemSub: Subscription | undefined;
  isLoading = false;
  userIsAdmin = true;

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
    private teamService: TeamService,
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
      .getSystem(state.companyId, state.systemId).subscribe(
        (sysDoc: System) => {
          this.system = sysDoc;
          this.getDocumentsData();
          this.getTeam(sysDoc.companyId, sysDoc.teamId);
        });
  }


  ngAfterViewInit(): void {
    this.dataSourceDocs.sort = this.sort;
  }


  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
    this.systemSub?.unsubscribe();
  }


  private getDocumentsData(): void {
    if (!this.system)
      return;

    this.docService.fetchSystemDocuments(this.system.companyId!, this.system.id!)
      .subscribe((docsList) => {
        this.documents = docsList;
        this.groupDocuments();
      })
  }


  private getTeam(companyId: string, teamId: string) {
    this.teamService.fetchTeam(companyId, teamId)
      .subscribe(team => this.team = team);
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


  onNewDoc() {
    if (!this.system) return;

    this.dialog.open(UploadDocSystemComponent, {
      data: { companyId: this.system.companyId, systemId: this.system.id }
    });
  }


  onNewVersion(docId: string) {
    let doc = this.documents.find(d => d.id === docId);
    let curVer = this.docDataGrouped.find(g => g.id == doc?.docGroupId)?.docArray.map(d => d.version);
    if (doc && this.system) {
      this.dialog.open(UploadVersionSystemComponent, {
        data: { companyId: this.system.companyId, systemId: this.system.id, groupId: doc.docGroupId, currentVersions: curVer }
      });
    }
  }


  deleteVersion(docId: string) {
    let doc = this.documents.find(d => d.id === docId);

    if (!(doc && this.system))
      return;

    const filePath = this.toFilePath(this.system.companyId!, this.system.id!, doc.id!, doc.name!);
    const fileRef = this.storage.ref(filePath);
    this.docService.delete(this.system.companyId, this.system.id!, doc.id!)
      .then(() => fileRef.delete())
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


  onDelete() {
    const dialogRef: MatDialogRef<ConfirmExclusionSystemComponent> = this.dialog.open(ConfirmExclusionSystemComponent, {
      data: { system: this.system }
    });
    dialogRef.afterClosed().subscribe(answer => {
      if (answer && this.system) {
        this.systemService.delete(this.system.companyId, this.system.id!);
        this.router.navigate(['system']);
      }
    });
  }


  openDownloadURL(docId: string) {
    let doc = this.documents.find(d => d.id === docId);

    if (!(doc && this.system)) {
      return;
    }

    const filePath = this.toFilePath(this.system.companyId!, this.system.id!, doc.id!, doc.name!);
    const fileRef = this.storage.ref(filePath);
    fileRef.getDownloadURL()
      .subscribe(url => {
        if (url && window) {
          window.open(url, '_blank')!.focus();
        }
      })
  }

  
  canAddDoc(): boolean {
    return true;
  }


  toFilePath(companyId: string, systemId: string, docId: string, fileName: string) {
    return ['companies', companyId, 'systems', systemId, 'docs', docId, fileName].join('/');
  }


  isSystemAdmin(userId: string) {
    return true;
  }


  toDate(timestring: string) {
    return new Date(timestring).toLocaleString('pt-br');
  }


}



