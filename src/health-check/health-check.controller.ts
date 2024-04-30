import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import {
  HEALTH_CHECK_SERVICE_NAME,
  HealthCheckControllerMethods,
  HealthCheckResponse_ServingStatus,
} from './health-check.pb';

@HealthCheckControllerMethods()
@Controller()
export class HealthCheckController {
  protected readonly logger = new Logger(HealthCheckController.name);

  @GrpcMethod(HEALTH_CHECK_SERVICE_NAME, 'Check')
  check(): { status: HealthCheckResponse_ServingStatus } {
    this.logger.log('Health check request received');
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }
}
