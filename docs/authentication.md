# Authentication Flow Implementation

## Overview
This document outlines the secure authentication flow implementation for the NestJS backend, handling Trello token registration and webhook setup.

## Security Middleware

```typescript
// src/auth/middleware/auth.middleware.ts
@Injectable()
export class AuthValidationMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const timestamp = req.header('X-Request-Timestamp');
    const signature = req.header('X-Request-Signature');
    const powerUpToken = req.header('X-Power-Up-Token');
    const trelloToken = req.header('X-Trello-Token');

    // Validate timestamp (prevent replay attacks)
    const now = Date.now();
    if (Math.abs(now - parseInt(timestamp)) > 300000) { // 5 minutes
      throw new UnauthorizedException('Request expired');
    }

    // Validate Power-Up token
    if (powerUpToken !== this.configService.get('POWERUP_API_KEY')) {
      throw new UnauthorizedException('Invalid Power-Up');
    }

    // Verify request signature
    const expectedSignature = await this.generateSignature(req.body, timestamp);
    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Add validated token to request
    req['trelloToken'] = trelloToken;
    next();
  }

  private async generateSignature(data: any, timestamp: string): Promise<string> {
    const message = timestamp + JSON.stringify(data);
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
```

## API Endpoint

```typescript
// src/auth/auth.controller.ts
@Controller('api/auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly webhookService: WebhookService,
  ) {}

  @Post('trello')
  async registerTrelloAuth(
    @Headers('X-Trello-Token') token: string,
    @Body() authData: TrelloAuthDto
  ) {
    return this.authService.registerTrelloAuth(token, authData);
  }
}

// src/auth/dto/trello-auth.dto.ts
export class TrelloAuthDto {
  member: {
    id: string;
    username: string;
    fullName: string;
  };
  board: {
    id: string;
    name: string;
  };
}
```

## Auth Service with Encryption

```typescript
// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
    @InjectRepository(UserAuth)
    private readonly userAuthRepo: Repository<UserAuth>,
  ) {}

  async registerTrelloAuth(token: string, authData: TrelloAuthDto) {
    // Encrypt token before storing
    const encryptedToken = await this.encryptToken(token);

    // 1. Store user and encrypted token information
    const userAuth = await this.userAuthRepo.save({
      trelloUserId: authData.member.id,
      trelloUsername: authData.member.username,
      trelloEmail: authData.member.email,
      trelloToken: encryptedToken,
      boardId: authData.board.id,
      boardName: authData.board.name,
    });

    // 2. Create webhooks for the board using original token
    await this.webhookService.createBoardWebhooks(
      authData.board.id,
      token,
    );

    return {
      success: true,
      userId: userAuth.id,
    };
  }

  private async encryptToken(token: string): Promise<string> {
    const key = this.configService.get('ENCRYPTION_KEY');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Store IV and auth tag with the encrypted data
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  async decryptToken(encryptedData: string): Promise<string> {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const key = this.configService.get('ENCRYPTION_KEY');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

## Environment Variables

```env
POWERUP_API_KEY=your_trello_api_key
WEBHOOK_CALLBACK_URL=https://your-backend-url.com
ENCRYPTION_KEY=your-32-byte-encryption-key
```

## Security Measures

1. **Transport Security**
   - Force HTTPS using Helmet middleware
   - Implement CORS for Power-Up domain only

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable HTTPS-only
  app.use(helmet());
  
  // Configure CORS
  app.enableCors({
    origin: process.env.POWERUP_DOMAIN,
    methods: ['POST'],
    allowedHeaders: [
      'Content-Type',
      'X-Trello-Token',
      'X-Request-Timestamp',
      'X-Request-Signature',
      'X-Power-Up-Token'
    ],
  });

  await app.listen(3000);
}
```

2. **Token Security**
   - Tokens encrypted at rest using AES-256-GCM
   - Tokens transmitted in headers
   - Request signing prevents tampering
   - Timestamp validation prevents replay attacks

3. **Database Security**
   - Encrypted tokens in database
   - No plain text sensitive data
   - Separate encryption key from application

## Error Handling

```typescript
@Injectable()
export class AuthService {
  async registerTrelloAuth(token: string, authData: TrelloAuthDto) {
    try {
      // ... implementation ...
    } catch (error) {
      this.logger.error('Failed to register Trello auth', {
        error,
        userId: authData.member.id,
        boardId: authData.board.id,
      });

      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid Trello token');
      }
      if (error instanceof TokenEncryptionError) {
        throw new InternalServerErrorException('Failed to secure token');
      }
      throw new InternalServerErrorException('Failed to register auth');
    }
  }
}
``` 