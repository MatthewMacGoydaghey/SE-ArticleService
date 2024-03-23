import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [CacheModule.registerAsync({
    useFactory: async () => ({
      store: await redisStore({
        socket: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT
        }}),
    }),
  })],
  exports: [CacheModule.registerAsync({
    useFactory: async () => ({
      store: await redisStore({
        socket: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT
        }}),
    }),
  })]
})
export class RedisModule {}
