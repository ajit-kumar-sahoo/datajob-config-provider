import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet, NavigationExtras } from '@angular/router';
import { DOCUMENT, NgFor } from '@angular/common'; 
import { BrowserModule } from '@angular/platform-browser';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'datajob-config-provider';
  currentTab: number = 0;
  typeList: any = ["Database", "Kafka", "Filesystem"];
  tableList: any;
  columnList: any;

  protected jobname!: String;
  protected jobdesc!: String;
  protected vaulturl!: String;
  protected accesskey!: String;
  protected secretkey!: String;

  protected type!: String;
  protected filepath!: String;
  protected filetype!: String;
  protected sourceurl!: String;
  protected schema!: String;

  protected format!: String;
  protected bucket!: String;
  protected path!: String;
  protected dname!: String;
  protected prefix!: String;

  protected tablename!: String;
  protected columnname!: String;
  protected columntype!: String;

  jobForm = new FormGroup({
    jobname: new FormControl('', [Validators.required]),
    jobdesc: new FormControl('', [Validators.required]),
    vaulturl: new FormControl('', [Validators.required]),
    accesskey: new FormControl('', [Validators.required]),
    secretkey: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    filepath: new FormControl(''),
    filetype: new FormControl(''),
    sourceurl: new FormControl(''),
    schema: new FormControl(''),
    format: new FormControl('', [Validators.required]),
    bucket: new FormControl('', [Validators.required]),
    path: new FormControl('', [Validators.required]),
    dname: new FormControl('', [Validators.required]),
    prefix: new FormControl('', [Validators.required]),
    tablename: new FormControl('', [Validators.required]),
    columnname: new FormControl('', [Validators.required]),
    columntype: new FormControl('', [Validators.required])
  });
  
  constructor(@Inject(DOCUMENT) private document: Document, private httpService: HttpService) { 
    this.columnList = [];
  }
  
  ngAfterViewInit() {
    this.showTab(this.currentTab);
  }

  addColumn(): void {
    let column = {'name' : this.jobForm.value.columnname, 'type': this.jobForm.value.columntype};
    this.columnList.push(column);
    this.jobForm.controls.columnname.reset("");
    this.jobForm.controls.columntype.reset("");
  }

  deleteRow(item: any): void {
    this.columnList.splice(item, 1);
  }

  hideFields(): void {
    let typeSelected = this.jobForm.value.type;
    const filepathEl = this.document.getElementById("filepath") as HTMLElement;
    const filetypeEl = this.document.getElementById("filetype") as HTMLElement;
    const sourceurlEl = this.document.getElementById("sourceurl") as HTMLElement;
    const schemaEl = this.document.getElementById("schema") as HTMLElement;
    switch(typeSelected) {
      case "FILE_SYSTEM":
        this.jobForm.controls['filepath'].enable();
        filepathEl.classList.remove("optional");
        this.jobForm.controls['filetype'].enable();
        filetypeEl.classList.remove("optional");
        this.jobForm.controls['sourceurl'].disable();
        sourceurlEl.classList.add("optional");
        this.jobForm.controls['schema'].disable();
        schemaEl.classList.add("optional");
         break;
      case "DATABASE":
        this.jobForm.controls['filepath'].disable();
        filepathEl.classList.add("optional");
        this.jobForm.controls['filetype'].disable();
        filetypeEl.classList.add("optional");
        this.jobForm.controls['sourceurl'].enable();
        sourceurlEl.classList.remove("optional");
        this.jobForm.controls['schema'].enable();
        schemaEl.classList.remove("optional");
         break;
      default:
        this.jobForm.controls['filepath'].disable();
        filepathEl.classList.add("optional");
        this.jobForm.controls['filetype'].disable();
        filetypeEl.classList.add("optional");
        this.jobForm.controls['sourceurl'].disable();
        sourceurlEl.classList.add("optional");
        this.jobForm.controls['schema'].disable();
        schemaEl.classList.add("optional");
        
         break;
    }
  }

  refresh(): void {
    window.location.reload();
  }

  showTab(n: number): void {
    
    // Only show the selected tab
    let tabs = this.document.getElementsByClassName("tab");
    const myHtmlEl = tabs.item(n) as HTMLElement;
    myHtmlEl.style.display = 'block';

    // Decide whether to show the previous button or not
    const prevBtnEl = this.document.getElementById("prevBtn") as HTMLElement;
    const nextBtnEl = this.document.getElementById("nextBtn") as HTMLElement;

    if (n == 0) {
      prevBtnEl.style.display = "none";
      nextBtnEl.style.display = "inline";
    } else {
      prevBtnEl.style.display = "inline";
    }

    // Decide whether to show the previous button or not
    if (n == (tabs.length - 2)) {
      nextBtnEl.innerHTML = "Submit";
    } else {
      nextBtnEl.innerHTML = "Next";
    } 

    if (n == (tabs.length - 1)) {
      prevBtnEl.style.display = "none";
      nextBtnEl.style.display = "none";
    }

    // ... and run a function that displays the correct step indicator:
    this.fixStepIndicator(n);
  }

  restart(): void {
    let tabs = this.document.getElementsByClassName("tab");
    const myHtmlEl = tabs.item(this.currentTab) as HTMLElement;
    myHtmlEl.style.display = 'none';
    this.currentTab = 0;
    this.jobForm.reset();
    this.showTab(0);
  }

  nextPrev(n: number): boolean {
    let tabs = this.document.getElementsByClassName("tab");
    if (n == 1 && !this.validateForm()) return false;
    const myHtmlEl = tabs.item(this.currentTab) as HTMLElement;
    myHtmlEl.style.display = 'none';
    this.currentTab = this.currentTab + n;
    let payload = {};
    if (this.currentTab == 2) {
      payload = {
        "jobName": this.jobForm.value.jobname,
        "jobDescription": this.jobForm.value.jobdesc,
        "configuration": {
          "secret": {
            "vault_url": this.jobForm.value.vaulturl,
            "access_key": this.jobForm.value.accesskey,
            "secret_key": this.jobForm.value.secretkey
          }
        }
      };
      this.httpService.post("/datajobconfig/v1/api/accessdata", payload).subscribe();
    } else if (this.currentTab == 3) {
      let typeSelected = this.jobForm.value.type;
      switch(typeSelected) {
        case "FILE_SYSTEM":
          payload = {
            "jobName": this.jobForm.value.jobname,
            "jobDescription": this.jobForm.value.jobdesc,
            "source_type": this.jobForm.value.type,
            "path": this.jobForm.value.filepath,
            "file_type": this.jobForm.value.filetype,
            "jobConfigurations": [{
              "columns" : this.columnList
            }]
          };
          break;
          case "DATABASE":
            payload = {
              "jobName": this.jobForm.value.jobname,
              "jobDescription": this.jobForm.value.jobdesc,
              "source_type": this.jobForm.value.type,
              "source_url": this.jobForm.value.sourceurl,
              "schema": this.jobForm.value.schema,
              "jobConfigurations": [{
                "tables" : [{
                  "name" : this.jobForm.value.tablename,
                  "columns" : this.columnList
                }]
              }]
            };
            break;
          // case "KAFKA_STREAM":
          //   payload = {
          //     "jobName": this.jobForm.value.jobname,
          //     "jobDescription": this.jobForm.value.jobdesc,
          //     "source_type": this.jobForm.value.jobname,
          //     "source_url": this.jobForm.value.jobdesc,
          //     "topicName": this.jobForm.value.jobdesc,
          //     "topicType": this.jobForm.value.jobdesc,
          //     "source": {
          //       "source_url": this.jobForm.value.format,
          //       "is_streaming": this.jobForm.value.bucket,
          // "jobConfigurations": [{
          //   "columns" : this.columnList
          // }]
          //   };
          //   break;
      }
      this.httpService.post("/datajobconfig/v1/api/jobconfigurations", payload).subscribe();
    } else if (this.currentTab == 4) {
      payload = {
        "jobName": this.jobForm.value.jobname,
        "jobDescription": this.jobForm.value.jobdesc,
        "destination": {
          "format": this.jobForm.value.format,
          "bucket": this.jobForm.value.bucket,
          "path": this.jobForm.value.path,
          "name": this.jobForm.value.dname,
          "prefix": this.jobForm.value.prefix
        }
      };
      this.httpService.post("/datajobconfig/v1/api/destinationDetail", payload).subscribe();
    }

    if (this.currentTab >= tabs.length) {
      return false;
    }

    this.showTab(this.currentTab);
    return true;
  }

  validateForm(): boolean {
    let tabs, inputs, i, valid = true;
    tabs = this.document.getElementsByClassName("tab");
    inputs = tabs[this.currentTab].getElementsByTagName("input");
    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "" && !inputs[i].classList.contains("optional")) {
        inputs[i].classList.add("invalid");
        valid = false;
      } else {
        inputs[i].classList.remove("invalid");
      }
    }
    return valid;
  }

  fixStepIndicator(n: number) {
    let steps = this.document.getElementsByClassName("step");
    for (let i = 0; i < steps.length; i++) {
      steps[i].classList.remove("active");
    }
    steps[n].classList.add("active");
  }
}