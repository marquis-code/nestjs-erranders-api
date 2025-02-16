import { ValidationPipe, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { ProductModule } from "./product/product.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, logger: ['error', 'debug'] });

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix("/api/v1").useGlobalPipes(new ValidationPipe()
  );
  const options = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API description")
    .setVersion("1.0")
    .addTag("API")
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [UserModule, ProductModule],
  });
  SwaggerModule.setup("api", app, document);

  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  }

  app.enableCors(corsOptions);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  const logMessage = `Application is running on: http://localhost:${PORT}`;
  logger.log(logMessage);
  console.log(logMessage); // Output logged message to console
}

bootstrap();
