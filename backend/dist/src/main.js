"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Habit Tracker API')
        .setDescription('API para gestión y seguimiento de hábitos')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
//# sourceMappingURL=main.js.map