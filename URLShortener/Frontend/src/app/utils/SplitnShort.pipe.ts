import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitnshort',
})
export class SplitnShort implements PipeTransform {
  transform(value: any, character: string, takeSection: number,length:number) {
    const splitValue = value.split(character);
    let result = '';
    if (splitValue.length < takeSection) {
      result = splitValue[splitValue.length - 1];
    } else {
      result = splitValue[takeSection];
    }

    if (result.length > length) return result.substr(0, length)+' ...';
    else return result;
  }
}
