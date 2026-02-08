import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { RoleEnum, SignatureLevelEnum, TokenEnum } from '../enums';
import {
  TokenDocument,
  TokenRepository,
  UserDocument,
  UserRepository,
} from 'src/DB';
import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import { parseObjectId } from '../utils';
import { LoginCredentialsResponse } from '../entities';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtservice: JwtService,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}
  generateToken = async ({
    payload,
    options = {
      secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    },
  }: {
    payload: object;
    options?: JwtSignOptions;
  }): Promise<string> => {
    return await this.jwtservice.signAsync(payload, options);
  };

  verifyToken = async ({
    token,
    options = {
      secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
    },
  }: {
    token: string;
    options?: JwtVerifyOptions;
  }): Promise<JwtPayload> => {
    return (await this.jwtservice.verifyAsync(
      token,
      options,
    )) as unknown as JwtPayload;
  };

  detectSignatureLevel = async (
    role: RoleEnum,
  ): Promise<SignatureLevelEnum> => {
    let signatureLevel: SignatureLevelEnum = SignatureLevelEnum.bearer;
    switch (role) {
      case RoleEnum.admin:
      case RoleEnum.superAdmin:
        signatureLevel = SignatureLevelEnum.system;
        break;

      default:
        signatureLevel = SignatureLevelEnum.bearer;
        break;
    }
    return signatureLevel;
  };

  getSignature = async (
    signatureLevel: SignatureLevelEnum = SignatureLevelEnum.bearer,
  ): Promise<{ access_signature: string; refresh_signature: string }> => {
    let signatures: { access_signature: string; refresh_signature: string } = {
      access_signature: '',
      refresh_signature: '',
    };

    switch (signatureLevel) {
      case SignatureLevelEnum.system:
        signatures.access_signature = process.env
          .ACCESS_SYSTEM_TOKEN_SIGNATURE as string;
        signatures.refresh_signature = process.env
          .REFRESH_SYSTEM_TOKEN_SIGNATURE as string;
        break;

      default:
        signatures.access_signature = process.env
          .ACCESS_USER_TOKEN_SIGNATURE as string;
        signatures.refresh_signature = process.env
          .REFRESH_USER_TOKEN_SIGNATURE as string;
        break;
    }

    return signatures;
  };

  decodedToken = async ({
    authorization,
    tokenType = TokenEnum.access,
  }: {
    authorization: string;
    tokenType?: TokenEnum;
  }) => {
    try {
      const [bearerKey, token] = authorization?.split(' ') || [];

      if (!bearerKey || !token) {
        throw new UnauthorizedException('Token is missing');
      }

      let signatures = await this.getSignature(bearerKey as SignatureLevelEnum);

      const decoded = await this.verifyToken({
        token,
        options: {
          secret:
            tokenType === TokenEnum.refresh
              ? signatures.refresh_signature
              : signatures.access_signature,
        },
      });

      if (!decoded?.sub || !decoded?.iat) {
        throw new BadRequestException('Invalid token payload');
      }

      if (
        await this.tokenRepository.findOne({
          filter: { jti: decoded.jti },
        })
      ) {
        throw new UnauthorizedException('invalid login credentials');
      }

      const user = (await this.userRepository.findOne({
        filter: { _id: new Types.ObjectId(decoded.sub) },
      })) as UserDocument;

      if (!user) {
        throw new BadRequestException('Not register account');
      }

      if ((user.changeCredentialsTime?.getTime() || 0) > decoded.iat * 1000) {
        throw new UnauthorizedException('invalid login credentials');
      }

      return { user, decoded };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'somthing went wrong!!',
      );
    }
  };

  createLoginCredentials = async (
    user: UserDocument,
  ): Promise<LoginCredentialsResponse> => {
    const signatureLevel = await this.detectSignatureLevel(user.role);
    const signatures = await this.getSignature(signatureLevel);
    const jwtid = randomUUID();
    const payload = {
      sub: user._id.toString(),
    };
    const access_token = await this.generateToken({
      payload,
      options: {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
        secret: signatures.access_signature,
        jwtid,
      },
    });

    const refresh_token = await this.generateToken({
      payload,
      options: {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
        secret: signatures.refresh_signature,
        jwtid,
      },
    });

    return { access_token, refresh_token };
  };

  createRevokeToken = async (decoded: JwtPayload): Promise<TokenDocument> => {
    const [result] =
      (await this.tokenRepository.create({
        data: [
          {
            jti: decoded.jti as string,
            expiredAt: new Date(
              (decoded.iat as number) +
                Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
            ),
            createdBy: parseObjectId(decoded.sub as string),
          },
        ],
      })) || [];

    if (!result) {
      throw new BadRequestException('fail to revoke this token');
    }
    return result;
  };
}
