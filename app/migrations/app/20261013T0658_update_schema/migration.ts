#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/456c3c9898bc420d368b969ac0fb34d7abd874cabbf0abcae22442348e1f1ce4/contract';
import startContract from '../../snapshots/456c3c9898bc420d368b969ac0fb34d7abd874cabbf0abcae22442348e1f1ce4/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c9449c4c0f74f9ea171a5808ded5ef6d7f6b94b6534e7ff688a33bc0771a13d5/contract';
import endContract from '../../snapshots/c9449c4c0f74f9ea171a5808ded5ef6d7f6b94b6534e7ff688a33bc0771a13d5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_provider_check_a8bf08f3',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_role_check_5cb23cec',
      }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'provider' }),
      this.dropColumn({ schema: 'public', table: 'User', column: 'role' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('password', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-User-password', {
        check: () => placeholder('backfill-User-password:check'),
        run: () => placeholder('backfill-User-password:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'password' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('providers', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-User-providers', {
        check: () => placeholder('backfill-User-providers:check'),
        run: () => placeholder('backfill-User-providers:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'providers' }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_providers_check_850f1a02',
        expression: `"providers" IN ('Google')`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
