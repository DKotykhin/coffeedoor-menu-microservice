import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch(HttpException)
export class TranslateHttpToGrpcExceptionFilter implements ExceptionFilter {
  static HttpStatusCode: Record<number, number> = {
    [HttpStatus.BAD_REQUEST]: 3,
    [HttpStatus.UNAUTHORIZED]: 16,
    [HttpStatus.FORBIDDEN]: 7,
    [HttpStatus.NOT_FOUND]: 5,
    [HttpStatus.CONFLICT]: 6,
    [HttpStatus.GONE]: 10,
    [HttpStatus.TOO_MANY_REQUESTS]: 8,
    499: 1,
    [HttpStatus.INTERNAL_SERVER_ERROR]: 13,
    [HttpStatus.NOT_IMPLEMENTED]: 12,
    [HttpStatus.BAD_GATEWAY]: 2,
    [HttpStatus.SERVICE_UNAVAILABLE]: 14,
    [HttpStatus.GATEWAY_TIMEOUT]: 4,
    [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: 14,
    [HttpStatus.PAYLOAD_TOO_LARGE]: 11,
    [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 1,
    [HttpStatus.UNPROCESSABLE_ENTITY]: 1,
    [HttpStatus.I_AM_A_TEAPOT]: 2,
    [HttpStatus.METHOD_NOT_ALLOWED]: 1,
    [HttpStatus.PRECONDITION_FAILED]: 9,
  };

  catch(exception: HttpException): Observable<never> | void {
    const httpStatus = exception.getStatus();
    const httpRes = exception.getResponse() as {
      details?: unknown;
      message: unknown;
    };

    return throwError(() => ({
      code: TranslateHttpToGrpcExceptionFilter.HttpStatusCode[httpStatus] ?? 2,
      message: httpRes.message || exception.message,
      details: Array.isArray(httpRes.details)
        ? httpRes.details
        : httpRes.message,
    }));
  }
}
