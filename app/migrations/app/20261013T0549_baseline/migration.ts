#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/456c3c9898bc420d368b969ac0fb34d7abd874cabbf0abcae22442348e1f1ce4/contract';
import endContract from '../../snapshots/456c3c9898bc420d368b969ac0fb34d7abd874cabbf0abcae22442348e1f1ce4/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Stream',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('Stream_type_check_57ce915b', `"type" IN ('Spotify', 'Youtube')`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Upvote',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('streamId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('provider', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('User_provider_check_a8bf08f3', `"provider" IN ('Google')`),
          checkExpression('User_role_check_5cb23cec', `"role" IN ('Streamer', 'EndUser')`),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Upvote',
        constraint: 'Upvote_userId_streamId_key',
        columns: ['userId', 'streamId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Stream',
        index: 'Stream_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Upvote',
        index: 'Upvote_streamId_idx_1373138e',
        columns: ['streamId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Upvote',
        index: 'Upvote_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Stream',
        foreignKey: {
          name: 'Stream_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Upvote',
        foreignKey: {
          name: 'Upvote_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Upvote',
        foreignKey: {
          name: 'Upvote_streamId_fkey',
          columns: ['streamId'],
          references: { schema: 'public', table: 'Stream', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
