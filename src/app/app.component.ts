import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import { HttpService } from './http.service';
// import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  currentTab: number = 5;
  typeList: any = ["Database", "Kafka", "Filesystem"];
  columnList: any = [];
  // kafkaData: string[] = [];

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
  protected kafkaurl!: String;
  protected topicname!: String;
  protected topictype!: String;
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
    type: new FormControl('FILE_SYSTEM', [Validators.required]),
    filepath: new FormControl(''),
    filetype: new FormControl('', [Validators.pattern('csv|json|parquet')]),
    sourceurl: new FormControl(''),
    schema: new FormControl(''),
    kafkaurl: new FormControl(''),
    topicname: new FormControl(''),
    topictype: new FormControl(''),
    format: new FormControl('', [Validators.required, Validators.pattern('avro|parquet|csv')]),
    bucket: new FormControl('', [Validators.required, Validators.pattern('^GCP:[A-Za-z]+$')]),
    path: new FormControl('', [Validators.required]),
    dname: new FormControl('', [Validators.required]),
    prefix: new FormControl('', [Validators.required]),
    tablename: new FormControl('', [Validators.required]),
    columnname: new FormControl('', [Validators.required]),
    columntype: new FormControl('', [Validators.required])
  });
  
  constructor(@Inject(DOCUMENT) private document: Document, 
      private httpService: HttpService
      // ,private websocketService: WebsocketService
    ) {}
  
  ngAfterViewInit() {
    this.showTab(this.currentTab);
  }

  addColumn(): void {
    if(this.jobForm.value.columnname && this.jobForm.value.columntype) {
      let column = {'name' : this.jobForm.value.columnname, 'type': this.jobForm.value.columntype};
      this.columnList.push(column);
      this.jobForm.controls.columnname.reset("");
      this.jobForm.controls.columntype.reset("");
    }
  }

  deleteColumn(item: any): void {
    this.columnList.splice(item, 1);
  }

  hideFields(): void {
    let typeSelected = this.jobForm.value.type;
    const filesystemDiv = this.document.getElementById("filesystem") as HTMLElement;
    const databaseDiv = this.document.getElementById("database") as HTMLElement;
    const kafkaDiv = this.document.getElementById("kafka") as HTMLElement;
    const filepathEl = this.document.getElementById("filepath") as HTMLElement;
    const filetypeEl = this.document.getElementById("filetype") as HTMLElement;
    const sourceurlEl = this.document.getElementById("sourceurl") as HTMLElement;
    const schemaEl = this.document.getElementById("schema") as HTMLElement;
    const kafkaurlEl = this.document.getElementById("kafkaurl") as HTMLElement;
    const topicnameEl = this.document.getElementById("topicname") as HTMLElement;
    const topictypeEl = this.document.getElementById("topictype") as HTMLElement;
    const tableEl = this.document.getElementById("tablename") as HTMLElement;
    const configEl = this.document.getElementById("config") as HTMLElement;
    switch(typeSelected) {
      case "FILE_SYSTEM":
        filesystemDiv.style.display = 'block';
        databaseDiv.style.display = 'none';
        kafkaDiv.style.display = 'none';
        tableEl.style.display = 'none';
        configEl.style.display = 'block';
        filepathEl.classList.remove("optional");
        filetypeEl.classList.remove("optional");
        sourceurlEl.classList.add("optional");
        schemaEl.classList.add("optional");
        kafkaurlEl.classList.add("optional");
        topicnameEl.classList.add("optional");
        topictypeEl.classList.add("optional");
        break;
      case "DATABASE":
        filesystemDiv.style.display = 'none';
        databaseDiv.style.display = 'block';
        kafkaDiv.style.display = 'none';
        tableEl.style.display = 'block';
        configEl.style.display = 'block';
        filepathEl.classList.add("optional");
        filetypeEl.classList.add("optional");
        sourceurlEl.classList.remove("optional");
        schemaEl.classList.remove("optional");
        kafkaurlEl.classList.add("optional");
        topicnameEl.classList.add("optional");
        topictypeEl.classList.add("optional");
        break;
      default:
        filesystemDiv.style.display = 'none';
        databaseDiv.style.display = 'none';
        kafkaDiv.style.display = 'block';
        tableEl.style.display = 'none';
        configEl.style.display = 'none';
        filepathEl.classList.add("optional");
        filetypeEl.classList.add("optional");
        sourceurlEl.classList.add("optional");
        schemaEl.classList.add("optional");
        kafkaurlEl.classList.remove("optional");
        topicnameEl.classList.remove("optional");
        topictypeEl.classList.remove("optional");
        break;
    }
  }

  showTab(n: number): void {
    let tabs = this.document.getElementsByClassName("tab");
    const myHtmlEl = tabs.item(n) as HTMLElement;
    myHtmlEl.style.display = 'block';
    const prevBtnEl = this.document.getElementById("prevBtn") as HTMLElement;
    const nextBtnEl = this.document.getElementById("nextBtn") as HTMLElement;
    if (n == 0) {
      prevBtnEl.style.display = "none";
      nextBtnEl.style.display = "inline";
    } else {
      prevBtnEl.style.display = "inline";
    }
    if (n == (tabs.length - 2)) {
      nextBtnEl.innerHTML = "Confirm";
    } else {
      nextBtnEl.innerHTML = "Next";
    } 
    if (n == (tabs.length - 1)) {
      prevBtnEl.style.display = "none";
      nextBtnEl.style.display = "none";
    }
    this.fixStepIndicator(n);
  }

  restart(): void {
    let tabs = this.document.getElementsByClassName("tab");
    const myHtmlEl = tabs.item(this.currentTab) as HTMLElement;
    myHtmlEl.style.display = 'none';
    this.columnList = [];
    this.jobForm.value.type = 'FILE_SYSTEM';
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
              "dataBaseJobConfigurations": [{
                "tables" : [{
                  "name" : this.jobForm.value.tablename,
                  "columns" : this.columnList
                }]
              }]
            };
            break;
          case "KAFKA_STREAM":
            payload = {
              "jobName": this.jobForm.value.jobname,
              "jobDescription": this.jobForm.value.jobdesc,
              "source_type": this.jobForm.value.jobname,
              "source_url": this.jobForm.value.kafkaurl,
              "topicName": this.jobForm.value.topicname,
              "topicType": this.jobForm.value.topictype,
              "jobConfigurations": [{
                "columns" : this.columnList
              }]
            };
            break;
      }
      this.httpService.post("/datajobconfig/v1/api/jobconfigurations", payload).subscribe();
    } else if (this.currentTab == 5) {
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
      // this.websocketService.getMessages().subscribe(message => {
      //   this.kafkaData.push(message);
      // });
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