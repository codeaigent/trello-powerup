# Backend Implementation Design

## Overview
This document outlines the backend implementation for the CodeAIgent Trello Power-Up, focusing on handling webhook events and processing code change requests.

## Core Components

### 1. Webhook Handler
```typescript
// webhook/webhook.controller.ts
@Controller('webhooks/trello')
export class WebhookController {
  @Post()
  async handleTrelloWebhook(
    @Headers('x-trello-webhook') webhookSignature: string,
    @Body() payload: TrelloWebhookPayload
  ) {
    // Verify webhook signature
    // Process comment events
  }
}

interface TrelloWebhookPayload {
  action: {
    type: string;
    data: {
      text: string;
      card: {
        id: string;
        name: string;
        url: string;
      };
      board: {
        id: string;
        name: string;
      };
      member: {
        id: string;
        username: string;
      };
    };
  };
}
```

### 2. Comment Processing Service
```typescript
// comments/comment.service.ts
@Injectable()
export class CommentService {
  async processComment(payload: TrelloWebhookPayload): Promise<void> {
    // 1. Extract instruction from comment
    // 2. Validate request
    // 3. Queue for processing
  }

  private extractInstruction(comment: string): string {
    // Remove @codeaigent mention
    // Clean and format instruction
  }
}
```

### 3. Request Queue
```typescript
// queue/request.queue.ts
@Injectable()
export class RequestQueueService {
  constructor(
    @InjectQueue('code-requests') private requestQueue: Queue
  ) {}

  async addRequest(data: CodeChangeRequest): Promise<Job> {
    return this.requestQueue.add('process-request', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });
  }
}

interface CodeChangeRequest {
  cardId: string;
  instruction: string;
  boardId: string;
  requesterId: string;
  timestamp: Date;
}
```

### 4. AI Processing Service
```typescript
// ai/ai.service.ts
@Injectable()
export class AIService {
  async analyzeRequest(instruction: string): Promise<AIAnalysis> {
    // Process instruction with AI
    // Return structured code change plan
  }
}

interface AIAnalysis {
  targetRepo: string;
  targetFiles: string[];
  proposedChanges: {
    file: string;
    changes: string;
  }[];
  explanation: string;
}
```

### 5. GitHub Integration Service
```typescript
// github/github.service.ts
@Injectable()
export class GitHubService {
  async createPullRequest(analysis: AIAnalysis): Promise<GitHubResponse> {
    // 1. Clone/pull repository
    // 2. Create branch
    // 3. Apply changes
    // 4. Create PR
  }
}

interface GitHubResponse {
  prUrl: string;
  branch: string;
  commitHash: string;
}
```

### 6. Trello Integration Service
```typescript
// trello/trello.service.ts
@Injectable()
export class TrelloService {
  async postResponse(
    cardId: string,
    response: { prUrl: string; explanation: string }
  ): Promise<void> {
    // Post comment back to Trello card
  }
}
```

## Data Flow

1. **Webhook Reception**
   ```
   Trello Comment → Webhook Controller → Comment Service
   ```

2. **Request Processing**
   ```
   Comment Service → Request Queue → AI Service
   ```

3. **Code Changes**
   ```
   AI Service → GitHub Service → Pull Request
   ```

4. **Response**
   ```
   GitHub Service → Trello Service → Card Comment
   ```

## Environment Configuration
```typescript
// config/configuration.ts
export default () => ({
  trello: {
    apiKey: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_TOKEN,
    webhookSecret: process.env.TRELLO_WEBHOOK_SECRET,
  },
  github: {
    token: process.env.GITHUB_TOKEN,
    organization: process.env.GITHUB_ORG,
  },
  ai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
```

## Error Handling

### 1. Webhook Validation
- Verify Trello webhook signatures
- Validate payload structure
- Handle duplicate events

### 2. Request Processing
- Queue job retry mechanism
- Invalid instruction handling
- AI service error handling

### 3. GitHub Operations
- Repository access errors
- Branch conflicts
- PR creation failures

## Monitoring and Logging

### 1. Request Tracking
```typescript
interface RequestLog {
  requestId: string;
  cardId: string;
  status: 'received' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  error?: string;
}
```

### 2. Performance Metrics
- Webhook processing time
- AI analysis duration
- GitHub operation latency
- Queue length and processing time

## Next Steps

1. **Phase 1: Basic Implementation**
   - Set up webhook endpoint
   - Implement comment processing
   - Basic AI integration
   - Simple GitHub PR creation

2. **Phase 2: Enhancements**
   - Add request queuing
   - Implement retry mechanisms
   - Add monitoring and logging
   - Enhance error handling

3. **Phase 3: Advanced Features**
   - Multiple repository support
   - Advanced AI processing
   - PR templates and formatting
   - Status tracking and updates 