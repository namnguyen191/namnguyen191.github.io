import type { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { delay } from 'rxjs';

export const globalDelayInterceptorFactory = (delayTime: number): HttpInterceptorFn => {
  const globalDelayInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ) => next(req).pipe(delay(delayTime));

  return globalDelayInterceptor;
};
