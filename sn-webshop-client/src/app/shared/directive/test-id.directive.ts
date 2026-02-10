import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

export const dataTestid = 'data-testid'; // Konvention für Test-Id's

@Directive({ selector: '[snTestId]' })
export class TestIdDirective {
  snTestId = input.required<string>();

  private readonly host = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      this.renderer.setAttribute(this.host.nativeElement, dataTestid, this.dataTestId());
    });
  }
}
