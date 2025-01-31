import {
  CACHE_MANAGER,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { ApiProperty } from '@nestjs/swagger';

const GAEPO = 'gaepo';
const SECHO = 'secho';

export class GetFtCheckinDto {
  @ApiProperty({ example: 42 })
  gaepo: number;

  @ApiProperty({ example: 0 })
  seocho: number;
}

@Injectable()
export class FtCheckinService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async fetchData(
    cacheKey: string,
    cacheTTL: number,
    endpoint: string,
  ): Promise<GetFtCheckinDto> {
    const ftCheckinData = await this.cacheManager.get<GetFtCheckinDto>(
      cacheKey,
    );

    if (!ftCheckinData) {
      try {
        const { data } = await axios.get(endpoint);
        const realData = {
          seocho: data[SECHO] || 0,
          gaepo: data[GAEPO] || 0,
        };

        await this.cacheManager.set(cacheKey, realData, {
          ttl: cacheTTL,
        });
        return realData;
      } catch (e) {
        console.error(e);
        throw new NotFoundException('데이터를 받아올 수 없습니다.');
      }
    }
    return ftCheckinData;
  }
}
