import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose'
import { UsersModule } from './../src/users/users.module';
import {AuthModule} from './../src/auth/auth.module'
import { UsersController } from './../src/users/users.controller';
import { UsersService } from './../src/users/users.service';

import * as mongoose from 'mongoose';
const sinon = require('sinon');

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers:[UsersController],
      providers:[UsersService,Model]
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/me')
      .expect(200)
      .expect('Hello World!');
  });

  // it('/login (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/login?email=115@gmail.com?password=121312')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  it('/login (POST)', async () => {
    const requestBody = {
      username: 'mainbao3',
      password: '121312',
    }
    await request(app.getHttpServer())
      .post('/users/login')
      .send(requestBody)
      .expect(201)
  })

  afterAll(async () => {
    mongoose.disconnect();
  });
});
