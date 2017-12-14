import { Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateEmail]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateEmail), multi: true }]
})
export class ValidateEmail implements Validator {

  constructor() { }

  validate(c: AbstractControl): { [key: string]: any } {
    let EMAIL_REGEXP =  /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    if (!c.value) return null;
    return EMAIL_REGEXP.test(c.value) ? null : {
      validEmail: true
    };
  }
}