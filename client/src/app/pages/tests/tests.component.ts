import {Component, OnInit} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../shared/app.state';

import { NbDialogService } from '@nebular/theme';

import { PricePromptComponent } from './components/price-prompt.component';

import axios from 'axios';
import { UpdateProfile } from '../../shared/app.actions';

interface TestInput {
  TestId: number;
  price: number;
}

interface Option {
  value: number;
  text: string;
}

@Component({
  selector: 'ngx-tests',
  styleUrls: ['./tests.component.scss'],
  templateUrl: './tests.component.html',
})
export class TestsComponent implements OnInit {
  
  @Select(AppState) app$;

  state: any;
  
  testInput: TestInput = {
    TestId: null,
    price: null
  };

  selectedTestName: string = null;

  testList: Option[] = [
  ];

  constructor(
    private store: Store,
    private dialogService: NbDialogService
  ) {
    this.app$.subscribe(e => {
      this.state = e;
    });
  }

  onTestChanged(selectedTestName) {
    let test = this.testList.find(v => v.text === selectedTestName);
    if (test) {
      this.testInput.TestId = test.value;
    } else {
      this.selectedTestName = null;
    }
  }

  ngOnInit() {
    axios.get('/api/entity/test').then((response) => {
      this.testList = response.data.map((node) => ({ value: node.id, text: node.name }));
    });
  }

  add() {
    axios.post('/api/update', {
      tests: {
        add: [
          this.testInput
        ]
      }
    }, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json', 'authorization': this.state.token }
    }).then((response) => {
      if (!response.data.updated) {
        console.error('Update failed');
        return;
      }
      this.store.dispatch([
        new UpdateProfile()
      ]);
      // reset
      this.testInput.TestId = null;
      this.testInput.price = null;
    }).catch((error) => {
      console.error(error);
    });
  }

  editPrice(id) {
    this.dialogService.open(PricePromptComponent).onClose.subscribe(price => {
      
      if (!price) return;

      axios.post(`/api/entity/test/${id}`, { price }, {
        responseType: 'json',
        headers: { 'Content-Type': 'application/json', 'authorization': this.state.token }
      }).then((response) => {
        this.store.dispatch([
          new UpdateProfile()
        ]);
      });
    });
  }

  delete(id) {
    axios.delete(`/api/entity/test/${id}`, {
      responseType: 'json',
      headers: { 'Content-Type': 'application/json', 'authorization': this.state.token }
    }).then((response) => {
      if (!response.data.deleted) {
        console.error('Deletion failed');
        return;
      }
      this.store.dispatch([
        new UpdateProfile()
      ]);
    });
  }
}
