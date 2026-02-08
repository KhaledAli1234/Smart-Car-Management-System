import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let user: any;
    switch (context.getType<string>()) {
      case 'http':
        user = context.switchToHttp().getRequest().credentials.user;
        break;

      case 'ws':
        user = context.switchToWs().getClient().credentials.user;
        break;

      // case 'graphql':
      //   user = GqlExecutionContext.create(context).getContext().req.credentials.user.role;
      //   break;

      default:
        break;
    }
    return user;
  },
);
