import {Observable} from "rxjs/Observable";
import {Component, View, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Response} from 'angular2/http';

import {PageRequest, Page, User} from "app/interfaces";
import {HttpErrorHandler, LoginService} from "app/services";
import {Gravatar, Pager} from 'app/components';

@Component({
  selector: 'user-list',
  properties: ['listProvider'],
})
@View({
  styles: [require('./user-list.scss')],
  template: require('./user-list.html'),
  directives: [
    CORE_DIRECTIVES,
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES,
    Gravatar,
    Pager,
  ],
})
export class UserList implements OnInit {

  listProvider:(params:{maxId:number, count:number}) => Observable<User[]>;
  users:User[] = [];
  noMoreUsers:boolean = false;

  constructor(private errorHandler:HttpErrorHandler) {
  }

  ngOnInit():any {
    this.list();
  }

  list(maxId = null) {
    this.listProvider({maxId: maxId, count: 5})
      .subscribe(users => {
          this.users = this.users.concat(users);
          this.noMoreUsers = users.length == 0;
        }, e => this.errorHandler.handle(e)
      )
    ;
  }

  loadMore() {
    const lastUser = this.users[this.users.length - 1];
    if (!lastUser) return false;
    this.list(lastUser.id);
  }

}
