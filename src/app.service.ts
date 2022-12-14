// Core
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map, tap } from 'rxjs';

// Data
import { FALLBACK_COURSES, POLL, POLL_VOTES } from './data/mock';

// DTO
import { GetPollVotesDto } from './dto/get-poll-votes.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private readonly fallbackCourses = FALLBACK_COURSES;

  private readonly poll = POLL;

  private readonly pollVotes = POLL_VOTES;

  private readonly authCredentials = {
    login: 'demo',
    password: 'demo',
  };

  constructor(private readonly httpService: HttpService) {}

  private async sleep(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 5000);
    });
  }

  public async auth(body: AuthDto) {
    const isLoginCorrect = body.login === this.authCredentials.login;
    const isPassCorrect = body.password === this.authCredentials.password;
    if (!isLoginCorrect || !isPassCorrect) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      user_id: Math.floor(Math.random() * 1000),
    };
  }

  public async getCourses() {
    try {
      const result = await firstValueFrom(
        this.httpService.get('https://www.cbr-xml-daily.ru/daily_json.js').pipe(
          tap(() => this.logger.log('Success fetch')),
          map((data) => data.data),
        ),
      );
      await this.sleep();
      return {
        date: result.Date,
        response: result,
      };
    } catch (error) {
      this.logger.error(`Fetch failed: ${error?.message}`);
      await this.sleep();
      return this.fallbackCourses;
    }
  }

  public async getPoll() {
    const index = Math.floor(Math.random() * this.poll.length);
    return this.poll[index];
  }

  public async getPollVotes(body: GetPollVotesDto) {
    if (isNaN(Number(body.vote))) {
      throw new BadRequestException('Data invalid');
    }
    if (Number(body.vote) < 1 || Number(body.vote) > 3) {
      throw new BadRequestException("This poll doesn't exist");
    }
    const poll = this.poll.find((i) => i.id === Number(body.vote));
    return poll.data.answers.reduce(
      (acc, prev, index) => {
        const votes = this.pollVotes.find((i) => i.id === Number(body.vote));
        acc.stat.push({
          answer: prev,
          votes: votes.votes[index],
        });
        return acc;
      },
      { stat: [] },
    );
  }
}
