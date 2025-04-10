import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {colorToString, hexToRgb} from '@common/shared/services/color-hash/color-hash.utils';
import {Store} from '@ngrx/store';
import {showColorPicker} from './choose-color.actions';

@Directive({
  selector: '[smChooseColor]',
})
export class ChooseColorDirective {
  readonly colorTopOffset    = 100;
  readonly colorPickerWidth  = 230;
  readonly colorPickerHeight = 460 - this.colorTopOffset;
  @Input() colorButtonRef;
  @Input() colorButtonClass: string;
  @Input() stringToColor: string | string[];
  @Input() colorPickerWithAlpha: boolean = false;
  private _defaultColor: number[];
  private defaultColorString: string;

  @Input() set smChooseColor(defaultColor: number[] | string) {
    if(typeof defaultColor === 'string') {
      this._defaultColor = hexToRgb(defaultColor);
    } else {
      this._defaultColor = defaultColor;
    }
    this.defaultColorString = colorToString(defaultColor);
  }

  get defaultColor() {
    return this._defaultColor;
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    const elementsWithClass = this.colorButtonClass ? Array.from(this.el.nativeElement.querySelectorAll(this.colorButtonClass)) : [];
    const matchingEl        = elementsWithClass.find(el => el === event.target);
    const matchingRef       = this.colorButtonRef?.nativeElement ? this.colorButtonRef.nativeElement : this.colorButtonRef;

    if (matchingEl || matchingRef === event.target) {
      event.stopPropagation();
      this.openColorPicker(event);
    }
  }

  constructor(private el: ElementRef, private store: Store) {}

  openColorPicker(event: MouseEvent) {
    let top = event.pageY - (this.colorPickerHeight / 3);
    let left = event.pageX;
    if (event.pageY + this.colorPickerHeight >= (window.innerHeight || document.documentElement.clientHeight)) {
      top = (event.pageY) - this.colorPickerHeight;
    }
    if (event.clientX + this.colorPickerWidth >= (window.innerWidth || document.documentElement.clientWidth)) {
      left = (event.clientX) - this.colorPickerWidth;
    }

    this.store.dispatch(showColorPicker({
      top,
      left,
      theme: 'light',
      defaultColor: this.defaultColorString,
      cacheKey: Array.isArray(this.stringToColor) ? structuredClone(this.stringToColor).sort().join() : this.stringToColor,
      alpha: this.colorPickerWithAlpha
    }));
    event.stopPropagation();
  }

}

