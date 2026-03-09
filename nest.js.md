
### 1. High-Level Folder Structure

src/  
├── core/ # App-wide infrastructure (auth, redis, mail, etc)  
├── common/ # Generic, reusable utilities (pipes, decorators, types)  
├── integrations/ # External/Internal service wrappers (Stripe, AWS client)  
├── modules/ # Domain-driven modules (user, account, payment)  
├── events/ # Domain event publishers/listeners  
├── commands/ # CLI jobs, CRON logic  
├── app.module.ts   
└── main.ts

### 2. Folder Usage Rules

  
| Folder          | Purpose                                   | Examples                              |  
| --------------- | ----------------------------------------- | ------------------------------------- |  
| `core/`         | Shared internal infra modules             | `auth/`, `redis/`, `logger/`          |  
| `common/`       | Lightweight utils shared across modules   | `pipes/`, `decorators/`, `types/`     |  
| `integrations/` | API clients for external/internal systems | `stripe/`, `paytech/`, `aws/` ``        |  
| `modules/`      | Core business features/modules            | `account/`, `payee/`, `transaction/`  |  
| `commands/`     | One-off or repeated jobs                  | `process-transactions.command.ts`     |  
| `events/`       | Event-based architecture logic            | `account-updated/`, `payment-failed/` |  

### 3. Naming Conventions

| Type         | Convention                    | Example                       |  
|--------------|-------------------------------|-------------------------------|  
| Domain Folder| Singular                      | payee/, account/              |  
| Reusable Code| Plural                        | pipes/, utils/                |  
| Service      | [name].service.ts             | user.service.ts              |  
| Module       | [name].module.ts              | auth.module.ts                |  
| DTO          | [action]-[entity].dto.ts      | create-user.dto.ts           |  
| Client       | [provider]-[entity].client.ts | stripe-payment.client.ts      |  
| Guard/Pipe   | [name].guard.ts / .pipe.ts    | jwt.guard.ts                  |

### 4. Testing rules

| Type       | Location                      | Example                  |  
|------------|-------------------------------|--------------------------|  
| Unit Test  | Beside implementation file    | user.service.spec.ts     |  
| E2E Test   | In test/ or e2e/ folder       | user.e2e-spec.ts         |

## 5. File Placement Decision Tree

## You have a…

Business feature? → _modules/[feature]/_

## Get Nairi Abgaryan’s stories in your inbox

Join Medium for free to get updates from this writer.

DTO? → _modules/[feature]/dto/_

Decorator or utility?

* Module-specific? → _modules/[feature]/utils/_

* Global/shared? → _common/utils/_

Auth/redis config? → _core/_

External service wrapper? → _integrations/_

CLI job? → _commands/_

