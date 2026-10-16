#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/241f5a06ac59c4007b0bf1f108df1819590edb7c09914022e59d8c313c5fbe25/contract';
import endContract from '../../snapshots/241f5a06ac59c4007b0bf1f108df1819590edb7c09914022e59d8c313c5fbe25/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c9449c4c0f74f9ea171a5808ded5ef6d7f6b94b6534e7ff688a33bc0771a13d5/contract';
import startContract from '../../snapshots/c9449c4c0f74f9ea171a5808ded5ef6d7f6b94b6534e7ff688a33bc0771a13d5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('createdAt', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
