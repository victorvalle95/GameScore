import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/services/config/config.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private route: ActivatedRoute, private configService: ConfigService, private router: Router) { }

  token: string;
  params: Params;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      withCredentials: Boolean(this.configService.getProperty('enabled_security'))
    });

    return next.handle(request).pipe(tap(() => { },
    (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status !== 401) {
          return;
        }
        this.router.navigate(['error']);
      }
    }));
  }
}
