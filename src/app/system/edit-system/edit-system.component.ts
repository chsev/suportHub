import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { System } from 'src/app/shared/models/system.model';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'app-edit-system',
  templateUrl: './edit-system.component.html',
  styleUrls: ['./edit-system.component.css']
})
export class EditSystemComponent implements OnInit {
  systemId!: string | null;
  system!: any;
  systemForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', { validators: [Validators.required] }),
    description: new UntypedFormControl(''),
  })

  constructor(
    private systemService: SystemService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.systemId = this.systemService.editingSystemId;

    if (!this.systemId) {
      this.onCancelOrExit();
    } else {
      this.systemService.editingSystemChanged
        .subscribe(payload => {
          this.system = payload as System;
          this.systemForm.setValue({
            name: payload.name,
            description: payload.description,
          })
        }
        );
      this.systemService.searchById(this.systemId)
    }
  }


  onSubmit() {
    this.systemService.update({ id: this.systemId, ...this.systemForm.value });
    this.router.navigate(["system/list"]);
  }


  onCancelOrExit() {
    this.router.navigate(["system/list"]);
  }


}
