import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { StreakService } from './streak.service';
import { CreateStreakDTO, UpdateStreakDTO } from './dto/streak.dto';
import { Auth, IResponse, RoleEnum, successResponse } from 'src/common';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Auth([RoleEnum.user])
  @Post()
  async createStreak(@Body() body: CreateStreakDTO): Promise<IResponse> {
    await this.streakService.createStreak(body);
    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get(':userId')
  async getUserStreak(@Param('userId') userId: string): Promise<IResponse> {
    const streak = await this.streakService.getUserStreak(userId);
    return successResponse({ data: { streak } });
  }

  @Auth([RoleEnum.user])
  @Patch(':id')
  async updateStreak(@Param('id') id: string, @Body() body: UpdateStreakDTO): Promise<IResponse> {
    await this.streakService.updateStreak(id, body);
    return successResponse();
  }

  @Auth([RoleEnum.admin])
  @Delete(':id')
  async deleteStreak(@Param('id') id: string): Promise<IResponse> {
    await this.streakService.deleteStreak(id);
    return successResponse();
  }

  @Auth([RoleEnum.user])
  @Patch('increment/safe/:userId')
  async incrementSafeDriving(@Param('userId') userId: string): Promise<IResponse> {
    await this.streakService.incrementSafeDriving(userId);
    return successResponse({ message: 'Safe driving incremented' });
  }

  @Auth([RoleEnum.user])
  @Patch('increment/maintenance/:userId')
  async incrementMaintenance(@Param('userId') userId: string): Promise<IResponse> {
    await this.streakService.incrementMaintenance(userId);
    return successResponse({ message: 'Maintenance incremented' });
  }
}
